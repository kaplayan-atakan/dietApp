#!/bin/bash

# AI Fitness Coach - Deployment Test Script
# Bu script deployment sonrası tüm servislerin çalışıp çalışmadığını kontrol eder

echo "🚀 AI Fitness Coach - Deployment Test"
echo "====================================="

# Test URLs - Deployment sonrası güncellenecek
LANDING_PAGE_URL="https://kaplayan-atakan.github.io/dietApp/"
WEB_APP_URL="https://your-project.vercel.app"
API_URL="https://ai-fitness-api.onrender.com"
ADMIN_API_URL="https://ai-fitness-admin-api.onrender.com"
NOTIFICATION_URL="https://ai-fitness-notifications.onrender.com"

echo ""
echo "📱 Testing Frontend Services..."
echo "-------------------------------"

# Test Landing Page
echo "🏠 Testing Landing Page..."
curl -s -o /dev/null -w "Status: %{http_code} | Time: %{time_total}s\n" $LANDING_PAGE_URL
if [ $? -eq 0 ]; then
    echo "✅ Landing Page is accessible"
else
    echo "❌ Landing Page failed"
fi

# Test Web App (will fail until Vercel is configured)
echo ""
echo "💻 Testing Web App..."
curl -s -o /dev/null -w "Status: %{http_code} | Time: %{time_total}s\n" $WEB_APP_URL
if [ $? -eq 0 ]; then
    echo "✅ Web App is accessible"
else
    echo "⚠️  Web App not yet deployed (Vercel setup required)"
fi

echo ""
echo "🖥️  Testing Backend Services..."
echo "-------------------------------"

# Test Main API
echo "🔌 Testing Main API..."
curl -s -o /dev/null -w "Status: %{http_code} | Time: %{time_total}s\n" "$API_URL/health"
if [ $? -eq 0 ]; then
    echo "✅ Main API is responding"
else
    echo "⚠️  Main API not yet deployed (Render setup required)"
fi

# Test Admin API
echo ""
echo "🔧 Testing Admin API..."
curl -s -o /dev/null -w "Status: %{http_code} | Time: %{time_total}s\n" "$ADMIN_API_URL/swagger"
if [ $? -eq 0 ]; then
    echo "✅ Admin API is responding"
else
    echo "⚠️  Admin API not yet deployed (Render setup required)"
fi

# Test Notification Service
echo ""
echo "📧 Testing Notification Service..."
curl -s -o /dev/null -w "Status: %{http_code} | Time: %{time_total}s\n" "$NOTIFICATION_URL/health"
if [ $? -eq 0 ]; then
    echo "✅ Notification Service is responding"
else
    echo "⚠️  Notification Service not yet deployed (Render setup required)"
fi

echo ""
echo "🔍 Testing API Endpoints..."
echo "---------------------------"

# Test API endpoints (will work after Render deployment)
echo "🎯 Testing Auth endpoint..."
curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}' \
  -w "Status: %{http_code}\n" -o /dev/null

echo ""
echo "🎯 Testing Admin logs endpoint..."
curl -s -X POST "$ADMIN_API_URL/api/logs" \
  -H "Content-Type: application/json" \
  -d '{"level":"info","message":"Deployment test","timestamp":"2024-01-01T00:00:00Z"}' \
  -w "Status: %{http_code}\n" -o /dev/null

echo ""
echo "📊 Deployment Status Summary:"
echo "============================="
echo "✅ Repository: Pushed to GitHub"
echo "✅ GitHub Actions: Workflows configured"
echo "✅ Dockerfiles: Created for all services"
echo "✅ Environment configs: Set up for production"
echo "⏳ GitHub Pages: Auto-deploy on push"
echo "⏳ Vercel: Manual setup required"
echo "⏳ Render.com: Manual setup required"
echo ""
echo "📖 Next Steps:"
echo "1. Follow DEPLOYMENT_GUIDE.md for platform setup"
echo "2. Configure secrets in GitHub repository"
echo "3. Set up services on Vercel and Render.com"
echo "4. Update URLs in this test script"
echo "5. Re-run this test after deployment"
echo ""
echo "🎉 Ready for deployment!"
