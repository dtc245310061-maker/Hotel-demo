import json
import os
import re
import time
import threading
from collections import defaultdict, deque
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import urlopen

from openai import (
    APIConnectionError,
    APIStatusError,
    APITimeoutError,
    AuthenticationError,
    OpenAI,
    PermissionDeniedError,
    RateLimitError,
)

BASE_DIR = Path(__file__).resolve().parent.parent
MAX_MESSAGE_LENGTH = 2000
MAX_HISTORY_MESSAGES = 24
MAX_HISTORY_CHARACTERS = 12000
MAX_COMPLETION_TOKENS = 600
PROVIDER_TIMEOUT_SECONDS = 120
OLLAMA_TIMEOUT_SECONDS = 3
DEFAULT_OLLAMA_MODEL = 'qwen2.5:3b'
RATE_LIMIT_REQUESTS = 10
RATE_LIMIT_WINDOW_SECONDS = 60

_RATE_LIMIT_LOCK = threading.Lock()
_REQUEST_TIMES = defaultdict(deque)


class ChatError(Exception):
    def __init__(self, message, status):
        self.message = message
        self.status = status
        super().__init__(message)


def _config():
    provider = os.environ.get('AI_PROVIDER', 'ollama').strip().lower()
    if provider == 'ollama':
        base_url = os.environ.get('OLLAMA_BASE_URL', '').strip()
        return {
            'provider': provider,
            'api_key': '',
            'model': os.environ.get('OLLAMA_MODEL', '').strip() or DEFAULT_OLLAMA_MODEL,
            'base_url': (base_url or 'http://127.0.0.1:11434').rstrip('/'),
        }
    if provider == 'openai':
        base_url = os.environ.get('OPENAI_BASE_URL', '').strip()
        return {
            'provider': provider,
            'api_key': os.environ.get('OPENAI_API_KEY', '').strip(),
            'model': os.environ.get('OPENAI_MODEL', '').strip() or 'gpt-4o-mini',
            'base_url': (base_url or 'https://api.openai.com/v1').rstrip('/'),
        }
    raise ChatError('AI_PROVIDER chỉ nhận ollama hoặc openai. Hãy kiểm tra tệp .env.', 503)


def _validate_base_url(base_url, provider):
    parsed_url = urlparse(base_url)
    if provider == 'ollama':
        if parsed_url.scheme != 'http' or parsed_url.hostname not in {
            '127.0.0.1',
            'localhost',
            '::1',
        }:
            raise ChatError(
                'OLLAMA_BASE_URL cần trỏ đến Ollama trên máy này (localhost:11434).',
                503,
            )
    elif parsed_url.scheme != 'https' or not parsed_url.netloc:
        raise ChatError('OPENAI_BASE_URL phải là URL HTTPS hợp lệ.', 503)


def _ensure_ollama_model(config):
    tags_url = f"{config['base_url']}/api/tags"
    try:
        with urlopen(tags_url, timeout=OLLAMA_TIMEOUT_SECONDS) as response:
            payload = json.loads(response.read().decode('utf-8'))
    except (HTTPError, URLError, TimeoutError, OSError):
        raise ChatError(
            'Chưa kết nối được Ollama. Hãy cài Ollama, mở Ollama hoặc chạy start-demo.bat để được hướng dẫn.',
            503,
        ) from None
    except (UnicodeDecodeError, json.JSONDecodeError):
        raise ChatError('Ollama trả về dữ liệu không hợp lệ. Hãy khởi động lại Ollama.', 502) from None

    if not isinstance(payload, dict) or not isinstance(payload.get('models'), list):
        raise ChatError('Ollama trả về danh sách mô hình không hợp lệ. Hãy khởi động lại Ollama.', 502)
    installed_models = {
        model.get('name')
        for model in payload.get('models', [])
        if isinstance(model, dict)
    }
    if config['model'] not in installed_models:
        raise ChatError(
            f"Chưa tải mô hình {config['model']}. Chạy start-demo.bat để tải mô hình tự động.",
            503,
        )


