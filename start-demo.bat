@echo off
setlocal
cd /d "%~dp0"
if not exist "dist\index.html" (
  echo Khong tim thay dist\index.html.
  pause
  exit /b 1
)
where py >nul 2>nul
if errorlevel 1 (
  echo Khong tim thay Python Launcher. Cai Python 3.10 tro len.
  pause
  exit /b 1
)
py -c "import django, dotenv, openai" >nul 2>nul
if errorlevel 1 (
  echo Dang cai Django theo requirements.txt...
  py -m pip install -r requirements.txt
  if errorlevel 1 (
    echo Cai Django that bai.
    pause
    exit /b 1
  )
)
start "Lumiere Django Demo" cmd /k "py manage.py runserver 127.0.0.1:8000"
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:8000/"
