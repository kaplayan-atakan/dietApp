@echo off
echo AI Fitness Coach - Tum Servisleri Baslatiliyor...
echo ===============================================

cd /d "c:\dietApp"

echo Landing Page baslatiliyor (Port 5173)...
start "Landing Page" cmd /k "npm run landing:dev"

timeout /t 2 /nobreak >nul

echo Web Application baslatiliyor (Port 3000)...
start "Web App" cmd /k "npm run web-app:dev"

timeout /t 2 /nobreak >nul

echo API Backend baslatiliyor (Port 5000)...
start "API Backend" cmd /k "cd apps\api && dotnet run"

timeout /t 2 /nobreak >nul

echo Notification Service baslatiliyor (Port 5001)...
start "Notification Service" cmd /k "cd apps\notification-service && dotnet run"

timeout /t 2 /nobreak >nul

echo Queue Processor baslatiliyor...
start "Queue Processor" cmd /k "cd apps\queue-processor && dotnet run"

timeout /t 2 /nobreak >nul

echo Admin API baslatiliyor (Port 5266)...
start "Admin API" cmd /k "cd apps\admin-api && dotnet run"

echo.
echo Tum servisler baslatildi!
echo.
echo Erisim URL'leri:
echo Landing Page:        http://localhost:5173
echo Web Application:     http://localhost:3000
echo API Backend:         http://localhost:5000
echo API Documentation:   http://localhost:5000/swagger
echo Notification API:    http://localhost:5001
echo Admin API:           http://localhost:5266
echo Health Check:        http://localhost:5001/health
echo.
echo Servislerin tamamen baslamasi 30-60 saniye surebilir...
echo.
echo 10 saniye sonra ana uygulama acilacak...
timeout /t 10 /nobreak >nul

start http://localhost:3000

echo Komut tamamlandi. Tum servisler arka planda calisiyor.
pause