def _client_credentials(config):
    if config['provider'] == 'ollama':
        _ensure_ollama_model(config)
        _validate_base_url(config['base_url'], config['provider'])
        return {
            'api_key': 'ollama',
            'base_url': f"{config['base_url']}/v1",
        }
    if not config['api_key']:
        raise ChatError(
            'Chế độ OpenAI cần API key. Chuyển AI_PROVIDER=ollama để dùng AI cục bộ.',
            503,
        )
    _validate_base_url(config['base_url'], config['provider'])
    return {
        'api_key': config['api_key'],
        'base_url': config['base_url'],
    }


def _sanitize_message(text):
    text = re.sub(r'\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b', '[email đã ẩn]', text, flags=re.I)
    text = re.sub(
        r'(?<!\w)(?:\+?84|0)(?:[\s.-]?\d){8,10}(?!\w)',
        '[số điện thoại đã ẩn]',
        text,
    )
    text = re.sub(
        r'\b(?:mật khẩu|password|mã cvv|cvv|số thẻ|thẻ tín dụng|credit card|số tài khoản|tài khoản ngân hàng|account number)\s*[:=]?\s*\S+',
        '[thông tin nhạy cảm đã ẩn]',
        text,
        flags=re.I,
    )
    text = re.sub(
        r'(?<!\d)(?:\d[ -]?){12,18}\d(?!\d)',
        '[số thẻ đã ẩn]',
        text,
    )
    return text


def _parse_messages(raw_messages):
    if not isinstance(raw_messages, list) or not raw_messages:
        raise ChatError('Vui lòng nhập nội dung cần hỏi.', 400)
    if len(raw_messages) > MAX_HISTORY_MESSAGES:
        raise ChatError('Cuộc trò chuyện đã vượt quá giới hạn ngữ cảnh. Hãy bắt đầu cuộc trò chuyện mới.', 400)

    messages = []
    total_characters = 0
    for message in raw_messages:
        if not isinstance(message, dict) or message.get('role') not in {'user', 'assistant'}:
            raise ChatError('Lịch sử hội thoại không hợp lệ.', 400)
        content = message.get('content')
        if not isinstance(content, str) or not content.strip():
            raise ChatError('Tin nhắn không được để trống.', 400)
        content = content.strip()
        if len(content) > MAX_MESSAGE_LENGTH:
            raise ChatError('Mỗi tin nhắn tối đa 2.000 ký tự.', 400)
        total_characters += len(content)
        if total_characters > MAX_HISTORY_CHARACTERS:
            raise ChatError('Lịch sử hội thoại vượt quá giới hạn cho phép.', 400)
        messages.append({'role': message['role'], 'content': _sanitize_message(content)})

    if messages[-1]['role'] != 'user':
        raise ChatError('Tin nhắn cuối cần là câu hỏi của bạn.', 400)
    return messages


def _system_prompt():
    return (
        'Bạn là trợ lý hội thoại của Lumière Hotel. Trả lời tự nhiên, rõ ràng và ưu tiên ngôn ngữ '
        'người dùng đang sử dụng; có thể trò chuyện, chào hỏi, trả lời kiến thức chung và tư vấn '
        'nhiều chủ đề. Dùng lịch sử hội thoại để hiểu câu hỏi tiếp nối. Không bịa dữ kiện. '
        'Trong ứng dụng demo hiện tại, dữ liệu phòng, giá, đặt phòng và dịch vụ chỉ lưu trong '
        'localStorage của trình duyệt; Django chưa có cơ sở dữ liệu hoặc xác thực server-side, '
        'nên bạn không có quyền truy cập dữ liệu khách sạn trực tiếp và không được khẳng định '
        'giá, tình trạng phòng, đặt phòng, doanh thu hay chính sách là hiện tại/chính xác. Hãy '
        'nói rõ giới hạn này và hướng dẫn người dùng kiểm tra trong ứng dụng khi họ hỏi dữ liệu '
        'cụ thể của khách sạn. Chỉ cung cấp thông tin khách sạn khi có dữ kiện đáng tin cậy trong '
        'hội thoại; nếu thiếu, hãy hỏi lại hoặc nói không biết. Không yêu cầu người dùng gửi mật '
        'khẩu, thông tin thanh toán hoặc dữ liệu cá nhân. Bạn chỉ trả lời, không thực hiện đặt, '
        'hủy, thay đổi dữ liệu hay thao tác quản trị.'
    )


