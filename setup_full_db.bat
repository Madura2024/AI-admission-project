@echo off
echo ===================================================
echo     AI ADMISSION SYSTEM - FULL DATABASE SETUP
echo ===================================================
echo.
echo 1. Checking and Applying Database Schema...
cd backend
node setup_schema.js
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Could not connect to the database!
    echo.
    echo Please make sure PostgreSQL is installed and RUNNING.
    echo If you just installed it, search for 'pgAdmin' or 'Services'
    echo and ensure the 'postgresql' service is started.
    echo.
    pause
    exit /b
)

echo.
echo 2. Seeding Initial Data (Courses)...
node seed_courses.js
if %errorlevel% neq 0 (
    echo [ERROR] Seeding failed.
    pause
    exit /b
)

echo.
echo ===================================================
echo   SUCCESS! Database is fully set up.
echo   - Tables created (enquiries, applications, etc.)
echo   - Courses seeded
echo ===================================================
echo.
echo You can now use the application. Refresh your browser.
pause
