import json
import os
from io import BytesIO
from types import SimpleNamespace
from unittest.mock import patch
from urllib.error import URLError

from django.test import SimpleTestCase

from django_server import ai_service


def provider_completion(content):
    return SimpleNamespace(
        choices=[SimpleNamespace(message=SimpleNamespace(content=content))]
    )


class ChatApiTests(SimpleTestCase):
    def setUp(self):
        ai_service._REQUEST_TIMES.clear()
        environment = patch.dict(os.environ, {
            'AI_PROVIDER': 'ollama',
            'OLLAMA_BASE_URL': 'http://127.0.0.1:11434',
            'OLLAMA_MODEL': 'qwen2.5:3b',
            'OPENAI_API_KEY': '',
        })
        environment.start()
        self.addCleanup(environment.stop)

    @patch('django_server.urls.is_rate_limited', return_value=False)
    def test_chat_requires_post(self, _rate_limit):
        response = self.client.get('/api/chat/')

        self.assertEqual(response.status_code, 405)

    @patch('django_server.urls.is_rate_limited', return_value=False)
    def test_chat_rejects_invalid_json(self, _rate_limit):
        response = self.client.post(
            '/api/chat/',
            data='{',
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn('JSON', response.json()['message'])

    def test_default_provider_uses_local_model_without_openai_key(self):
        with patch.dict(os.environ, {
            'AI_PROVIDER': 'ollama',
            'OLLAMA_MODEL': '',
            'OLLAMA_BASE_URL': '',
            'OPENAI_API_KEY': '',
        }):
            config = ai_service._config()
            with patch('django_server.ai_service._ensure_ollama_model'):
                credentials = ai_service._client_credentials(config)

        self.assertEqual(config['model'], 'qwen2.5:3b')
        self.assertEqual(config['base_url'], 'http://127.0.0.1:11434')
        self.assertEqual(credentials, {
            'api_key': 'ollama',
            'base_url': 'http://127.0.0.1:11434/v1',
        })

    @patch('django_server.ai_service.urlopen')
    def test_installed_ollama_model_is_detected(self, urlopen):
        response = BytesIO(json.dumps({
            'models': [{'name': 'qwen2.5:3b'}],
        }).encode())
        urlopen.return_value.__enter__.return_value = response

        ai_service._ensure_ollama_model(ai_service._config())

        self.assertEqual(urlopen.call_args.args[0], 'http://127.0.0.1:11434/api/tags')

    @patch('django_server.ai_service.urlopen')
    def test_missing_ollama_model_is_not_reported_ready(self, urlopen):
        response = BytesIO(json.dumps({'models': []}).encode())
        urlopen.return_value.__enter__.return_value = response

        with self.assertRaises(ai_service.ChatError) as error:
            ai_service._ensure_ollama_model(ai_service._config())

        self.assertEqual(error.exception.status, 503)
        self.assertIn('qwen2.5:3b', error.exception.message)

    @patch('django_server.ai_service.urlopen')
    def test_invalid_ollama_model_response_is_reported(self, urlopen):
        response = BytesIO(json.dumps({'unexpected': []}).encode())
        urlopen.return_value.__enter__.return_value = response

        with self.assertRaises(ai_service.ChatError) as error:
            ai_service._ensure_ollama_model(ai_service._config())

        self.assertEqual(error.exception.status, 502)
        self.assertIn('danh sách mô hình', error.exception.message)

    @patch('django_server.ai_service.urlopen', side_effect=URLError('offline'))
    def test_stopped_ollama_returns_setup_guidance(self, _urlopen):
        with self.assertRaises(ai_service.ChatError) as error:
            ai_service._ensure_ollama_model(ai_service._config())

        self.assertEqual(error.exception.status, 503)
        self.assertIn('cài Ollama', error.exception.message)

    def test_ollama_endpoint_must_be_local(self):
        with self.assertRaises(ai_service.ChatError) as error:
            ai_service._validate_base_url('https://remote.example/v1', 'ollama')

        self.assertEqual(error.exception.status, 503)

    @patch('django_server.ai_service._ensure_ollama_model')
    @patch('django_server.ai_service.OpenAI')
    def test_ollama_chat_uses_sdk_model_and_conversation_history(
        self,
        openai_client,
        ensure_model,
    ):
        openai_client.return_value.chat.completions.create.return_value = provider_completion(
            'Xin chào!'
        )
        response = self.client.post(
            '/api/chat/',
            data=json.dumps({'messages': [
                {'role': 'user', 'content': 'Xin chào'},
                {'role': 'assistant', 'content': 'Chào bạn!'},
                {'role': 'user', 'content': 'Bạn vừa nói gì?'},
            ]}),
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'reply': 'Xin chào!'})
        ensure_model.assert_called_once()
        openai_client.assert_called_once_with(
            api_key='ollama',
            base_url='http://127.0.0.1:11434/v1',
            timeout=ai_service.PROVIDER_TIMEOUT_SECONDS,
            max_retries=0,
        )
        call = openai_client.return_value.chat.completions.create.call_args.kwargs
        self.assertEqual(call['model'], 'qwen2.5:3b')
        self.assertEqual(call['extra_body'], {'options': {'num_ctx': 4096}})
        self.assertEqual(call['messages'][-3:], [
            {'role': 'user', 'content': 'Xin chào'},
            {'role': 'assistant', 'content': 'Chào bạn!'},
            {'role': 'user', 'content': 'Bạn vừa nói gì?'},
        ])

    @patch.dict(os.environ, {
        'AI_PROVIDER': 'openai',
        'OPENAI_API_KEY': 'test-key',
        'OPENAI_MODEL': 'test-model',
        'OPENAI_BASE_URL': 'https://example.test/v1/',
    })
    @patch('django_server.ai_service.OpenAI')
    def test_optional_openai_provider_keeps_configured_settings(self, openai_client):
        openai_client.return_value.chat.completions.create.return_value = provider_completion(
            'Hello!'
        )
        reply = ai_service.get_chat_reply([{'role': 'user', 'content': 'Hello'}])

        self.assertEqual(reply, 'Hello!')
        openai_client.assert_called_once_with(
            api_key='test-key',
            base_url='https://example.test/v1',
            timeout=ai_service.PROVIDER_TIMEOUT_SECONDS,
            max_retries=0,
        )
        self.assertNotIn(
            'extra_body',
            openai_client.return_value.chat.completions.create.call_args.kwargs,
        )

    @patch.dict(os.environ, {'AI_PROVIDER': 'openai', 'OPENAI_API_KEY': ''})
    def test_openai_mode_requires_key_but_default_ollama_does_not(self):
        with self.assertRaises(ai_service.ChatError) as error:
            ai_service._client_credentials(ai_service._config())

        self.assertIn('AI_PROVIDER=ollama', error.exception.message)

    def test_chat_redacts_private_details_before_provider_call(self):
        messages = ai_service._parse_messages([{
            'role': 'user',
            'content': (
                'Liên hệ minh@example.com, số 0912345678; mật khẩu: Demo123; '
                'thẻ 4111 1111 1111 1111'
            ),
        }])

        self.assertNotIn('minh@example.com', messages[0]['content'])
        self.assertNotIn('0912345678', messages[0]['content'])
        self.assertNotIn('Demo123', messages[0]['content'])
        self.assertNotIn('4111 1111 1111 1111', messages[0]['content'])

    def test_chat_rejects_oversized_messages(self):
        with self.assertRaises(ai_service.ChatError) as error:
            ai_service._parse_messages([{'role': 'user', 'content': 'a' * 2001}])

        self.assertEqual(error.exception.status, 400)

    @patch('django_server.ai_service.OpenAI')
    def test_local_provider_connection_error_is_reported(self, openai_client):
        openai_client.return_value.chat.completions.create.side_effect = (
            ai_service.APIConnectionError(request=object())
        )
        with patch('django_server.ai_service._ensure_ollama_model'):
            with self.assertRaises(ai_service.ChatError) as error:
                ai_service._request_completion([{'role': 'user', 'content': 'Chào'}])

        self.assertEqual(error.exception.status, 502)
        self.assertIn('Ollama', error.exception.message)

    @patch('django_server.ai_service.OpenAI')
    def test_model_not_found_is_reported_without_fake_success(self, openai_client):
        class ModelNotFoundError(Exception):
            status_code = 404

        with patch('django_server.ai_service.APIStatusError', ModelNotFoundError):
            openai_client.return_value.chat.completions.create.side_effect = ModelNotFoundError(
                'model unavailable'
            )
            with patch('django_server.ai_service._ensure_ollama_model'):
                with self.assertRaises(ai_service.ChatError) as error:
                    ai_service._request_completion([{'role': 'user', 'content': 'Chào'}])

        self.assertEqual(error.exception.status, 503)
        self.assertIn('qwen2.5:3b', error.exception.message)

    @patch('django_server.ai_service.OpenAI')
    def test_empty_provider_reply_is_not_returned_as_success(self, openai_client):
        openai_client.return_value.chat.completions.create.return_value = provider_completion(
            '  '
        )
        with patch('django_server.ai_service._ensure_ollama_model'):
            with self.assertRaises(ai_service.ChatError) as error:
                ai_service._request_completion([{'role': 'user', 'content': 'Chào'}])

        self.assertEqual(error.exception.status, 502)
        self.assertIn('trống', error.exception.message)

    @patch('django_server.urls.is_rate_limited', return_value=True)
    def test_chat_endpoint_applies_rate_limit(self, _rate_limit):
        response = self.client.post(
            '/api/chat/',
            data=json.dumps({'messages': [{'role': 'user', 'content': 'Chào'}]}),
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 429)

    @patch('django_server.urls.is_rate_limited', return_value=False)
    def test_chat_endpoint_rejects_large_body(self, _rate_limit):
        response = self.client.post(
            '/api/chat/',
            data=json.dumps({'messages': [{'role': 'user', 'content': 'a' * 70000}]}),
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 413)

    def test_rate_limit_blocks_eleventh_request_and_expires(self):
        for _ in range(ai_service.RATE_LIMIT_REQUESTS):
            self.assertFalse(ai_service.is_rate_limited('127.0.0.1', now=100))
        self.assertTrue(ai_service.is_rate_limited('127.0.0.1', now=101))
        self.assertFalse(ai_service.is_rate_limited('127.0.0.1', now=161))
