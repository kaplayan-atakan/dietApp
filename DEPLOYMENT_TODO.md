# 📋 AI Fitness Coach - Deployment TODO List

## 🎯 Şu Anda Yapmanız Gereken Adımlar

### 1. ⚡ GitHub Pages Aktivasyonu (5 dakika)
**Durum**: 🔄 Bekliyor
**Yapılacaklar**:
1. https://github.com/kaplayan-atakan/dietApp/settings/pages adresine git
2. **Source** bölümünde "GitHub Actions" seç
3. Kaydı et ve bekle (5-10 dakika)
4. Landing page otomatik deploy olacak: https://kaplayan-atakan.github.io/dietApp/

### 2. ☁️ Vercel Web App Deploy (15 dakika)
**Durum**: 🔄 Bekliyor
**Yapılacaklar**:
1. https://vercel.com adresinde GitHub ile kayıt ol
2. "Import Project" > GitHub repository seç
3. Ayarlar:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web-app`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
4. Environment Variables ekle:
   ```
   NEXT_PUBLIC_API_URL=https://ai-fitness-api.onrender.com/api
   NEXT_PUBLIC_NOTIFICATION_URL=https://ai-fitness-notifications.onrender.com
   NEXT_PUBLIC_ADMIN_API_URL=https://ai-fitness-admin-api.onrender.com
   NEXT_PUBLIC_APP_NAME=AI Fitness Coach
   NEXT_PUBLIC_APP_VERSION=1.0.0
   ```
5. Deploy butonuna bas

### 3. 🖥️ Render.com Backend Services (30 dakika)
**Durum**: 🔄 Bekliyor

#### 3a. PostgreSQL Database (5 dakika)
1. https://render.com adresinde GitHub ile kayıt ol
2. **New** > **PostgreSQL** oluştur
3. Ayarlar:
   - **Name**: `ai-fitness-db`
   - **Database**: `ai_fitness_coach`
   - **User**: `ai_fitness_user`
   - **Plan**: Free
   - **Region**: Oregon
4. Connection string'i kaydet

#### 3b. Main API Service (10 dakika)
1. **New** > **Web Service**
2. GitHub repository: `kaplayan-atakan/dietApp`
3. Ayarlar:
   - **Name**: `ai-fitness-api`
   - **Root Directory**: `apps/api`
   - **Runtime**: Docker
   - **Plan**: Free
4. Environment Variables:
   ```
   ASPNETCORE_ENVIRONMENT=Production
   ASPNETCORE_URLS=http://0.0.0.0:8080
   DATABASE_URL=[PostgreSQL connection string]
   JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
   ALLOWED_ORIGINS=https://[vercel-url],https://kaplayan-atakan.github.io
   ```

#### 3c. Admin API Service (10 dakika)
1. **New** > **Web Service**
2. Ayarlar:
   - **Name**: `ai-fitness-admin-api`
   - **Root Directory**: `apps/admin-api`
   - **Runtime**: Docker
   - **Plan**: Free
4. Environment Variables ekle (DATABASE_URL, JWT_SECRET, ALLOWED_ORIGINS)

#### 3d. Notification Service (5 dakika)
1. **New** > **Web Service**
2. Ayarlar:
   - **Name**: `ai-fitness-notifications`
   - **Root Directory**: `apps/notification-service`
   - **Runtime**: Docker
   - **Plan**: Free

### 4. 🔐 GitHub Secrets Setup (10 dakika)
**Durum**: 🔄 Bekliyor
1. GitHub repo > Settings > Secrets and variables > Actions
2. Ekle:
   ```
   VERCEL_TOKEN=[Vercel dashboard'dan al]
   VERCEL_ORG_ID=[Vercel settings'den al]
   VERCEL_PROJECT_ID=[Vercel project settings'den al]
   ```

### 5. 🔄 URL Updates (5 dakika)
**Durum**: 🔄 Bekliyor
1. Render services deploy olduktan sonra URL'leri al
2. Vercel environment variables'ı güncelle
3. GitHub Actions trigger et

## ✅ Tamamlandığında Test Et

Tüm adımlar tamamlandıktan sonra:

```powershell
cd c:\dietApp
.\test-deployment.ps1
```

## 🎯 Beklenen Sonuçlar

✅ **Landing Page**: https://kaplayan-atakan.github.io/dietApp/
✅ **Web App**: https://[project-name].vercel.app
✅ **Main API**: https://ai-fitness-api.onrender.com/swagger
✅ **Admin API**: https://ai-fitness-admin-api.onrender.com/swagger
✅ **Notification Service**: https://ai-fitness-notifications.onrender.com/health

## ⏱️ Tahmini Süre: 1 saat

## 💡 İpuçları

- Render'da ilk deploy 10-15 dakika sürebilir
- Free tier limitları: 
  - Render: 15 dakika inaktivite sonrası sleep
  - Vercel: 100GB/ay bandwidth
- CORS hataları alırsan ALLOWED_ORIGINS'i kontrol et
- Database connection issues için connection string'i verify et

## 🆘 Yardım

Sorun olursa:
1. DEPLOYMENT_GUIDE.md dosyasını detaylı oku
2. Platform dashboards'larında logs'lara bak
3. Test script'ini çalıştır: `.\test-deployment.ps1`
