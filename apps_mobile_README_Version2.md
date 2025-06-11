# 📱 AI Fitness Coach - Mobile App

React Native ile geliştirilmiş AI destekli beslenme ve fitness koçu mobil uygulaması.

## 🛠️ Teknoloji Stack

- **React Native 0.72** - Cross-platform development
- **TypeScript** - Type safety
- **React Navigation 6** - Navigation management
- **Redux Toolkit** - State management
- **React Hook Form** - Form handling
- **React Query** - Server state management
- **Firebase Cloud Messaging** - Push notifications
- **Tailwind-inspired styling** - Design system

## 📁 Proje Yapısı

```
src/
├── screens/           # Uygulama ekranları
│   ├── onboarding/   # Kullanıcı kayıt süreci
│   ├── dashboard/    # Ana dashboard
│   ├── tracking/     # Takip ekranları
│   ├── settings/     # Ayarlar
│   └── auth/         # Authentication
├── components/        # Yeniden kullanılabilir bileşenler
│   ├── ui/           # Base UI components
│   ├── forms/        # Form components
│   └── charts/       # Chart components
├── navigation/        # Navigation setup
├── store/            # Redux store configuration
├── services/         # API çağrıları ve push notification
├── hooks/            # Custom React hooks
├── utils/            # Yardımcı fonksiyonlar
├── types/            # TypeScript tip tanımları
└── assets/           # Resimler, fontlar, etc.
```

## 🚀 Kurulum ve Çalıştırma

### Ön Gereksinimler
```bash
# Node.js 18+
node --version

# React Native CLI
npm install -g @react-native-community/cli

# iOS için (macOS only)
npx pod-install ios

# Android için
# Android Studio ve SDK kurulu olmalı
```

### Geliştirme Sunucusunu Başlatma
```bash
# Dependencies yükle
npm install

# Environment variables ayarla
cp .env.example .env

# Metro bundler başlat
npm start

# Android emulator
npm run android

# iOS simulator (macOS)
npm run ios
```

## 📱 Ekran Yapısı ve Kod Örnekleri

### 1. App.tsx - Ana Uygulama
```typescript
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { OnboardingNavigator } from './navigation/OnboardingNavigator';
import { MainNavigator } from './navigation/MainNavigator';
import { AuthNavigator } from './navigation/AuthNavigator';
import { LoadingScreen } from './screens/LoadingScreen';
import { NotificationService } from './services/NotificationService';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    // Initialize push notifications
    NotificationService.getInstance().initialize();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <AuthProvider>
          <NotificationProvider>
            <NavigationContainer>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Auth" component={AuthNavigator} />
                <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
                <Stack.Screen name="Main" component={MainNavigator} />
              </Stack.Navigator>
            </NavigationContainer>
          </NotificationProvider>
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}
```

### 2. Onboarding Screen
```typescript
// src/screens/onboarding/BasicInfoScreen.tsx
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import { InputField, PrimaryButton, GenderSelector } from '@ai-fitness/ui-components';
import { useAppDispatch } from '../../store/hooks';
import { saveBasicInfo } from '../../store/slices/onboardingSlice';
import { apiService } from '../../services/ApiService';
import { BasicInfoFormData } from '../../types/onboarding';
import { styles } from './styles';

export const BasicInfoScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<BasicInfoFormData>();

  const saveBasicInfoMutation = useMutation({
    mutationFn: (data: BasicInfoFormData) => apiService.saveBasicInfo(data),
    onSuccess: (response) => {
      dispatch(saveBasicInfo({ userId: response.userId, ...data }));
      navigation.navigate('EatingHabits');
    },
    onError: (error) => {
      Alert.alert('Hata', 'Bilgiler kaydedilirken bir hata oluştu.');
    },
  });

  const onSubmit = (data: BasicInfoFormData) => {
    saveBasicInfoMutation.mutate(data);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Temel Bilgiler</Text>
        <Text style={styles.subtitle}>
          Senin için en uygun planı oluşturabilmemiz için birkaç bilgiye ihtiyacımız var.
        </Text>

        <Controller
          control={control}
          name="height"
          rules={{
            required: 'Boy bilgisi gereklidir',
            min: { value: 120, message: 'Geçerli bir boy girin' },
            max: { value: 250, message: 'Geçerli bir boy girin' }
          }}
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Boy (cm)"
              value={value}
              onChangeText={onChange}
              keyboardType="numeric"
              error={errors.height?.message}
              placeholder="Örn: 175"
            />
          )}
        />

        <Controller
          control={control}
          name="weight"
          rules={{
            required: 'Kilo bilgisi gereklidir',
            min: { value: 30, message: 'Geçerli bir kilo girin' },
            max: { value: 300, message: 'Geçerli bir kilo girin' }
          }}
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Kilo (kg)"
              value={value}
              onChangeText={onChange}
              keyboardType="numeric"
              error={errors.weight?.message}
              placeholder="Örn: 70"
            />
          )}
        />

        <Controller
          control={control}
          name="age"
          rules={{
            required: 'Yaş bilgisi gereklidir',
            min: { value: 16, message: 'En az 16 yaşında olmalısınız' },
            max: { value: 100, message: 'Geçerli bir yaş girin' }
          }}
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Yaş"
              value={value}
              onChangeText={onChange}
              keyboardType="numeric"
              error={errors.age?.message}
              placeholder="Örn: 25"
            />
          )}
        />

        <Controller
          control={control}
          name="gender"
          rules={{ required: 'Cinsiyet seçimi gereklidir' }}
          render={({ field: { onChange, value } }) => (
            <GenderSelector
              value={value}
              onChange={onChange}
              error={errors.gender?.message}
            />
          )}
        />

        <PrimaryButton
          title="Devam Et"
          onPress={handleSubmit(onSubmit)}
          loading={saveBasicInfoMutation.isPending}
          style={styles.continueButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
```

