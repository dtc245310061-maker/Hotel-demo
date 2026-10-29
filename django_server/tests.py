import json
import os
from types import SimpleNamespace
from unittest.mock import patch

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
            'OPENAI_API_KEY': 'test-key',
            'OPENAI_MODEL': 'test-model',
            'OPENAI_BASE_URL': 'https://example.test/v1',
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

    @patch('django_server.urls.is_rate_limited', return_value=False)
    @patch.dict(os.environ, {'OPENAI_API_KEY': ''})
    def test_missing_api_key_returns_short_setup_guidance(self, _rate_limit):
        response = self.client.post(
            '/api/chat/',
            data=json.dumps({'messages': [{'role': 'user', 'content': 'Xin chào'}]}),
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 503)
        self.assertIn('OPENAI_API_KEY', response.json()['message'])
        self.assertIn('.env', response.json()['message'])

    @patch('django_server.urls.is_rate_limited', return_value=False)
    @patch.dict(os.environ, {
        'OPENAI_API_KEY': 'test-key',
        'OPENAI_MODEL': 'test-model',
        'OPENAI_BASE_URL': 'https://example.test/v1/',
    })
    @patch('django_server.ai_service.OpenAI')
    def test_chat_uses_sdk_configuration_and_full_history(self, openai_client, _rate_limit):
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
        openai_client.assert_called_once_with(
            api_key='test-key',
            base_url='https://example.test/v1',
            timeout=ai_service.PROVIDER_TIMEOUT_SECONDS,
            max_retries=0,
        )
        call = openai_client.return_value.chat.completions.create.call_args.kwargs
        self.assertEqual(call['model'], 'test-model')
        self.assertEqual(call['messages'][-3:], [
            {'role': 'user', 'content': 'Xin chào'},
            {'role': 'assistant', 'content': 'Chào bạn!'},
            {'role': 'user', 'content': 'Bạn vừa nói gì?'},
        ])

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
    def test_invalid_key_error_is_explained_without_leaking_details(self, openai_client):
        with patch('django_server.ai_service.AuthenticationError', RuntimeError):
            openai_client.return_value.chat.completions.create.side_effect = RuntimeError(
                'provider error containing test-key'
            )
            with self.assertRaises(ai_service.ChatError) as error:
                ai_service._request_completion([{'role': 'user', 'content': 'Chào'}])

        self.assertEqual(error.exception.status, 502)
        self.assertIn('không hợp lệ', error.exception.message)
        self.assertNotIn('test-key', error.exception.message)

    @patch('django_server.ai_service.OpenAI')
    def test_provider_quota_error_is_explained(self, openai_client):
        with patch('django_server.ai_service.RateLimitError', RuntimeError):
            openai_client.return_value.chat.completions.create.side_effect = RuntimeError(
                'quota'
            )
            with self.assertRaises(ai_service.ChatError) as error:
                ai_service._request_completion([{'role': 'user', 'content': 'Chào'}])

        self.assertEqual(error.exception.status, 503)
        self.assertIn('hạn mức', error.exception.message)

    @patch('django_server.ai_service.OpenAI')
    def test_provider_network_error_is_reported(self, openai_client):
        with patch('django_server.ai_service.APIConnectionError', RuntimeError):
            openai_client.return_value.chat.completions.create.side_effect = RuntimeError(
                'offline'
            )
            with self.assertRaises(ai_service.ChatError) as error:
                ai_service._request_completion([{'role': 'user', 'content': 'Chào'}])

        self.assertEqual(error.exception.status, 502)
        self.assertIn('kết nối', error.exception.message)
        self.assertNotIn('offline', error.exception.message)

    @patch('django_server.ai_service.OpenAI')
    def test_provider_timeout_is_reported(self, openai_client):
        with patch('django_server.ai_service.APITimeoutError', RuntimeError):
            openai_client.return_value.chat.completions.create.side_effect = RuntimeError()
            with self.assertRaises(ai_service.ChatError) as error:
                ai_service._request_completion([{'role': 'user', 'content': 'Chào'}])

        self.assertEqual(error.exception.status, 504)
        self.assertIn('thời gian chờ', error.exception.message)

    @patch('django_server.ai_service.OpenAI')
    def test_empty_provider_reply_is_not_returned_as_success(self, openai_client):
        openai_client.return_value.chat.completions.create.return_value = provider_completion(
            '  '
        )

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
