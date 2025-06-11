# 🏋️‍♂️ AI-Based Diet & Fitness Coach - Comprehensive Platform

[![CI/CD Pipeline](https://github.com/kaplayan-atakan/ai-fitness-coach/workflows/CI/CD%20Pipeline/badge.svg)](https://github.com/kaplayan-atakan/ai-fitness-coach/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React Native](https://img.shields.io/badge/React%20Native-0.72-blue.svg)](https://reactnative.dev/)
[![.NET Core](https://img.shields.io/badge/.NET%20Core-8.0-purple.svg)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-18.0-blue.svg)](https://reactjs.org/)

> Yapay zeka destekli kişiselleştirilmiş beslenme ve egzersiz planları sunan tam kapsamlı platform

## 🎯 Proje Amacı

Bu proje, kullanıcıların temel verilerini, alışkanlıklarını ve hedeflerini analiz ederek AI ile kişiselleştirilmiş haftalık beslenme ve egzersiz planları oluşturan bir ekosistemdir. Ana hedefler:

- ✅ **Multi-platform Experience**: Mobile app, web app ve landing page
- ✅ **Real-time Communication**: Push notifications ve queue management
- ✅ **AI-Powered Recommendations**: LLM entegrasyonu ile kişiselleştirilmiş öneriler
- ✅ **Scalable Architecture**: Microservices ve event-driven yapı
- ✅ **High Performance**: Redis caching ve PostgreSQL optimizasyonu

## 🏗️ Genişletilmiş Monorepo Mimarisi

```
ai-fitness-coach/
├── 📱 apps/
│   ├── mobile/                 # React Native App (iOS/Android)
│   ├── web-app/               # React Web Application (PWA)
│   ├── landing-page/          # React Landing Page
│   ├── api/                   # .NET Core 8.0 Web API
│   ├── notification-service/  # .NET Core Push Notification Service
│   └── queue-processor/       # .NET Core Background Job Processor
├── 📦 packages/
│   ├── shared-types/          # Ortak TypeScript türleri
│   ├── ui-components/         # React/React Native ortak bileşenler
│   ├── api-client/           # API client SDK
│   ├── notification-client/   # Push notification client
│   └── utils/                 # Yardımcı fonksiyonlar
├── 🐳 infrastructure/
│   ├── docker/               # Docker Compose yapılandırmaları
│   ├── k8s/                  # Kubernetes manifests
│   ├── terraform/            # Infrastructure as Code
│   └── nginx/                # Load balancer configuration
├── 🔄 .github/workflows/     # CI/CD Pipeline tanımları
├── 📚 docs/                  # Proje dokümantasyonu
└── 🛠️ config files          # ESLint, Prettier, TypeScript configs
```

## 🛠️ Genişletilmiş Teknoloji Stack'i

### Frontend Applications
- **React Native 0.72** - Mobile app (iOS/Android)
- **React 18 + Next.js 14** - Web application (PWA)
- **React 18 + Vite** - Landing page (Static)
- **TypeScript** - Type safety across all apps
- **Tailwind CSS** - Consistent design system
- **Redux Toolkit** - Global state management
- **React Query** - Server state management

### Backend Services
- **.NET Core 8.0** - Main Web API
- **.NET Core 8.0** - Notification Service
- **.NET Core 8.0** - Queue Processor Service
- **PostgreSQL 15** - Primary database
- **Redis 7** - Caching, sessions, pub/sub
- **RabbitMQ 3** - Message broker ve queue management
- **SignalR** - Real-time communication
- **Firebase Cloud Messaging** - Push notifications
- **OpenAI API** - LLM integration via queue

### DevOps & Infrastructure
- **Docker & Docker Compose** - Containerization
- **GitHub Actions** - CI/CD pipeline
- **Kubernetes** - Container orchestration
- **NGINX** - Reverse proxy ve load balancing
- **Terraform** - Infrastructure as Code
- **Prometheus + Grafana** - Monitoring

## 🌐 Web Applications

### 1. Landing Page (marketing site)
```typescript
// apps/landing-page/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Testimonials } from './components/Testimonials';
import { Pricing } from './components/Pricing';
import { Footer } from './components/Footer';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Privacy } from './pages/Privacy';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header />
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <Features />
              <Testimonials />
              <Pricing />
            </>
          } />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
```

### 2. Web Application (PWA)
```typescript
// apps/web-app/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/auth/LoginPage';
import { OnboardingPage } from './pages/onboarding/OnboardingPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { TrackingPage } from './pages/tracking/TrackingPage';
import { SettingsPage } from './pages/settings/SettingsPage';

const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NotificationProvider>
            <Router>
              <div className="min-h-screen bg-gray-50">
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/onboarding" element={<OnboardingPage />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/tracking"
                    element={
                      <ProtectedRoute>
                        <TrackingPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <SettingsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/" element={<DashboardPage />} />
                </Routes>
              </div>
            </Router>
          </NotificationProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
```

## 🔔 Push Notification Service

### Notification Service (.NET Core)
```csharp
// apps/notification-service/Services/NotificationService.cs
using FirebaseAdmin;
using FirebaseAdmin.Messaging;
using Microsoft.Extensions.Logging;
using AiFitnessCoach.Shared.Models;
using AiFitnessCoach.NotificationService.Models;

namespace AiFitnessCoach.NotificationService.Services;

public interface INotificationService
{
    Task<string> SendPushNotificationAsync(PushNotificationRequest request);
    Task<string> SendBulkNotificationsAsync(BulkNotificationRequest request);
    Task<bool> SubscribeToTopicAsync(string token, string topic);
    Task<bool> UnsubscribeFromTopicAsync(string token, string topic);
}

public class FirebaseNotificationService : INotificationService
{
    private readonly FirebaseMessaging _messaging;
    private readonly ILogger<FirebaseNotificationService> _logger;

    public FirebaseNotificationService(ILogger<FirebaseNotificationService> logger)
    {
        _logger = logger;
        _messaging = FirebaseMessaging.DefaultInstance;
    }

    public async Task<string> SendPushNotificationAsync(PushNotificationRequest request)
    {
        try
        {
            var message = new Message()
            {
                Token = request.DeviceToken,
                Notification = new Notification
                {
                    Title = request.Title,
                    Body = request.Body,
                    ImageUrl = request.ImageUrl
                },
                Data = request.Data ?? new Dictionary<string, string>(),
                Android = new AndroidConfig
                {
                    Notification = new AndroidNotification
                    {
                        Icon = "ic_notification",
                        Color = "#00C896",
                        Sound = "default",
                        ChannelId = "ai_fitness_coach"
                    }
                },
                Apns = new ApnsConfig
                {
                    Aps = new Aps
                    {
                        Sound = "default",
                        Badge = request.Badge
                    }
                }
            };

            var response = await _messaging.SendAsync(message);
            _logger.LogInformation("Push notification sent successfully. MessageId: {MessageId}", response);
            
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending push notification to {Token}", request.DeviceToken);
            throw;
        }
    }

    public async Task<string> SendBulkNotificationsAsync(BulkNotificationRequest request)
    {
        try
        {
            var messages = request.Tokens.Select(token => new Message
            {
                Token = token,
                Notification = new Notification
                {
                    Title = request.Title,
                    Body = request.Body,
                    ImageUrl = request.ImageUrl
                },
                Data = request.Data ?? new Dictionary<string, string>()
            }).ToList();

            var response = await _messaging.SendAllAsync(messages);
            
            _logger.LogInformation("Bulk notifications sent. Success: {SuccessCount}, Failed: {FailureCount}", 
                response.SuccessCount, response.FailureCount);

            return $"Success: {response.SuccessCount}, Failed: {response.FailureCount}";
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending bulk notifications");
            throw;
        }
    }

    public async Task<bool> SubscribeToTopicAsync(string token, string topic)
    {
        try
        {
            await _messaging.SubscribeToTopicAsync(new[] { token }, topic);
            _logger.LogInformation("Token {Token} subscribed to topic {Topic}", token, topic);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error subscribing to topic {Topic}", topic);
            return false;
        }
    }

    public async Task<bool> UnsubscribeFromTopicAsync(string token, string topic)
    {
        try
        {
            await _messaging.UnsubscribeFromTopicAsync(new[] { token }, topic);
            _logger.LogInformation("Token {Token} unsubscribed from topic {Topic}", token, topic);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error unsubscribing from topic {Topic}", topic);
            return false;
        }
    }
}
```

## 🔄 Queue Management System

### Queue Processor Service
```csharp
// apps/queue-processor/Services/QueueProcessorService.cs
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using AiFitnessCoach.Shared.Models;

namespace AiFitnessCoach.QueueProcessor.Services;

public class QueueProcessorService : BackgroundService
{
    private readonly IConnection _connection;
    private readonly IModel _channel;
    private readonly ILogger<QueueProcessorService> _logger;
    private readonly IAIProcessingService _aiProcessingService;
    private readonly INotificationQueueService _notificationQueueService;

    public QueueProcessorService(
        IConnectionFactory connectionFactory,
        ILogger<QueueProcessorService> logger,
        IAIProcessingService aiProcessingService,
        INotificationQueueService notificationQueueService)
    {
        _logger = logger;
        _aiProcessingService = aiProcessingService;
        _notificationQueueService = notificationQueueService;
        
        _connection = connectionFactory.CreateConnection();
        _channel = _connection.CreateModel();
        
        SetupQueues();
    }

    private void SetupQueues()
    {
        // AI Processing Queue
        _channel.QueueDeclare(
            queue: "ai-processing",
            durable: true,
            exclusive: false,
            autoDelete: false,
            arguments: null);

        // Notification Queue
        _channel.QueueDeclare(
            queue: "push-notifications",
            durable: true,
            exclusive: false,
            autoDelete: false,
            arguments: null);

        // Dead Letter Queue
        _channel.QueueDeclare(
            queue: "dead-letter",
            durable: true,
            exclusive: false,
            autoDelete: false,
            arguments: null);

        // Set QoS
        _channel.BasicQos(prefetchSize: 0, prefetchCount: 1, global: false);
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // AI Processing Consumer
        var aiConsumer = new EventingBasicConsumer(_channel);
        aiConsumer.Received += async (model, ea) =>
        {
            await ProcessAIRequest(ea);
        };

        // Notification Consumer
        var notificationConsumer = new EventingBasicConsumer(_channel);
        notificationConsumer.Received += async (model, ea) =>
        {
            await ProcessNotificationRequest(ea);
        };

        _channel.BasicConsume(queue: "ai-processing", autoAck: false, consumer: aiConsumer);
        _channel.BasicConsume(queue: "push-notifications", autoAck: false, consumer: notificationConsumer);

        _logger.LogInformation("Queue processor started");

        while (!stoppingToken.IsCancellationRequested)
        {
            await Task.Delay(1000, stoppingToken);
        }
    }

    private async Task ProcessAIRequest(BasicDeliverEventArgs ea)
    {
        var body = ea.Body.ToArray();
        var message = Encoding.UTF8.GetString(body);

        try
        {
            var aiRequest = JsonSerializer.Deserialize<AIProcessingRequest>(message);
            _logger.LogInformation("Processing AI request for user {UserId}, type: {RequestType}", 
                aiRequest.UserId, aiRequest.RequestType);

            var result = await _aiProcessingService.ProcessRequest(aiRequest);

            // Send success notification
            await _notificationQueueService.QueueNotification(new PushNotificationRequest
            {
                DeviceToken = aiRequest.DeviceToken,
                Title = "Plan Hazır! 🎉",
                Body = "Kişiselleştirilmiş planın hazır. Hemen kontrol et!",
                Data = new Dictionary<string, string>
                {
                    ["type"] = "plan_ready",
                    ["planId"] = result.PlanId.ToString()
                }
            });

            _channel.BasicAck(deliveryTag: ea.DeliveryTag, multiple: false);
            _logger.LogInformation("AI request processed successfully for user {UserId}", aiRequest.UserId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing AI request: {Message}", message);
            
            // Send to dead letter queue after 3 retries
            if (ea.BasicProperties.Headers?["x-retry-count"] is byte[] retryCountBytes)
            {
                var retryCount = BitConverter.ToInt32(retryCountBytes, 0);
                if (retryCount >= 3)
                {
                    _channel.BasicPublish(exchange: "", routingKey: "dead-letter", body: body);
                    _channel.BasicAck(deliveryTag: ea.DeliveryTag, multiple: false);
                    return;
                }
            }

            _channel.BasicNack(deliveryTag: ea.DeliveryTag, multiple: false, requeue: true);
        }
    }

    private async Task ProcessNotificationRequest(BasicDeliverEventArgs ea)
    {
        var body = ea.Body.ToArray();
        var message = Encoding.UTF8.GetString(body);

        try
        {
            var notificationRequest = JsonSerializer.Deserialize<PushNotificationRequest>(message);
            _logger.LogInformation("Processing notification for device {Token}", notificationRequest.DeviceToken);

            await _notificationQueueService.SendNotification(notificationRequest);

            _channel.BasicAck(deliveryTag: ea.DeliveryTag, multiple: false);
            _logger.LogInformation("Notification sent successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing notification: {Message}", message);
            _channel.BasicNack(deliveryTag: ea.DeliveryTag, multiple: false, requeue: false);
        }
    }

    public override void Dispose()
    {
        _channel?.Close();
        _connection?.Close();
        base.Dispose();
    }
}
```

### AI Processing Service
```csharp
// apps/queue-processor/Services/AIProcessingService.cs
using OpenAI_API;
using OpenAI_API.Chat;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using AiFitnessCoach.Shared.Models;
using System.Text.Json;

namespace AiFitnessCoach.QueueProcessor.Services;

public interface IAIProcessingService
{
    Task<AIProcessingResult> ProcessRequest(AIProcessingRequest request);
}

public class AIProcessingService : IAIProcessingService
{
    private readonly OpenAIAPI _openAI;
    private readonly IDistributedCache _cache;
    private readonly ILogger<AIProcessingService> _logger;
    private readonly HttpClient _httpClient;

    public AIProcessingService(
        IConfiguration configuration,
        IDistributedCache cache,
        ILogger<AIProcessingService> logger,
        HttpClient httpClient)
    {
        _openAI = new OpenAIAPI(configuration["OpenAI:ApiKey"]);
        _cache = cache;
        _logger = logger;
        _httpClient = httpClient;
    }

    public async Task<AIProcessingResult> ProcessRequest(AIProcessingRequest request)
    {
        try
        {
            _logger.LogInformation("Starting AI processing for user {UserId}, type: {RequestType}", 
                request.UserId, request.RequestType);

            // Check cache first
            var cacheKey = $"ai_result_{request.UserId}_{request.RequestType}_{request.GetHashCode()}";
            var cachedResult = await _cache.GetStringAsync(cacheKey);
            
            if (cachedResult != null)
            {
                _logger.LogInformation("Returning cached AI result for user {UserId}", request.UserId);
                return JsonSerializer.Deserialize<AIProcessingResult>(cachedResult);
            }

            // Get user data from API
            var userData = await GetUserData(request.UserId);
            
            // Process with AI based on request type
            var result = request.RequestType switch
            {
                "nutrition_plan" => await GenerateNutritionPlan(userData),
                "workout_plan" => await GenerateWorkoutPlan(userData),
                "daily_recommendations" => await GenerateDailyRecommendations(userData),
                "progress_analysis" => await AnalyzeProgress(userData),
                _ => throw new ArgumentException($"Unknown request type: {request.RequestType}")
            };

            // Cache result for 1 hour
            var cacheOptions = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1)
            };
            await _cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(result), cacheOptions);

            _logger.LogInformation("AI processing completed for user {UserId}", request.UserId);
            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in AI processing for user {UserId}", request.UserId);
            throw;
        }
    }

    private async Task<UserData> GetUserData(Guid userId)
    {
        var response = await _httpClient.GetAsync($"/api/users/{userId}/complete-profile");
        response.EnsureSuccessStatusCode();
        
        var json = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<UserData>(json);
    }

    private async Task<AIProcessingResult> GenerateNutritionPlan(UserData userData)
    {
        var prompt = BuildNutritionPrompt(userData);
        
        var chatRequest = new ChatRequest()
        {
            Model = "gpt-4-turbo-preview",
            Messages = new[]
            {
                new ChatMessage(ChatMessageRole.System, "Sen uzman bir beslenme koçusun. JSON formatında beslenme planları oluşturuyorsun."),
                new ChatMessage(ChatMessageRole.User, prompt)
            },
            MaxTokens = 2000,
            Temperature = 0.7
        };

        var response = await _openAI.Chat.CreateChatCompletionAsync(chatRequest);
        var planJson = response.Choices[0].Message.Content;

        return new AIProcessingResult
        {
            PlanId = Guid.NewGuid(),
            Type = "nutrition_plan",
            Content = planJson,
            GeneratedAt = DateTime.UtcNow,
            UserId = userData.UserId
        };
    }

    private async Task<AIProcessingResult> GenerateWorkoutPlan(UserData userData)
    {
        var prompt = BuildWorkoutPrompt(userData);
        
        var chatRequest = new ChatRequest()
        {
            Model = "gpt-4-turbo-preview",
            Messages = new[]
            {
                new ChatMessage(ChatMessageRole.System, "Sen uzman bir fitness koçusun. JSON formatında egzersiz planları oluşturuyorsun."),
                new ChatMessage(ChatMessageRole.User, prompt)
            },
            MaxTokens = 2000,
            Temperature = 0.7
        };

        var response = await _openAI.Chat.CreateChatCompletionAsync(chatRequest);
        var planJson = response.Choices[0].Message.Content;

        return new AIProcessingResult
        {
            PlanId = Guid.NewGuid(),
            Type = "workout_plan",
            Content = planJson,
            GeneratedAt = DateTime.UtcNow,
            UserId = userData.UserId
        };
    }

    private async Task<AIProcessingResult> GenerateDailyRecommendations(UserData userData)
    {
        var prompt = $@"
        Kullanıcı profili:
        - Yaş: {userData.Profile.Age}
        - Kilo: {userData.Profile.Weight}kg
        - Boy: {userData.Profile.Height}cm
        - Hedef: {userData.Profile.Goals}
        - Son aktiviteler: {JsonSerializer.Serialize(userData.RecentActivities)}
        
        Bu kullanıcı için günlük öneriler (beslenme ve egzersiz) üret.
        JSON formatında dön: {{""recommendations"": [{{""type"": ""nutrition|exercise"", ""title"": """", ""description"": """", ""priority"": ""high|medium|low""}}]}}
        ";

        var chatRequest = new ChatRequest()
        {
            Model = "gpt-4-turbo-preview",
            Messages = new[]
            {
                new ChatMessage(ChatMessageRole.System, "Sen kişiselleştirilmiş günlük öneriler sunan bir AI koçusun."),
                new ChatMessage(ChatMessageRole.User, prompt)
            },
            MaxTokens = 1000,
            Temperature = 0.8
        };

        var response = await _openAI.Chat.CreateChatCompletionAsync(chatRequest);
        var recommendationsJson = response.Choices[0].Message.Content;

        return new AIProcessingResult
        {
            PlanId = Guid.NewGuid(),
            Type = "daily_recommendations",
            Content = recommendationsJson,
            GeneratedAt = DateTime.UtcNow,
            UserId = userData.UserId
        };
    }

    private string BuildNutritionPrompt(UserData userData)
    {
        return $@"
        Kullanıcı profili:
        - Yaş: {userData.Profile.Age}, Cinsiyet: {userData.Profile.Gender}
        - Kilo: {userData.Profile.Weight}kg, Boy: {userData.Profile.Height}cm
        - Aktivite seviyesi: {userData.Profile.ActivityLevel}
        - Hedefler: {userData.Profile.Goals}
        - Beslenme kısıtlamaları: {userData.Profile.DietaryRestrictions}
        - Bütçe: {userData.Profile.Budget} TL/hafta

        7 günlük detaylı beslenme planı oluştur. Her gün için:
        - Kahvaltı, öğle, akşam ve ara öğünler
        - Kalori hesaplamaları
        - Makro besin değerleri
        - Pratik tarifler
        - Malzeme listesi ve maliyet

        JSON formatında dön.
        ";
    }

    private string BuildWorkoutPrompt(UserData userData)
    {
        return $@"
        Kullanıcı profili:
        - Yaş: {userData.Profile.Age}, Cinsiyet: {userData.Profile.Gender}
        - Kilo: {userData.Profile.Weight}kg, Boy: {userData.Profile.Height}cm
        - Aktivite seviyesi: {userData.Profile.ActivityLevel}
        - Hedefler: {userData.Profile.Goals}
        - Sağlık durumu: {userData.Profile.HealthConditions}

        7 günlük egzersiz planı oluştur:
        - Günlük egzersizler (set, tekrar, süre)
        - Alternatif egzersizler
        - İlerleme önerileri
        - Dinlenme günleri
        - Video linkleri

        JSON formatında dön.
        ";
    }

    private async Task<AIProcessingResult> AnalyzeProgress(UserData userData)
    {
        // Progress analysis implementation
        // Bu method kullanıcının ilerleme verilerini analiz eder
        throw new NotImplementedException();
    }
}
```

## 📱 Mobile App Push Notification Integration

```typescript name=apps/mobile/src/services/NotificationService.ts
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from './ApiService';

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
      
      // Show in-app notification
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
    // Show custom in-app notification
    // This could be a toast, modal, or custom component
  }

  private handleNotificationOpen(remoteMessage: any): void {
    const { data } = remoteMessage;
    
    switch (data?.type) {
      case 'plan_ready':
        // Navigate to plan screen
        break;
      case 'daily_reminder':
        // Navigate to tracking screen
        break;
      case 'achievement':
        // Navigate to achievements screen
        break;
      default:
        // Navigate to dashboard
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

## 🌐 Web App PWA Configuration

```typescript name=apps/web-app/src/utils/notificationHelper.ts
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
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  async getSubscription(): Promise<PushSubscription | null> {
    if (!this.registration) return null;
    
    return await this.registration.pushManager.getSubscription();
  }

  async subscribe(): Promise<PushSubscription | null> {
    if (!this.registration) return null;

    const subscription = await this.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY
    });

    // Send subscription to backend
    await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription)
    });

    return subscription;
  }
}
```

## 🐳 Güncellenmiş Docker Compose

```yaml name=docker-compose.yml
version: '3.8'

