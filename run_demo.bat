@echo off
echo ========================================================
echo ProcureAI - CRPF Tender Evaluation Hackathon Prototype
echo ========================================================
echo.
echo Installing dependencies (if needed)...
cd app
call npm install
echo.
echo Starting the application...
call npm run dev
pause
