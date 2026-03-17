@echo off
echo ================================
echo   TaskFlow v2 - Setup
echo ================================
echo.

echo [1/3] Allowing PowerShell scripts...
powershell -Command "Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force"

echo [2/3] Setting up Python backend...
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
cd ..

echo [3/3] Installing React frontend...
cd frontend
call npm install
cd ..

echo.
echo Setup complete! Run START_APP.bat to launch.
pause