services:
  # Databases
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ai_fitness_coach
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - ai-fitness-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - ai-fitness-network

  rabbitmq:
    image: rabbitmq:3-management-alpine
    environment:
      RABBITMQ_DEFAULT_USER: admin
      RABBITMQ_DEFAULT_PASS: password123
    ports:
      - "5672:5672"
      - "15672:15672"
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    networks:
      - ai-fitness-network

  # Backend Services
  api:
    build:
      context: .
      dockerfile: ./apps/api/Dockerfile
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - ConnectionStrings__DefaultConnection=Host=postgres;Database=ai_fitness_coach;Username=postgres;Password=password123
      - ConnectionStrings__Redis=redis:6379
      - RabbitMQ__Host=rabbitmq
    ports:
      - "5000:80"
    depends_on:
      - postgres
      - redis
      - rabbitmq
    networks:
      - ai-fitness-network

  notification-service:
    build:
      context: .
      dockerfile: ./apps/notification-service/Dockerfile
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - ConnectionStrings__Redis=redis:6379
      - RabbitMQ__Host=rabbitmq
      - Firebase__ProjectId=${FIREBASE_PROJECT_ID}
    depends_on:
      - redis
      - rabbitmq
    networks:
      - ai-fitness-network

  queue-processor:
    build:
      context: .
      dockerfile: ./apps/queue-processor/Dockerfile
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - ConnectionStrings__Redis=redis:6379
      - RabbitMQ__Host=rabbitmq
      - OpenAI__ApiKey=${OPENAI_API_KEY}
    depends_on:
      - redis
      - rabbitmq
      - api
    networks:
      - ai-fitness-network

  # Frontend Applications
  web-app:
    build:
      context: .
      dockerfile: ./apps/web-app/Dockerfile
    environment:
      - REACT_APP_API_URL=http://api:80
      - REACT_APP_VAPID_PUBLIC_KEY=${VAPID_PUBLIC_KEY}
    ports:
      - "3000:3000"
    depends_on:
      - api
    networks:
      - ai-fitness-network

  landing-page:
    build:
      context: .
      dockerfile: ./apps/landing-page/Dockerfile
    ports:
      - "3001:3000"
    networks:
      - ai-fitness-network

  # Load Balancer
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./infrastructure/nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./infrastructure/nginx/ssl:/etc/nginx/ssl
    depends_on:
      - api
      - web-app
      - landing-page
    networks:
      - ai-fitness-network

