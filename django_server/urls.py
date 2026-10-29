import json
from pathlib import Path

from django.http import FileResponse, JsonResponse
from django.urls import path
from django.views.decorators.http import require_POST

from django_server.ai_service import ChatError, get_chat_reply, is_rate_limited

BASE_DIR = Path(__file__).resolve().parent.parent
INDEX_FILE = BASE_DIR / 'dist' / 'index.html'
MAX_REQUEST_BYTES = 64_000


def index(request):
    return FileResponse(INDEX_FILE.open('rb'), content_type='text/html; charset=utf-8')


def health(request):
    return JsonResponse({'status': 'ok', 'service': 'Lumiere Hotel AI demo'})


@require_POST
def chat(request):
    try:
        content_length = int(request.META.get('CONTENT_LENGTH') or 0)
    except ValueError:
        return JsonResponse({'message': 'Kích thước yêu cầu không hợp lệ.'}, status=400)
    if content_length > MAX_REQUEST_BYTES:
        return JsonResponse({'message': 'Yêu cầu quá lớn. Hãy rút ngắn lịch sử hội thoại.'}, status=413)
    body = request.body
    if len(body) > MAX_REQUEST_BYTES:
        return JsonResponse({'message': 'Yêu cầu quá lớn. Hãy rút ngắn lịch sử hội thoại.'}, status=413)
    if is_rate_limited(request.META.get('REMOTE_ADDR', '')):
        return JsonResponse(
            {'message': 'Bạn gửi câu hỏi quá nhanh. Vui lòng chờ một phút rồi thử lại.'},
            status=429,
        )
    try:
        payload = json.loads(body)
        reply = get_chat_reply(payload.get('messages') if isinstance(payload, dict) else None)
    except (UnicodeDecodeError, ValueError):
        return JsonResponse({'message': 'Nội dung yêu cầu không phải JSON hợp lệ.'}, status=400)
    except ChatError as error:
        return JsonResponse({'message': error.message}, status=error.status)
    return JsonResponse({'reply': reply})


urlpatterns = [
    path('', index),
    path('api/health/', health),
    path('api/chat/', chat),
]
