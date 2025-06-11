# AI Fitness Coach - Development Services Starter
# Bu script mobil uygulama haric tum servisleri baslatir

Write-Host "AI Fitness Coach - Tum Servisleri Baslatiliyor..." -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan

# Root dizine git
Set-Location "c:\dietApp"

# Servisleri baslat
Write-Host "Landing Page baslatiliyor (Port 5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd c:\dietApp; npm run landing:dev" -WindowStyle Minimized

Start-Sleep -Seconds 2

Write-Host "Web Application baslatiliyor (Port 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd c:\dietApp; npm run web-app:dev" -WindowStyle Minimized

Start-Sleep -Seconds 2

Write-Host "API Backend baslatiliyor (Port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd c:\dietApp\apps\api; dotnet run" -WindowStyle Minimized

Start-Sleep -Seconds 2

Write-Host "Notification Service baslatiliyor (Port 5001)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd c:\dietApp\apps\notification-service; dotnet run" -WindowStyle Minimized

Start-Sleep -Seconds 2

Write-Host "Queue Processor baslatiliyor..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd c:\dietApp\apps\queue-processor; dotnet run" -WindowStyle Minimized

Start-Sleep -Seconds 2

Write-Host "Admin API baslatiliyor (Port 5266)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd c:\dietApp\apps\admin-api; dotnet run" -WindowStyle Minimized

Write-Host ""
Write-Host "Tum servisler baslatildi!" -ForegroundColor Green
Write-Host ""
Write-Host "Erisim URL'leri:" -ForegroundColor Cyan
Write-Host "Landing Page:        http://localhost:5173" -ForegroundColor White
Write-Host "Web Application:     http://localhost:3000" -ForegroundColor White
Write-Host "API Backend:         http://localhost:5000" -ForegroundColor White
Write-Host "API Documentation:   http://localhost:5000/swagger" -ForegroundColor White
Write-Host "Notification API:    http://localhost:5001" -ForegroundColor White
Write-Host "Admin API:           http://localhost:5266" -ForegroundColor White
Write-Host "Health Check:        http://localhost:5001/health" -ForegroundColor White
Write-Host ""
Write-Host "Servislerin tamamen baslamasi 30-60 saniye surebilir..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Tum servisleri durdurmak icin: npm run dev:stop" -ForegroundColor Red
Write-Host ""

# 10 saniye bekle ve ana uygulamayi ac
Write-Host "10 saniye sonra ana uygulama otomatik acilacak..." -ForegroundColor Magenta
Start-Sleep -Seconds 10

# Ana uygulamayi tarayicida ac
Start-Process "http://localhost:3000"

Write-Host "Komut tamamlandi. Tum servisler arka planda calisiyor." -ForegroundColor Green
