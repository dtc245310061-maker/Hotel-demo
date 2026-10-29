@echo off
setlocal
cd /d "%~dp0"
set "OLLAMA_MODEL=qwen2.5:3b"
set "AI_PROVIDER=ollama"
if not exist "dist\index.html" (
  echo Khong tim thay giao dien dist\index.html trong thu muc du an.
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
    echo Da tao .env voi cau hinh Ollama mac dinh.
  ) else (
    echo Khong tim thay .env.example. Hay cap nhat lai ma nguon.
    goto :fail
  )
)
for /f "tokens=1,* delims==" %%A in ('findstr /b /i "OLLAMA_MODEL=" ".env" 2^>nul') do set "OLLAMA_MODEL=%%B"
if not defined OLLAMA_MODEL set "OLLAMA_MODEL=qwen2.5:3b"
for /f "tokens=1,* delims==" %%A in ('findstr /b /i "AI_PROVIDER=" ".env" 2^>nul') do set "AI_PROVIDER=%%B"

py -c "import django, dotenv, openai" >nul 2>nul
if errorlevel 1 (
  echo Dang cai cac thu vien cua du an...
  py -m pip install -r requirements.txt
  if errorlevel 1 (
    echo Khong cai duoc thu vien. Kiem tra ket noi Internet va Python pip.
    goto :fail
  )
)

if /i "%AI_PROVIDER%"=="openai" goto :start_django
if /i not "%AI_PROVIDER%"=="ollama" (
  echo AI_PROVIDER trong .env phai la ollama hoac openai.
  goto :fail
)

set "OLLAMA_EXE="
for /f "delims=" %%I in ('where ollama 2^>nul') do if not defined OLLAMA_EXE set "OLLAMA_EXE=%%I"
if not defined OLLAMA_EXE if exist "%LOCALAPPDATA%\Programs\Ollama\ollama.exe" set "OLLAMA_EXE=%LOCALAPPDATA%\Programs\Ollama\ollama.exe"
if not defined OLLAMA_EXE (
  echo Chua cai Ollama. Tai va cai dat mien phi tu https://ollama.com/download/windows
  echo Sau khi cai xong, chay lai start-demo.bat.
  goto :fail
)

powershell -NoProfile -Command "try { Invoke-RestMethod -Uri 'http://127.0.0.1:11434/api/tags' -TimeoutSec 2 | Out-Null; exit 0 } catch { exit 1 }" >nul 2>nul
if errorlevel 1 (
  echo Dang khoi dong Ollama...
  start "Ollama Local AI" /min "%OLLAMA_EXE%" serve
  set "OLLAMA_READY="
  for /l %%I in (1,1,30) do (
    powershell -NoProfile -Command "try { Invoke-RestMethod -Uri 'http://127.0.0.1:11434/api/tags' -TimeoutSec 2 | Out-Null; exit 0 } catch { exit 1 }" >nul 2>nul
    if not errorlevel 1 set "OLLAMA_READY=1"
    if defined OLLAMA_READY goto :ollama_started
    timeout /t 1 /nobreak >nul
  )
  echo Ollama chua khoi dong duoc. Hay mo ung dung Ollama tu Start Menu roi chay lai.
  goto :fail
)
:ollama_started

"%OLLAMA_EXE%" list | findstr /b /c:"%OLLAMA_MODEL%" >nul 2>nul
if errorlevel 1 (
  echo Mo hinh %OLLAMA_MODEL% chua co. Dang tai ve; lan dau co the mat vai phut...
  "%OLLAMA_EXE%" pull "%OLLAMA_MODEL%"
  if errorlevel 1 (
    echo Tai mo hinh that bai. Kiem tra ket noi Internet va dung luong dia.
    goto :fail
  )
)

:start_django
py manage.py check
if errorlevel 1 (
  echo Ung dung chua san sang. Kiem tra loi ben tren.
  goto :fail
)
if /i "%AI_PROVIDER%"=="ollama" echo Ollama va mo hinh %OLLAMA_MODEL% da san sang.
if /i "%AI_PROVIDER%"=="openai" echo Dang chay voi nha cung cap OpenAI da cau hinh.
start "Lumiere Django Demo" cmd /k "py manage.py runserver 127.0.0.1:8000"
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:8000/"
exit /b 0

:fail
echo.
pause
exit /b 1
