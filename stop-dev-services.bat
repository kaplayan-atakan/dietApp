@echo off
echo AI Fitness Coach - Tum Servisleri Durduruluyor...
echo =================================================

echo .NET Core servislerini durduruyor...
taskkill /f /im "dotnet.exe" 2>nul
if %errorlevel% == 0 (
    echo .NET servisleri durduruldu
) else (
    echo Hic .NET servisi bulunamadi
)

echo Node.js servislerini durduruyor...
taskkill /f /im "node.exe" 2>nul
if %errorlevel% == 0 (
    echo Node.js servisleri durduruldu
) else (
    echo Hic Node.js servisi bulunamadi
)

echo Port kullanimini kontrol ediyor...

for %%p in (3000 5000 5001 5173 5266) do (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%%p "') do (
        taskkill /f /pid %%a 2>nul >nul
        echo Port %%p temizlendi
    )
)

echo.
echo Tum gelistirme servisleri basariyla durduruldu!
echo.
echo Servisleri tekrar baslatmak icin: npm run dev:start
echo.

timeout /t 3 /nobreak >nul