### 3. Push Notification Service
```typescript
// src/services/NotificationService.ts
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from './ApiService';
import { navigationRef } from '../navigation/NavigationContainer';

export class NotificationService {
  private static instance: NotificationService;

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize(): Promise<void> {
    try {
      // Request permission
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
        await this.setupNotificationHandlers();
        await this.getAndSaveToken();
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  }

  private async setupNotificationHandlers(): Promise<void> {
    // Foreground message handler
    messaging().onMessage(async remoteMessage => {
      console.log('Message handled in the foreground!', remoteMessage);
      this.showInAppNotification(remoteMessage);
    });

    // Background/Quit state message handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    // Notification opened app handler
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification opened app!', remoteMessage);
      this.handleNotificationOpen(remoteMessage);
    });

    // Check if app was opened from a notification
    const initialNotification = await messaging().getInitialNotification();
    if (initialNotification) {
      console.log('App opened from notification:', initialNotification);
      this.handleNotificationOpen(initialNotification);
    }
  }

  private async getAndSaveToken(): Promise<string | null> {
    try {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
      
      // Save token to AsyncStorage
      await AsyncStorage.setItem('fcm_token', token);
      
      // Send token to backend
      await this.registerTokenWithBackend(token);
      
      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  private async registerTokenWithBackend(token: string): Promise<void> {
    try {
      await apiService.post('/notifications/register-token', {
        token,
        platform: Platform.OS,
        appVersion: '1.0.0'
      });
    } catch (error) {
      console.error('Error registering token with backend:', error);
    }
  }

  private showInAppNotification(remoteMessage: any): void {
    // Show custom in-app notification toast
    const { notification } = remoteMessage;
    // Implementation for showing toast notification
  }

  private handleNotificationOpen(remoteMessage: any): void {
    const { data } = remoteMessage;
    
    switch (data?.type) {
      case 'plan_ready':
        navigationRef.navigate('PlanDetails', { planId: data.planId });
        break;
      case 'daily_reminder':
        navigationRef.navigate('Tracking');
        break;
      case 'achievement':
        navigationRef.navigate('Achievements');
        break;
      default:
        navigationRef.navigate('Dashboard');
        break;
    }
  }

  async subscribeToTopic(topic: string): Promise<void> {
    try {
      await messaging().subscribeToTopic(topic);
      console.log(`Subscribed to topic: ${topic}`);
    } catch (error) {
      console.error(`Error subscribing to topic ${topic}:`, error);
    }
  }

  async unsubscribeFromTopic(topic: string): Promise<void> {
    try {
      await messaging().unsubscribeFromTopic(topic);
      console.log(`Unsubscribed from topic: ${topic}`);
    } catch (error) {
      console.error(`Error unsubscribing from topic ${topic}:`, error);
    }
  }
}
```

## 🧪 Testing

```bash
# Unit testleri çalıştır
npm run test

# Coverage report
npm run test:coverage

# E2E testler (Detox)
npm run test:e2e
```

## 📱 Build & Release

```bash
# Android Release Build
cd android
./gradlew assembleRelease

# iOS Release Build
cd ios
xcodebuild -workspace AiFitnessCoach.xcworkspace -scheme AiFitnessCoach -configuration Release
```

## 🔧 Environment Configuration

```bash
# .env
API_BASE_URL=http://localhost:5000/api
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_PROJECT_ID=your_project_id
SENTRY_DSN=your_sentry_dsn
```

---

**Last Updated**: 2025-05-30