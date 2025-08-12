@echo off
echo Starting GlobeTrotter Application...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd /d %~dp0backend && npm run dev:working"

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Both servers are starting in separate windows.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to close this window...
pause > nul