volumes:
  postgres_data:
  redis_data:
  rabbitmq_data:

networks:
  ai-fitness-network:
    driver: bridge
```

## 📊 Monitoring & Analytics

```yaml name=docker-compose.monitoring.yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./infrastructure/monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    networks:
      - ai-fitness-network

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3002:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin123
    volumes:
      - grafana_data:/var/lib/grafana
      - ./infrastructure/monitoring/grafana/dashboards:/etc/grafana/provisioning/dashboards
    networks:
      - ai-fitness-network

  jaeger:
    image: jaegertracing/all-in-one:latest
    ports:
      - "16686:16686"
    networks:
      - ai-fitness-network

volumes:
  prometheus_data:
  grafana_data:

networks:
  ai-fitness-network:
    external: true
```

## 🔄 Güncellenmiş CI/CD Pipeline

```yaml name=.github/workflows/ci-cd.yml
name: AI Fitness Coach CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Setup .NET
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '8.0.x'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: |
          npm run test:mobile
          npm run test:web-app
          npm run test:landing-page
          dotnet test apps/api/
          dotnet test apps/notification-service/
          dotnet test apps/queue-processor/
      
      - name: Lint and type check
        run: |
          npm run lint
          npm run type-check

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push'
    strategy:
      matrix:
        service: [api, notification-service, queue-processor, web-app, landing-page]
    steps:
      - uses: actions/checkout@v4
      
      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Build and push ${{ matrix.service }}
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./apps/${{ matrix.service }}/Dockerfile
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}/${{ matrix.service }}:${{ github.sha }}

  deploy-staging:
    needs: build-and-deploy
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment: staging
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to staging
        run: |
          echo "Deploying all services to staging..."
          # Kubernetes deployment commands

  deploy-production:
    needs: build-and-deploy
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to production
        run: |
          echo "Deploying all services to production..."
          # Production deployment commands
