import json
import os
import tempfile
from io import BytesIO
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

import httpx

from django.test import Client, SimpleTestCase

from django_server import ai_service, documents
from django_server.chat_errors import ChatError


def provider_completion(content, finish_reason=None):
    candidates = []
    if finish_reason is not None:
        candidates = [SimpleNamespace(finish_reason=finish_reason)]
    return SimpleNamespace(text=content, candidates=candidates)


class ChatApiTests(SimpleTestCase):
    def setUp(self):
        ai_service._REQUEST_TIMES.clear()
        ai_service._GLOBAL_REQUEST_TIMES.clear()
        self.environment = patch.dict(os.environ, {
            'AI_PROVIDER': 'gemini',
            'GEMINI_API_KEY': 'test-key',
            'GEMINI_MODEL': 'test-model',
        })
        self.environment.start()
        self.addCleanup(self.environment.stop)

    @patch('django_server.urls.is_rate_limited', return_value=False)
    def test_chat_requires_post(self, _rate_limit):
        self.assertEqual(self.client.get('/api/chat/').status_code, 405)

    @patch('django_server.urls.is_rate_limited', return_value=False)
    def test_chat_requires_csrf_token_from_site(self, _rate_limit):
        client = Client(enforce_csrf_checks=True)
        response = client.post(
            '/api/chat/',
            data=json.dumps({'messages': [{'role': 'user', 'content': 'Hi'}]}),
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 403)

    @patch('django_server.urls.is_rate_limited', return_value=False)
    @patch('django_server.ai_service.genai.Client')
    def test_chat_accepts_csrf_token_set_by_homepage(self, gemini_client, _rate_limit):
        gemini_client.return_value.models.generate_content.return_value = provider_completion(
            'Xin chào!'
        )
        client = Client(enforce_csrf_checks=True)
        client.get('/')
        token = client.cookies['csrftoken'].value
        response = client.post(
            '/api/chat/',
            data=json.dumps({'messages': [{'role': 'user', 'content': 'Xin chào'}]}),
            content_type='application/json',
            HTTP_X_CSRFTOKEN=token,
        )
        self.assertEqual(response.status_code, 200)

    @patch('django_server.urls.is_rate_limited', return_value=False)
    def test_chat_rejects_invalid_json(self, _rate_limit):
        response = self.client.post('/api/chat/', data='{', content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('JSON', response.json()['message'])

    @patch.dict(os.environ, {'AI_PROVIDER': 'gemini', 'GEMINI_API_KEY': ''})
    def test_missing_api_key_returns_clear_setup_error(self):
        with self.assertRaises(ChatError) as error:
            ai_service._request_completion([{'role': 'user', 'content': 'Xin chào'}])
        self.assertEqual(error.exception.status, 503)
        self.assertIn('quản trị viên', error.exception.message)
        self.assertIn('GEMINI_API_KEY', error.exception.message)

    @patch('django_server.ai_service.genai.Client')
    def test_chat_calls_gemini_with_config_and_full_conversation(self, gemini_client):
        gemini_client.return_value.models.generate_content.return_value = provider_completion(
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
        gemini_client.assert_called_once_with(
            api_key='test-key',
            http_options=ai_service.types.HttpOptions(
                timeout=ai_service.PROVIDER_TIMEOUT_SECONDS * 1000,
                retry_options=ai_service.types.HttpRetryOptions(attempts=1),
            ),
        )
        request = gemini_client.return_value.models.generate_content.call_args.kwargs
        self.assertEqual(request['model'], 'test-model')
        self.assertEqual(request['config'].max_output_tokens, ai_service.MAX_COMPLETION_TOKENS)
        self.assertEqual(
            request['config'].system_instruction,
            ai_service._system_prompt(),
        )
        self.assertEqual(
            [(message.role, message.parts[0].text) for message in request['contents']],
            [
                ('user', 'Xin chào'),
                ('model', 'Chào bạn!'),
                ('user', 'Bạn vừa nói gì?'),
            ],
        )

    @patch.dict(os.environ, {'AI_PROVIDER': 'ollama'})
    def test_ollama_provider_is_not_used(self):
        with self.assertRaises(ChatError) as error:
            ai_service._config()
        self.assertEqual(error.exception.status, 503)
        self.assertIn('gemini', error.exception.message)

    def test_gemini_is_the_default_provider_and_model(self):
        with patch.dict(os.environ, {}, clear=True):
            config = ai_service._config()
        self.assertEqual(config['provider'], 'gemini')
        self.assertEqual(config['model'], 'gemini-2.5-flash')

    def test_system_prompt_supports_math_programming_and_open_questions(self):
        prompt = ai_service._system_prompt()
        self.assertIn('giải toán', prompt)
        self.assertIn('mã lập trình', prompt)
        self.assertIn('công thức', prompt)
        self.assertIn('Không giới hạn trợ giúp vào chủ đề khách sạn', prompt)

    @patch('django_server.ai_service.genai.Client')
    def test_rejects_truncated_completion_and_logs_no_api_key(self, gemini_client):
        gemini_client.return_value.models.generate_content.return_value = provider_completion(
            'def total(n):',
            finish_reason=ai_service.types.FinishReason.MAX_TOKENS,
        )
        with self.assertLogs('django_server.ai_service', level='WARNING') as logs:
            with self.assertRaises(ChatError) as error:
                ai_service._request_completion([{'role': 'user', 'content': 'Viết code'}])

        self.assertEqual(error.exception.status, 502)
        self.assertIn('vượt quá giới hạn', error.exception.message)
        self.assertTrue(any('output token limit' in entry for entry in logs.output))
        self.assertNotIn('test-key', '\n'.join(logs.output))

    @patch('django_server.ai_service.genai.Client')
    def test_document_context_is_passed_as_system_instruction(self, gemini_client):
        gemini_client.return_value.models.generate_content.return_value = provider_completion(
            'Đã tra cứu tài liệu.'
        )
        ai_service._request_completion([
            {'role': 'system', 'content': 'Trích từ policy.pdf: nhận phòng lúc 14 giờ.'},
            {'role': 'user', 'content': 'Giờ nhận phòng là mấy giờ?'},
        ])
        request = gemini_client.return_value.models.generate_content.call_args.kwargs
        self.assertIn('Trích từ policy.pdf', request['config'].system_instruction)
        self.assertEqual(
            request['contents'][0].parts[0].text,
            'Giờ nhận phòng là mấy giờ?',
        )

    def test_chat_redacts_private_details_before_provider_call(self):
        message = ai_service._parse_messages([{
            'role': 'user',
            'content': (
                'Liên hệ minh@example.com, số 0912345678; mật khẩu: Demo123; '
                'mật khẩu của tôi là MySecret123; thẻ 4111 1111 1111 1111'
            ),
        }])[0]['content']
        self.assertNotIn('minh@example.com', message)
        self.assertNotIn('0912345678', message)
        self.assertNotIn('Demo123', message)
        self.assertNotIn('MySecret123', message)
        self.assertNotIn('4111 1111 1111 1111', message)

    def test_chat_rejects_oversized_messages(self):
        with self.assertRaises(ChatError) as error:
            ai_service._parse_messages([{'role': 'user', 'content': 'a' * 2001}])
        self.assertEqual(error.exception.status, 400)

    @patch('django_server.ai_service.genai.Client')
    def test_invalid_key_error_does_not_expose_provider_details(self, gemini_client):
        gemini_client.return_value.models.generate_content.side_effect = (
            ai_service.genai_errors.APIError(
                403,
                {'error': {
                    'message': 'API key not valid: test-key',
                    'status': 'PERMISSION_DENIED',
                }},
            )
        )
        with self.assertLogs('django_server.ai_service', level='WARNING') as logs:
            with self.assertRaises(ChatError) as error:
                ai_service._request_completion([{'role': 'user', 'content': 'Hi'}])
        self.assertEqual(error.exception.status, 502)
        self.assertIn('không hợp lệ', error.exception.message)
        self.assertNotIn('test-key', error.exception.message)
        self.assertNotIn('test-key', '\n'.join(logs.output))

    @patch('django_server.ai_service.genai.Client')
    def test_quota_error_is_reported(self, gemini_client):
        gemini_client.return_value.models.generate_content.side_effect = (
            ai_service.genai_errors.APIError(
                429,
                {'error': {'message': 'Quota exceeded', 'status': 'RESOURCE_EXHAUSTED'}},
            )
        )
        with self.assertRaises(ChatError) as error:
            ai_service._request_completion([{'role': 'user', 'content': 'Hi'}])
        self.assertEqual(error.exception.status, 503)
        self.assertIn('hết hạn mức', error.exception.message)

    @patch('django_server.ai_service.genai.Client')
    def test_connection_error_is_reported(self, gemini_client):
        gemini_client.return_value.models.generate_content.side_effect = httpx.ConnectError(
            'offline',
            request=httpx.Request('GET', 'https://generativelanguage.googleapis.com'),
        )
        with self.assertRaises(ChatError) as error:
            ai_service._request_completion([{'role': 'user', 'content': 'Hi'}])
        self.assertEqual(error.exception.status, 502)
        self.assertIn('Internet', error.exception.message)
        self.assertNotIn('offline', error.exception.message)

    @patch('django_server.ai_service.genai.Client')
    def test_timeout_error_is_reported(self, gemini_client):
        gemini_client.return_value.models.generate_content.side_effect = httpx.ReadTimeout(
            'timeout',
            request=httpx.Request('POST', 'https://generativelanguage.googleapis.com'),
        )
        with self.assertRaises(ChatError) as error:
            ai_service._request_completion([{'role': 'user', 'content': 'Hi'}])
        self.assertEqual(error.exception.status, 504)
        self.assertIn('thời gian chờ', error.exception.message)

    @patch('django_server.ai_service.genai.Client')
    def test_empty_provider_reply_is_not_returned_as_success(self, gemini_client):
        gemini_client.return_value.models.generate_content.return_value = provider_completion(' ')
        with self.assertRaises(ChatError) as error:
            ai_service._request_completion([{'role': 'user', 'content': 'Hi'}])
        self.assertEqual(error.exception.status, 502)
        self.assertIn('trống', error.exception.message)

    @patch('django_server.urls.is_rate_limited', return_value=True)
    def test_chat_endpoint_applies_rate_limit(self, _rate_limit):
        response = self.client.post(
            '/api/chat/',
            data=json.dumps({'messages': [{'role': 'user', 'content': 'Hi'}]}),
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

    def test_global_daily_limit_blocks_requests_from_all_clients(self):
        with patch.object(ai_service, 'DAILY_REQUEST_LIMIT', 2):
            self.assertFalse(ai_service.is_rate_limited('client-one', now=100))
            self.assertFalse(ai_service.is_rate_limited('client-two', now=101))
            self.assertTrue(ai_service.is_rate_limited('client-three', now=102))
            self.assertFalse(
                ai_service.is_rate_limited(
                    'client-three',
                    now=100 + ai_service.DAILY_REQUEST_WINDOW_SECONDS,
                )
            )


class KnowledgeDocumentTests(SimpleTestCase):
    def setUp(self):
        documents._INDEX_SIGNATURE = None
        documents._INDEX_CHUNKS = []
        self.temp_dir = tempfile.TemporaryDirectory()
        self.directory_patch = patch.object(
            documents,
            'KNOWLEDGE_DIR',
            Path(self.temp_dir.name),
        )
        self.directory_patch.start()
        self.addCleanup(self.directory_patch.stop)
        self.addCleanup(self.temp_dir.cleanup)
        self.addCleanup(self._reset_index)

    @staticmethod
    def _reset_index():
        documents._INDEX_SIGNATURE = None
        documents._INDEX_CHUNKS = []

    def test_txt_and_markdown_documents_are_searchable(self):
        Path(self.temp_dir.name, 'policy.md').write_text(
            'Chính sách nhận phòng bắt đầu lúc 14 giờ. Khách cần xuất trình giấy tờ.',
            encoding='utf-8',
        )
        passages = documents.find_relevant_passages('chính sách nhận phòng lúc mấy giờ')
        self.assertTrue(passages)
        self.assertEqual(passages[0]['source'], 'policy.md')
        self.assertIn('14 giờ', passages[0]['text'])

    def test_docx_text_is_extracted(self):
        from docx import Document

        buffer = BytesIO()
        document = Document()
        document.add_paragraph('Quy định hành lý: mỗi khách được mang hai túi.')
        document.save(buffer)
        path = Path(self.temp_dir.name, 'guide.docx')
        path.write_bytes(buffer.getvalue())

        self.assertIn('hai túi', documents._read_document(path))

    @patch('django_server.documents.PdfReader')
    def test_pdf_pages_are_extracted_with_page_reference(self, pdf_reader):
        pdf_reader.return_value.is_encrypted = False
        pdf_reader.return_value.pages = [
            SimpleNamespace(extract_text=lambda: 'Quy định hủy phòng trong vòng một ngày.'),
        ]
        path = Path(self.temp_dir.name, 'policy.pdf')
        path.write_bytes(b'%PDF-test')

        extracted = documents._read_document(path)
        self.assertIn('[Trang 1]', extracted)
        self.assertIn('hủy phòng', extracted)

    def test_documents_are_split_into_overlapping_chunks(self):
        chunks = documents._split_chunks('quy định ' * 300, 'rules.txt')
        self.assertGreater(len(chunks), 1)
        self.assertTrue(all(chunk['source'] == 'rules.txt' for chunk in chunks))

    def test_documents_are_not_searched_when_the_query_is_unrelated(self):
        Path(self.temp_dir.name, 'policy.txt').write_text(
            'Quy định bữa sáng được phục vụ từ bảy giờ.',
            encoding='utf-8',
        )
        self.assertEqual(
            documents.find_relevant_passages('quantum chromodynamics'),
            [],
        )

    def test_oversized_documents_are_rejected(self):
        path = Path(self.temp_dir.name, 'large.txt')
        path.write_text('x' * (documents.MAX_DOCUMENT_BYTES + 1), encoding='utf-8')
        with self.assertRaises(ChatError) as error:
            documents.find_relevant_passages('anything')
        self.assertEqual(error.exception.status, 413)

    @patch('django_server.ai_service._request_completion')
    @patch('django_server.ai_service.find_relevant_passages', return_value=[{
        'source': 'policy.pdf',
        'text': '[Trang 2] Khách cần đặt trước.',
    }])
    def test_relevant_document_passages_are_added_as_grounded_context(
        self,
        _find_passages,
        request_completion,
    ):
        request_completion.return_value = 'Theo policy.pdf, khách cần đặt trước.'
        reply = ai_service.get_chat_reply([
            {'role': 'user', 'content': 'Nội dung chính sách là gì?'},
            {'role': 'assistant', 'content': 'Đang xem.'},
            {'role': 'user', 'content': 'Còn đặt trước thì sao?'},
        ])

        self.assertEqual(reply, 'Theo policy.pdf, khách cần đặt trước.')
        sent = request_completion.call_args.args[0]
        self.assertEqual(sent[0]['role'], 'system')
        self.assertIn('policy.pdf', sent[0]['content'])
        self.assertIn('đặt trước', sent[0]['content'])


class BasicEndpointTests(SimpleTestCase):
    def test_health_endpoint_returns_ok(self):
        response = self.client.get('/api/health/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'ok')

    def test_index_returns_the_demo_page(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        body = b''.join(response.streaming_content)
        self.assertIn(b'Lumi', body)
        self.assertIn('csrftoken', response.cookies)
        self.assertEqual(response['X-Frame-Options'], 'DENY')
