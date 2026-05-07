@echo off
echo Starting ProcureAI Backend...
start cmd /k "cd backend && venv\Scripts\activate && uvicorn main:app --reload"

echo Starting ProcureAI Frontend...
start cmd /k "cd app && npm run dev"

echo Waiting for services to start...
timeout /t 5

echo Opening Browser...
start http://localhost:5174/

echo ProcureAI is running!
