# 🌐 AI Fitness Coach - Landing Page

React 18 ve Vite ile geliştirilmiş marketing ve tanıtım sayfası.

## 🛠️ Teknoloji Stack

- **React 18** - Modern React library
- **Vite** - Fast build tool
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animation library
- **React Router** - Client-side routing

## 📁 Proje Yapısı

```
src/
├── components/           # React components
│   ├── ui/              # Base UI components
│   ├── sections/        # Page sections
│   └── layout/          # Layout components
├── pages/               # Page components
├── hooks/               # Custom React hooks
├── utils/               # Helper functions
├── assets/              # Images, icons
└── styles/              # CSS files
```

## 🚀 Kurulum ve Çalıştırma

```bash
# Dependencies yükle
npm install

# Development server başlat
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## 🎨 Ana Bileşenler

### 1. Hero Section
```typescript
// src/components/sections/Hero.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            AI ile Kişisel
            <span className="text-green-500"> Beslenme </span>
            ve
            <span className="text-blue-500"> Egzersiz </span>
            Koçu
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Yapay zeka teknolojisi ile size özel beslenme ve egzersiz planları alın. 
            Hedeflerinize ulaşmanın en kolay yolu burada.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg"
              onClick={() => window.open('/app', '_blank')}
            >
              Hemen Başla
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="border-gray-300 text-gray-700 px-8 py-4 text-lg"
              onClick={() => document.getElementById('demo')?.scrollIntoView()}
            >
              <Play className="mr-2 h-5 w-5" />
              Demo İzle
            </Button>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16"
        >
          <img
            src="/images/hero-dashboard.png"
            alt="AI Fitness Coach Dashboard"
            className="rounded-lg shadow-2xl mx-auto max-w-4xl w-full"
          />
        </motion.div>
      </div>
    </section>
  );
};
```

### 2. Features Section
```typescript
// src/components/sections/Features.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Calendar, TrendingUp, Smartphone, Shield, Zap } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI Destekli Planlar',
    description: 'Yapay zeka ile kişiselleştirilmiş beslenme ve egzersiz planları alın.'
  },
  {
    icon: Calendar,
    title: 'Haftalık Program',
    description: 'Her hafta güncellenebilen detaylı programlar ile hedeflerinize odaklanın.'
  },
  {
    icon: TrendingUp,
    title: 'İlerleme Takibi',
    description: 'Gerçek zamanlı analytics ile ilerlemenizi takip edin ve motive olun.'
  },
  {
    icon: Smartphone,
    title: 'Multi-Platform',
    description: 'Mobile app, web app ve PWA desteği ile her yerden erişim.'
  },
  {
    icon: Shield,
    title: 'Güvenli & Özel',
    description: 'Verileriniz şifrelenir ve kişisel bilgileriniz güvende tutulur.'
  },
  {
    icon: Zap,
    title: 'Hızlı Başlangıç',
    description: '5 dakikada kayıt olun ve AI planınızı hemen almaya başlayın.'
  }
];

export const Features: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Neden AI Fitness Coach?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Geleneksel fitness uygulamalarından farklı olarak, AI teknolojisi ile 
            size tamamen özel bir deneyim sunuyoruz.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <feature.icon className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
```

### 3. Pricing Section
```typescript
// src/components/sections/Pricing.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const plans = [
  {
    name: 'Başlangıç',
    price: '0',
    period: 'Ücretsiz',
    description: 'Temel özellikler ile başlayın',
    features: [
      'Temel AI planı',
      'Haftalık program',
      'Basit ilerleme takibi',
      'Community desteği'
    ],
    cta: 'Hemen Başla',
    popular: false
  },
  {
    name: 'Premium',
    price: '99',
    period: '/ay',
    description: 'Tam özellikli AI koçluk deneyimi',
    features: [
      'Gelişmiş AI planları',
      'Günlük öneriler',
      'Detaylı analytics',
      'Push notifications',
      'Öncelikli destek',
      'Özel tarifeler'
    ],
    cta: 'Premium\'a Geç',
    popular: true
  },
  {
    name: 'Enterprise',
    price: '299',
    period: '/ay',
    description: 'Kurumsal çözümler',
    features: [
      'Tüm premium özellikler',
      'Kurumsal dashboard',
      'API erişimi',
      'Özel entegrasyonlar',
      '7/24 destek',
      'Custom branding'
    ],
    cta: 'İletişime Geç',
    popular: false
  }
];

export const Pricing: React.FC = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Size Uygun Planı Seçin
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            İhtiyaçlarınıza göre tasarlanmış esnek fiyatlandırma seçenekleri.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`relative p-8 rounded-lg border-2 ${
                plan.popular 
                  ? 'border-green-500 bg-white shadow-lg scale-105' 
                  : 'border-gray-200 bg-white'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    En Popüler
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-center justify-center mb-2">
                  <span className="text-4xl font-bold text-gray-900">
                    ₺{plan.price}
                  </span>
                  <span className="text-gray-600 ml-1">
                    {plan.period}
                  </span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                className={`w-full ${
                  plan.popular
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
```

## 🎨 Styling & Animation

```typescript
// src/utils/animations.ts
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8 }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const slideInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.8 }
};
```

## 📊 Analytics Integration

```typescript
// src/utils/analytics.ts
export class Analytics {
  static trackEvent(eventName: string, properties?: Record<string, any>) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, properties);
    }
  }

  static trackPageView(path: string) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_TRACKING_ID', {
        page_path: path,
      });
    }
  }
}
```

---

**Last Updated**: 2025-05-30