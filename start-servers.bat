@echo off
echo Starting GlobeTrotter Application...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm run dev"

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting in separate windows...
echo Backend will be available at: http://localhost:5000
echo Frontend will be available at: http://localhost:3000
echo.
echo Press any key to close this window...
pause > nul
