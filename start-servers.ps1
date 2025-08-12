Write-Host "Starting GlobeTrotter Application..." -ForegroundColor Green
Write-Host ""

Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; npm run dev" -WindowStyle Normal

Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "Both servers are starting in separate windows..." -ForegroundColor Green
Write-Host "Backend will be available at: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
