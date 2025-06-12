# 🚀 AI Fitness Coach - Complete Deployment Guide

Bu rehber, AI Fitness Coach uygulamasını GitHub'un ücretsiz servisleri ve diğer ücretsiz platformlar kullanarak tam olarak deploy etmenin adımlarını açıklar.

## 📋 Deployment Overview

### Frontend Deployments (Ücretsiz)
- **Landing Page**: GitHub Pages (Ücretsiz)
- **Web App**: Vercel (Ücretsiz plan)

### Backend Deployments (Ücretsiz)
- **Main API**: Render.com (Ücretsiz plan)
- **Admin API**: Render.com (Ücretsiz plan)
- **Notification Service**: Render.com (Ücretsiz plan)
- **Database**: Render.com PostgreSQL (Ücretsiz plan)

## 🔧 Step 1: GitHub Repository Setup (Tamamlandı ✅)

Repository zaten hazır ve push edildi:
- Repository URL: https://github.com/kaplayan-atakan/dietApp.git
- GitHub Actions workflows hazır
- .gitignore dosyası yapılandırıldı

## 🌐 Step 2: GitHub Pages Setup (Landing Page)

### GitHub Pages Aktivasyonu:
1. GitHub repository'de **Settings** > **Pages** sekmesine git
2. **Source**: "GitHub Actions" seçin
3. İlk push ile otomatik deploy olacak

**Deployed URL**: `https://kaplayan-atakan.github.io/dietApp/`

## ☁️ Step 3: Vercel Setup (Web App)

### Vercel Account Setup:
1. [vercel.com](https://vercel.com) adresinde GitHub ile signup
2. GitHub repository'yi import et
3. Proje ayarları:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web-app`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Environment Variables (Vercel Dashboard):
```
NEXT_PUBLIC_API_URL=https://ai-fitness-api.onrender.com/api
NEXT_PUBLIC_NOTIFICATION_URL=https://ai-fitness-notifications.onrender.com
NEXT_PUBLIC_ADMIN_API_URL=https://ai-fitness-admin-api.onrender.com
NEXT_PUBLIC_APP_NAME=AI Fitness Coach
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### GitHub Secrets (Repository Settings > Secrets):
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
```

## 🖥️ Step 4: Render.com Setup (Backend Services)

### Render.com Account Setup:
1. [render.com](https://render.com) adresinde GitHub ile signup
2. GitHub repository'yi connect et

### Database Setup (PostgreSQL):
1. **New** > **PostgreSQL** oluştur
2. Settings:
   - **Name**: `ai-fitness-db`
   - **Database**: `ai_fitness_coach`
   - **User**: `ai_fitness_user`
   - **Region**: Oregon (ücretsiz)
   - **Plan**: Free

### Service 1: Main API
1. **New** > **Web Service** oluştur
2. Settings:
   - **Name**: `ai-fitness-api`
   - **Repository**: `kaplayan-atakan/dietApp`
   - **Branch**: `main`
   - **Root Directory**: `apps/api`
   - **Runtime**: Docker
   - **Docker Command**: Default
   - **Plan**: Free

#### Environment Variables:
```
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://0.0.0.0:8080
DATABASE_URL=postgresql://ai_fitness_user:password@host/ai_fitness_coach
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
ALLOWED_ORIGINS=https://ai-fitness-coach.vercel.app,https://kaplayan-atakan.github.io
CORS_ENABLED=true
```

### Service 2: Admin API
1. **New** > **Web Service** oluştur
2. Settings:
   - **Name**: `ai-fitness-admin-api`
   - **Repository**: `kaplayan-atakan/dietApp`
   - **Branch**: `main`
   - **Root Directory**: `apps/admin-api`
   - **Runtime**: Docker
   - **Plan**: Free

#### Environment Variables:
```
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://0.0.0.0:8080
DATABASE_URL=postgresql://ai_fitness_user:password@host/ai_fitness_coach
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
ALLOWED_ORIGINS=https://ai-fitness-coach.vercel.app,https://kaplayan-atakan.github.io
```

### Service 3: Notification Service
1. **New** > **Web Service** oluştur
2. Settings:
   - **Name**: `ai-fitness-notifications`
   - **Repository**: `kaplayan-atakan/dietApp`
   - **Branch**: `main`
   - **Root Directory**: `apps/notification-service`
   - **Runtime**: Docker
   - **Plan**: Free

#### Environment Variables:
```
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://0.0.0.0:8080
```

## 📱 Step 5: Mobile App (Expo Go - Development)

Development için Expo Go kullanılabilir:

1. `cd apps/mobile`
2. `npm install`
3. `npx expo start`
4. QR kod ile Expo Go uygulamasından açabilirsiniz

Production deploy için Expo EAS Build gerekir (ücretli).

## 🔐 Step 6: Required GitHub Secrets

Repository Settings > Secrets and Variables > Actions:

```
# Vercel Secrets
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id  
VERCEL_PROJECT_ID=your_vercel_project_id

# Render Secrets (opsiyonel - manuel deploy için gerekli değil)
RENDER_API_KEY=your_render_api_key
RENDER_API_SERVICE_ID=your_api_service_id
RENDER_ADMIN_API_SERVICE_ID=your_admin_api_service_id
RENDER_NOTIFICATION_SERVICE_ID=your_notification_service_id
```

## 🎯 Step 7: Verification & Testing

### 1. Landing Page Test:
```
https://kaplayan-atakan.github.io/dietApp/
```

### 2. Web App Test:
```
https://your-project.vercel.app
```

### 3. API Endpoints Test:
```bash
# Health Check
curl https://ai-fitness-api.onrender.com/health

# Admin API
curl https://ai-fitness-admin-api.onrender.com/swagger

# Notification Service  
curl https://ai-fitness-notifications.onrender.com/health
```

## 🚨 Important Notes

### Free Tier Limitations:
- **Render.com**: Servislər 15 dəqiqə ərzində istifadə edilməzsə yatır (cold start)
- **Vercel**: Aylıq 100GB bandwidth limiti
- **GitHub Pages**: 1GB storage, 100GB bandwidth

### First Deploy Timing:
- Backend servisleri ilk defa deploy edilirken 10-15 dakika sürebilir
- Database migration otomatik çalışmayabilir, manuel trigger gerekebilir

### CORS Configuration:
- Production URL'ler güncellendikten sonra backend'de CORS ayarları kontrol edilmeli
- Environment variables doğru set edilmeli

## 🔄 Continuous Deployment

GitHub'a her push:
1. ✅ Landing page otomatik GitHub Pages'e deploy olur
2. ✅ Web app otomatik Vercel'e deploy olur  
3. ✅ Backend servisleri Render.com'da otomatik build olur

## 🐛 Troubleshooting

### Backend 500 Errors:
- Render.com dashboard'dan logs kontrol edin
- Database connection string'i verify edin
- Environment variables set edildi mi kontrol edin

### CORS Errors:
- Allowed origins listesi güncel mi?
- Backend CORS policy doğru mu?

### Cold Start Issues:
- İlk request'te 30-60 saniye gecikme normal (Render free tier)
- Keep-alive ping servisi kurulabilir

---

Bu deployment guide'ı takip ederek tüm sistem ücretsiz olarak production'a alınabilir! 🎉
