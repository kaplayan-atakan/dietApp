# AI Fitness Coach - Stop Development Services
# Bu script tum gelistirme servislerini durdurur

Write-Host "AI Fitness Coach - Tum Servisleri Durduruluyor..." -ForegroundColor Red
Write-Host "=================================================" -ForegroundColor Cyan

# .NET ve Node.js islemlerini durdur
Write-Host ".NET Core servislerini durduruyor..." -ForegroundColor Yellow
try {
    Get-Process -Name "dotnet" -ErrorAction SilentlyContinue | Stop-Process -Force
    Write-Host ".NET servisleri durduruldu" -ForegroundColor Green
}
catch {
    Write-Host "Hic .NET servisi bulunamadi" -ForegroundColor Gray
}

Write-Host "Node.js servislerini durduruyor..." -ForegroundColor Yellow
try {
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
    Write-Host "Node.js servisleri durduruldu" -ForegroundColor Green
}
catch {
    Write-Host "Hic Node.js servisi bulunamadi" -ForegroundColor Gray
}

# Portlari kontrol et ve temizle
Write-Host "Port kullanimini kontrol ediyor..." -ForegroundColor Yellow

$ports = @(3000, 5000, 5001, 5173, 5266)
foreach ($port in $ports) {
    try {
        $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        if ($process) {
            $pid = $process.OwningProcess
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
            Write-Host "Port $port temizlendi" -ForegroundColor Green
        }
    }
    catch {
        # Port zaten bos
    }
}

Write-Host ""
Write-Host "Tum gelistirme servisleri basariyla durduruldu!" -ForegroundColor Green
Write-Host ""
Write-Host "Servisleri tekrar baslatmak icin: npm run dev:start" -ForegroundColor Cyan
Write-Host ""

Start-Sleep -Seconds 3
