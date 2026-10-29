from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / '.env', override=False)

SECRET_KEY = 'lumiere-demo-only'
DEBUG = True
ALLOWED_HOSTS = ['127.0.0.1', 'localhost', 'testserver']
ROOT_URLCONF = 'django_server.urls'
MIDDLEWARE = []
INSTALLED_APPS = []
TEMPLATES = []
WSGI_APPLICATION = 'django_server.wsgi.application'
DEFAULT_AUTO_FIELD = 'django.db.models.AutoField'
