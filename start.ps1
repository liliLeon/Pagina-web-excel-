# start.ps1 — levanta todo el proyecto con un clic
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Start-Process powershell -ArgumentList '-NoExit', '-Command', "cd '$root\backend'; php artisan serve" -WindowStyle Normal
Start-Sleep -Milliseconds 800

Start-Process powershell -ArgumentList '-NoExit', '-Command', "cd '$root\backend'; php artisan queue:work --sleep=1 --tries=3" -WindowStyle Normal
Start-Sleep -Milliseconds 400

Start-Process powershell -ArgumentList '-NoExit', '-Command', "cd '$root\frontend'; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Facturas Pro  —  TODO CORRIENDO" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Backend  ->  http://localhost:8000" -ForegroundColor Yellow
Write-Host "  Frontend ->  http://localhost:3000" -ForegroundColor Yellow
Write-Host "  Login    ->  admin@facturas.pro / secret123" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
