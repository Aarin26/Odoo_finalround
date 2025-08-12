@echo off
echo ========================================
echo    GlobeTrotter Docker Starter
echo ========================================
echo.

echo Starting GlobeTrotter with Docker...
docker-compose up --build

echo.
echo Application is starting...
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause
