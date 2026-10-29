@echo off
setlocal
cd /d "%~dp0"

if not exist "dist\index.html" (
  echo Khong tim thay giao dien dist\index.html. Hay chay BAT tu thu muc du an.
  goto :fail
)

where py >nul 2>nul
if errorlevel 1 (
  echo Khong tim thay Python Launcher. Cai Python 3.10 tro len va chon Python Launcher.
  goto :fail
)
py -c "import sys; sys.exit(0 if sys.version_info >= (3,10) else 1)" >nul 2>nul
if errorlevel 1 (
  echo Du an can Python 3.10 tro len. Hay cai ban moi hon va chay lai.
  goto :fail
)

if not exist ".env" (
  if exist ".env.example" (
    copy /y ".env.example" ".env" >nul
    echo Da tao .env voi cau hinh OpenAI mau.
  ) else (
    echo Khong tim thay .env.example. Hay cap nhat lai ma nguon.
    goto :fail
  )
)

py -c "import django, dotenv, openai, docx, pypdf" >nul 2>nul
if errorlevel 1 (
  echo Dang cai cac thu vien cua du an...
  py -m pip install -r requirements.txt
  if errorlevel 1 (
    echo Khong cai duoc thu vien. Kiem tra ket noi Internet va Python pip.
    goto :fail
  )
)

py manage.py check
if errorlevel 1 (
  echo Django chua san sang. Kiem tra loi ben tren.
  goto :fail
)

py -c "from dotenv import load_dotenv; from pathlib import Path; load_dotenv(Path('.env'), override=False); from django_server.ai_service import _config; c=_config(); print('Nha cung cap:', c['provider']); print('Mo hinh:', c['model']); print('API key da duoc cau hinh:', bool(c['api_key']))" > "%TEMP%\lumiere-ai-config.txt" 2>&1
if errorlevel 1 (
  type "%TEMP%\lumiere-ai-config.txt"
  del "%TEMP%\lumiere-ai-config.txt" >nul 2>nul
  echo Khong doc duoc cau hinh AI. Kiem tra AI_PROVIDER va cac dong trong .env.
  goto :fail
)
type "%TEMP%\lumiere-ai-config.txt"
set "NEED_API_KEY=0"
findstr /c:"API key da duoc cau hinh: False" "%TEMP%\lumiere-ai-config.txt" >nul
if not errorlevel 1 set "NEED_API_KEY=1"
del "%TEMP%\lumiere-ai-config.txt" >nul 2>nul
if "%NEED_API_KEY%"=="1" (
  echo.
  echo Chua co OPENAI_API_KEY. BAT se mo .env de ban tu nhap key mot lan.
  echo Khong gui API key cho chatbot hoac commit file .env.
  start /wait "" notepad "%~dp0.env"
  py -c "from dotenv import load_dotenv; from pathlib import Path; import os,sys; load_dotenv(Path('.env'), override=False); sys.exit(0 if os.getenv('OPENAI_API_KEY','').strip() else 1)" >nul 2>nul
  if errorlevel 1 (
    echo Chua co API key. Website van se chay, nhung Chat AI se bao chua duoc cau hinh.
  ) else (
    echo Da tim thay cau hinh API key. Gia tri key khong duoc hien thi.
  )
)

powershell -NoProfile -Command "if (Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction SilentlyContinue) { exit 0 } else { exit 1 }" >nul 2>nul
if not errorlevel 1 (
  powershell -NoProfile -Command "try { Invoke-RestMethod -Uri 'http://127.0.0.1:8000/api/health/' -TimeoutSec 3 | Out-Null; exit 0 } catch { exit 1 }" >nul 2>nul
  if errorlevel 1 (
    echo Cong 8000 dang duoc ung dung khac su dung. Hay dong ung dung do hoac doi cong.
    goto :fail
  )
  echo Website Django dang chay tai cong 8000.
  goto :open_website
)

start "Lumiere Django Demo" cmd /k "py manage.py runserver 127.0.0.1:8000"
set "DJANGO_READY="
for /l %%I in (1,1,30) do (
  powershell -NoProfile -Command "try { Invoke-RestMethod -Uri 'http://127.0.0.1:8000/api/health/' -TimeoutSec 2 | Out-Null; exit 0 } catch { exit 1 }" >nul 2>nul
  if not errorlevel 1 set "DJANGO_READY=1"
  if defined DJANGO_READY goto :open_website
  timeout /t 1 /nobreak >nul
)
echo Django khong phan hoi tai cong 8000. Kiem tra cua so server va xem cong co bi ung dung khac su dung khong.
goto :fail

:open_website
start "" "http://127.0.0.1:8000/"
exit /b 0

:fail
echo.
pause
exit /b 1
