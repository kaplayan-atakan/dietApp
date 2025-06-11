# 💻 AI Fitness Coach - Web Application (PWA)

React 18 ve Next.js 14 ile geliştirilmiş Progressive Web App - AI destekli beslenme ve fitness koçu web uygulaması.

## 🛠️ Teknoloji Stack

- **React 18** - Modern React features
- **Next.js 14** - Full-stack React framework (App Router)
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **React Query** - Server state management
- **PWA** - Progressive Web App capabilities
- **Web Push Notifications** - Real-time notifications

## 📁 Proje Yapısı

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth layout group
│   ├── (dashboard)/       # Dashboard layout group
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── forms/            # Form components
│   ├── charts/           # Chart components
│   └── layout/           # Layout components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── services/             # API services
├── store/                # Redux store
├── types/                # TypeScript definitions
└── utils/                # Helper functions
public/
├── sw.js                 # Service Worker
├── manifest.json         # PWA manifest
└── icons/               # PWA icons
```

## 🚀 Kurulum ve Çalıştırma

```bash
# Dependencies yükle
npm install

# Environment variables ayarla
cp .env.example .env.local

# Development server başlat
npm run dev

# Production build
npm run build

# Production server
npm run start
```

## 🔧 Ana Bileşenler

### 1. PWA Configuration
```typescript
// src/lib/pwa.ts
export class PWAHelper {
  private deferredPrompt: any = null;

  constructor() {
    this.setupPWA();
  }

  private setupPWA() {
    // BeforeInstallPrompt event listener
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallPrompt();
    });

    // App installed event
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      this.deferredPrompt = null;
    });

    // Service Worker registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }

  async installApp() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      this.deferredPrompt = null;
    }
  }
}
```

### 2. Dashboard Page
```typescript
// src/app/(dashboard)/dashboard/page.tsx
'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { TodaysPlan } from '@/components/dashboard/TodaysPlan';
import { ProgressChart } from '@/components/charts/ProgressChart';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { AIRecommendations } from '@/components/dashboard/AIRecommendations';
import { apiClient } from '@/lib/api-client';

export default function DashboardPage() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => apiClient.dashboard.getDashboardData(),
    refetchInterval: 30000,
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Merhaba, {dashboardData?.user.name} 👋
        </h1>
        <QuickActions />
      </div>

      <DashboardStats stats={dashboardData?.stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodaysPlan plan={dashboardData?.todaysPlan} />
        <AIRecommendations recommendations={dashboardData?.aiRecommendations} />
      </div>

      <ProgressChart data={dashboardData?.progressData} />
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  );
}
```

### 3. Web Push Notifications
```typescript
// src/services/NotificationService.ts
export class WebNotificationService {
  private registration: ServiceWorkerRegistration | null = null;

  async initialize(): Promise<void> {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        this.registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered');
        
        await this.requestPermission();
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  async requestPermission(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  async subscribe(): Promise<PushSubscription | null> {
    if (!this.registration) return null;

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      });

      // Send subscription to backend
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription)
      });

      return subscription;
    } catch (error) {
      console.error('Failed to subscribe:', error);
      return null;
    }
  }
}
```

### 4. Service Worker
```javascript
// public/sw.js
const CACHE_NAME = 'ai-fitness-coach-v1';
const urlsToCache = [
  '/',
  '/dashboard',
  '/tracking',
  '/static/js/bundle.js',
  '/static/css/main.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Yeni bildirim!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    data: event.data ? JSON.parse(event.data.text()) : {}
  };

  event.waitUntil(
    self.registration.showNotification('AI Fitness Coach', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const data = event.notification.data;
  let url = '/dashboard';
  
  if (data.type === 'plan_ready') {
    url = `/plans/${data.planId}`;
  } else if (data.type === 'daily_reminder') {
    url = '/tracking';
  }
  
  event.waitUntil(
    clients.openWindow(url)
  );
});
```

## 🎨 Design System

```typescript
// src/styles/theme.ts
export const theme = {
  colors: {
    primary: {
      50: '#F0FDF4',
      500: '#00C896',
      600: '#00B085',
      700: '#009874'
    },
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      500: '#6B7280',
      900: '#111827'
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  }
};
```

## 📊 Performance Monitoring

```typescript
// src/lib/performance.ts
export class PerformanceMonitor {
  static reportWebVitals(metric: any) {
    console.log(metric);
    
    // Send to analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_category: 'Web Vitals',
        event_label: metric.id,
        non_interaction: true,
      });
    }
  }
}
```

---

**Last Updated**: 2025-05-30