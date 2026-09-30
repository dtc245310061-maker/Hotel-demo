from pathlib import Path

from django.http import FileResponse, JsonResponse
from django.urls import path

BASE_DIR = Path(__file__).resolve().parent.parent
INDEX_FILE = BASE_DIR / 'dist' / 'index.html'


def index(request):
    return FileResponse(INDEX_FILE.open('rb'), content_type='text/html; charset=utf-8')


def health(request):
    return JsonResponse({'status': 'ok', 'service': 'Lumiere Hotel AI demo'})


urlpatterns = [
    path('', index),
    path('api/health/', health),
]
