@echo off
echo ===================================================
echo   STARTING AI ADMISSION SYSTEM (ALL SERVICES)
echo ===================================================

echo.
echo 1. Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm run dev"

echo 2. Starting Frontend Application...
start "Frontend Application" cmd /k "cd frontend && npm run dev"

echo 3. Starting AI Service...
start "AI Service" cmd /k "cd ai-service && python app.py"

echo.
echo ===================================================
echo   ALL SERVICES STARTED!
echo   Please wait a few seconds for them to load.
echo   Then check the Frontend window.
echo ===================================================
pause