def _request_completion(messages):
    config = _config()
    credentials = _client_credentials(config)

    try:
        client = OpenAI(
            **credentials,
            timeout=PROVIDER_TIMEOUT_SECONDS,
            max_retries=0,
        )
        request_options = {}
        if config['provider'] == 'ollama':
            request_options['extra_body'] = {'options': {'num_ctx': 4096}}
        completion = client.chat.completions.create(
            model=config['model'],
            messages=[
                {'role': 'system', 'content': _system_prompt()},
                *messages,
            ],
            max_tokens=MAX_COMPLETION_TOKENS,
            temperature=0.4,
            **request_options,
        )
    except AuthenticationError:
        raise ChatError('API key không hợp lệ hoặc đã hết hạn. Hãy kiểm tra OPENAI_API_KEY trong tệp .env.', 502) from None
    except PermissionDeniedError:
        raise ChatError('API key không có quyền truy cập mô hình hoặc dịch vụ đã cấu hình.', 502) from None
    except RateLimitError:
        raise ChatError(
            'API đã chạm giới hạn sử dụng hoặc hết hạn mức. Hãy kiểm tra usage và billing của nhà cung cấp.',
            503,
        ) from None
    except APITimeoutError:
        raise ChatError('AI phản hồi quá thời gian chờ. Vui lòng thử lại sau.', 504) from None
    except APIConnectionError:
        if config['provider'] == 'ollama':
            raise ChatError('Mất kết nối với Ollama. Hãy kiểm tra Ollama đang chạy rồi thử lại.', 502) from None
        raise ChatError('Không thể kết nối với dịch vụ AI. Hãy kiểm tra mạng và cấu hình endpoint.', 502) from None
    except APIStatusError as error:
        if config['provider'] == 'ollama' and error.status_code == 404:
            raise ChatError(
                f"Mô hình {config['model']} chưa sẵn sàng. Chạy start-demo.bat để kiểm tra hoặc tải mô hình.",
                503,
            ) from None
        raise ChatError('Dịch vụ AI từ chối yêu cầu. Hãy kiểm tra model và cấu hình endpoint.', 502) from None

    try:
        reply = completion.choices[0].message.content
    except (AttributeError, IndexError, TypeError):
        raise ChatError('AI chưa trả về câu trả lời hợp lệ. Vui lòng thử lại sau.', 502) from None
    if not isinstance(reply, str) or not reply.strip():
        raise ChatError('AI trả về câu trả lời trống. Vui lòng gửi lại câu hỏi.', 502)
    return reply.strip()


def get_chat_reply(raw_messages):
    messages = _parse_messages(raw_messages)
    return _request_completion(messages)


def is_rate_limited(client_ip, now=None):
    now = time.monotonic() if now is None else now
    with _RATE_LIMIT_LOCK:
        for address in list(_REQUEST_TIMES):
            requests = _REQUEST_TIMES[address]
            while requests and now - requests[0] >= RATE_LIMIT_WINDOW_SECONDS:
                requests.popleft()
            if not requests:
                del _REQUEST_TIMES[address]

        if client_ip not in _REQUEST_TIMES and len(_REQUEST_TIMES) >= 4096:
            return True
        requests = _REQUEST_TIMES[client_ip]
        if len(requests) >= RATE_LIMIT_REQUESTS:
            return True
        requests.append(now)
        return False