```

## 📋 GitHub Copilot Chat Kullanım Örnekleri

Visual Studio Code'da projeyi geliştirirken şu komutları kullanabilirsiniz:

```bash
# Yeni özellik geliştirme
@workspace /new Create a notification settings component for the web app

# Queue sistemi geliştirme
@workspace /explain How does the RabbitMQ queue system work with AI processing?

# Performance optimizasyonu
@workspace /fix Optimize the notification service for better performance

# Test yazma
@workspace /tests Generate unit tests for the queue processor service

# Dokümantasyon
@workspace /docs Create API documentation for the notification endpoints

# Web app PWA özellikleri
@workspace /new Add offline support to the web application

# Mobile app push notification
@workspace /fix Debug push notification issues in React Native app
```

## 🚀 Deployment Strategy

### Production Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │   API Gateway   │    │   Kubernetes    │
│     (NGINX)     │--->│   (Kong/Zuul)   │--->│     Cluster     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                       ┌────────────────────────────────┼────────────────────────────────┐
                       │                                │                                │
                ┌──────▼──────┐                 ┌──────▼──────┐                 ┌──────▼──────┐
                │   API Pod   │                 │  Web App    │                 │ Notification│
                │  (3 replicas)│                 │    Pod      │                 │ Service Pod │
                └─────────────┘                 └─────────────┘                 └─────────────┘
                       │                                │                                │
                ┌──────▼──────┐                 ┌──────▼──────┐                 ┌──────▼──────┐
                │ Queue Proc. │                 │Landing Page │                 │   Redis     │
                │     Pod     │                 │    Pod      │                 │   Cluster   │
                └─────────────┘                 └─────────────┘                 └─────────────┘
```

Bu comprehensive platform ile kullanıcılarınız:
- 📱 **Mobile app** ile hareket halindeyken takip yapabilir
- 💻 **Web app** ile detaylı analiz ve planlama yapabilir  
- 🌐 **Landing page** ile ürünü keşfedebilir
- 🔔 **Real-time notifications** ile motivasyon alabilir
- 🤖 **AI-powered recommendations** ile kişiselleştirilmiş deneyim yaşayabilir

---

**Created by**: [@kaplayan-atakan](https://github.com/kaplayan-atakan)  
**License**: MIT  
**Last Updated**: 2025-05-30