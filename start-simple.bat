@echo off
echo ========================================
echo    GlobeTrotter Simple Starter
echo ========================================
echo.

echo Starting Backend Server...
start "Backend" cmd /k "cd backend && npm run dev:simple"

echo Waiting 3 seconds...
timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo    Both servers are starting...
echo ========================================
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo The servers will open in separate windows.
echo Close this window when done.
echo.
pause
