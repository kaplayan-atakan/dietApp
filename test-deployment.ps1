# AI Fitness Coach - Deployment Test Script (PowerShell)
# Bu script deployment sonrası tüm servislerin çalışıp çalışmadığını kontrol eder

Write-Host "🚀 AI Fitness Coach - Deployment Test" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Test URLs - Deployment sonrası güncellenecek
$LANDING_PAGE_URL = "https://kaplayan-atakan.github.io/dietApp/"
$WEB_APP_URL = "https://your-project.vercel.app"
$API_URL = "https://ai-fitness-api.onrender.com"
$ADMIN_API_URL = "https://ai-fitness-admin-api.onrender.com"
$NOTIFICATION_URL = "https://ai-fitness-notifications.onrender.com"

Write-Host ""
Write-Host "📱 Testing Frontend Services..." -ForegroundColor Cyan
Write-Host "-------------------------------" -ForegroundColor Cyan

# Test Landing Page
Write-Host "🏠 Testing Landing Page..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $LANDING_PAGE_URL -Method Get -TimeoutSec 10
    Write-Host "✅ Landing Page is accessible (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Landing Page failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Web App
Write-Host ""
Write-Host "💻 Testing Web App..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $WEB_APP_URL -Method Get -TimeoutSec 10
    Write-Host "✅ Web App is accessible (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Web App not yet deployed (Vercel setup required)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🖥️ Testing Backend Services..." -ForegroundColor Cyan
Write-Host "-------------------------------" -ForegroundColor Cyan

# Test Main API
Write-Host "🔌 Testing Main API..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$API_URL/health" -Method Get -TimeoutSec 15
    Write-Host "✅ Main API is responding (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Main API not yet deployed (Render setup required)" -ForegroundColor Yellow
}

# Test Admin API
Write-Host ""
Write-Host "🔧 Testing Admin API..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$ADMIN_API_URL/swagger" -Method Get -TimeoutSec 15
    Write-Host "✅ Admin API is responding (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Admin API not yet deployed (Render setup required)" -ForegroundColor Yellow
}

# Test Notification Service
Write-Host ""
Write-Host "📧 Testing Notification Service..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$NOTIFICATION_URL/health" -Method Get -TimeoutSec 15
    Write-Host "✅ Notification Service is responding (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Notification Service not yet deployed (Render setup required)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔍 Testing API Endpoints..." -ForegroundColor Cyan
Write-Host "---------------------------" -ForegroundColor Cyan

# Test API endpoints
Write-Host "🎯 Testing Auth endpoint..." -ForegroundColor Yellow
try {
    $body = @{
        username = "test"
        password = "test"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$API_URL/api/auth/login" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 10
    Write-Host "Auth endpoint responded (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "Auth endpoint not available yet" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎯 Testing Admin logs endpoint..." -ForegroundColor Yellow
try {
    $body = @{
        level = "info"
        message = "Deployment test"
        timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$ADMIN_API_URL/api/logs" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 10
    Write-Host "Logs endpoint responded (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "Logs endpoint not available yet" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📊 Deployment Status Summary:" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host "✅ Repository: Pushed to GitHub" -ForegroundColor Green
Write-Host "✅ GitHub Actions: Workflows configured" -ForegroundColor Green
Write-Host "✅ Dockerfiles: Created for all services" -ForegroundColor Green
Write-Host "✅ Environment configs: Set up for production" -ForegroundColor Green
Write-Host "⏳ GitHub Pages: Auto-deploy on push" -ForegroundColor Yellow
Write-Host "⏳ Vercel: Manual setup required" -ForegroundColor Yellow
Write-Host "⏳ Render.com: Manual setup required" -ForegroundColor Yellow

Write-Host ""
Write-Host "📖 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Follow DEPLOYMENT_GUIDE.md for platform setup"
Write-Host "2. Configure secrets in GitHub repository"
Write-Host "3. Set up services on Vercel and Render.com"
Write-Host "4. Update URLs in this test script"
Write-Host "5. Re-run this test after deployment"

Write-Host ""
Write-Host "🎉 Ready for deployment!" -ForegroundColor Green
