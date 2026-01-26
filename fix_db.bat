@echo off
echo Checkin database status...

REM Try to start common PostgreSQL service names
echo Attempting to start PostgreSQL service...
net start postgresql-x64-16
net start postgresql-x64-15
net start postgresql-x64-14
net start postgresql-x64-13
net start postgresql-x64-12

echo.
echo Attempting to seed database...
cd backend
node seed_courses.js
if %errorlevel% neq 0 (
    echo.
    echo ========================================================
    echo   ERROR: DATABASE IS STILL NOT RUNNING
    echo ========================================================
    echo.
    echo I tried to start it automatically but failed.
    echo YOU must start it manually:
    echo.
    echo 1. Press Windows Key + R
    echo 2. Type 'services.msc' and hit Enter
    echo 3. Find 'PostgreSQL' in the list
    echo 4. Right Click - Start
    echo.
    echo AFTER you start it, run this file again!
    echo.
) else (
    echo.
    echo SUCCESS: Database is connected and seeded!
    echo Your website should work now. Refresh the page.
)
pause
