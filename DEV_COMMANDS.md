# 🚀 AI Fitness Coach - Geliştirme Komutları

Bu doküman, AI Fitness Coach projesindeki tüm geliştirme servislerini kolayca yönetmeniz için gerekli komutları içerir.

## 📋 Hızlı Başlangıç

### Tüm Servisleri Başlatma (Mobil Hariç)

```powershell
# Yöntem 1: PowerShell Script (Önerilen)
npm run dev:start

# Yöntem 2: Concurrently ile tek terminalde
npm run dev:concurrent
```

### Tüm Servisleri Durdurma

```powershell
npm run dev:stop
```

### Servisleri Yeniden Başlatma

```powershell
npm run dev:restart
```

## 🌐 Çalışan Servisler ve Portlar

| Servis | Port | URL | Açıklama |
|--------|------|-----|----------|
| 🌐 Landing Page | 5173 | http://localhost:5173 | Marketing sayfası (Vite) |
| 🎯 Web Application | 3000 | http://localhost:3000 | Ana uygulama (Next.js) |
| 🔧 API Backend | 5000 | http://localhost:5000 | REST API (.NET Core) |
| 📚 API Documentation | 5000 | http://localhost:5000/swagger | Swagger UI |
| 📧 Notification Service | 5001 | http://localhost:5001 | Bildirim servisi |
| 🏥 Health Check | 5001 | http://localhost:5001/health | Sistem durumu |
| ⚙️ Queue Processor | - | Background Service | Kuyruk işlemcisi |

## 📱 Mobil Uygulama (Ayrı Komutlar)

```powershell
# iOS Simulator
npm run mobile:ios

# Android Emulator
npm run mobile:android
```

## 🔧 Tekil Servis Komutları

```powershell
# Landing page
npm run landing:dev

# Web application
npm run web-app:dev

# API Backend
cd apps/api && dotnet run

# Notification Service
cd apps/notification-service && dotnet run

# Queue Processor
cd apps/queue-processor && dotnet run
```

## 🛠️ Diğer Yararlı Komutlar

```powershell
# Tüm bağımlılıkları yükle
npm run install:all

# Projeyi build et
npm run build

# Testleri çalıştır
npm run test

# Kod formatla
npm run format

# Type check
npm run type-check

# Temizlik
npm run clean
```

## ⚡ PowerShell Execution Policy

Eğer script çalıştırma hatası alırsanız, PowerShell'i yönetici olarak açıp şu komutu çalıştırın:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 🐛 Sorun Giderme

### Port Çakışması
Eğer port çakışması yaşarsanız:
```powershell
npm run dev:stop
```

### Manuel Port Temizleme
```powershell
# Belirli bir portu kullanan işlemi bul
netstat -ano | findstr :3000
# İşlemi sonlandır (PID ile)
taskkill /PID <PID> /F
```

### .NET Restore Sorunu
```powershell
npm run dotnet:restore
```

## 📝 Notlar

- **dev:start**: Servisleri ayrı PowerShell pencerelerinde başlatır (önerilen)
- **dev:concurrent**: Tüm servisleri tek terminalde çalıştırır
- Servisler tamamen başlaması 30-60 saniye sürebilir
- İlk başlatmada daha uzun sürebilir (bağımlılık indirme)

## 🔗 Faydalı Linkler

- [Ana Uygulama](http://localhost:3000)
- [Landing Page](http://localhost:5173)
- [API Dokümantasyonu](http://localhost:5000/swagger)
- [Sistem Durumu](http://localhost:5001/health)
