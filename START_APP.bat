@echo off
echo ================================
echo   TaskFlow v2 - Starting
echo ================================

echo Starting FastAPI backend on port 8000...
start cmd /k "cd backend && venv\Scripts\activate && uvicorn main:app --reload --port 8000"

timeout /t 3 /nobreak >nul

echo Starting React frontend on port 5173...
start cmd /k "cd frontend && npm run dev"

timeout /t 4 /nobreak >nul

echo Opening browser...
start http://localhost:5173

echo.
echo TaskFlow is running!
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:8000/docs
