# 🔔 AI Fitness Coach - Notification Service

.NET Core 8.0 ile geliştirilmiş push notification servisi.

## 🛠️ Teknoloji Stack

- **.NET Core 8.0** - Web API framework
- **Firebase Cloud Messaging** - Push notifications
- **RabbitMQ** - Message queue
- **Redis** - Caching ve rate limiting
- **SignalR** - Real-time communication
- **Serilog** - Structured logging

## 📁 Proje Yapısı

```
AiFitnessCoach.NotificationService/
├── Controllers/          # API controllers
├── Services/            # Notification services
├── Models/              # Data models
├── Infrastructure/      # External integrations
├── Configuration/       # App configuration
├── Middleware/          # Custom middleware
└── Program.cs           # Application entry point
```

## 🚀 Kurulum ve Çalıştırma

```bash
# Dependencies restore
dotnet restore

# Firebase configuration
# firebase-admin-sdk.json dosyasını root'a yerleştir

# Development server başlat
dotnet run
```

## 🔧 Core Services

### 1. Firebase Notification Service
```csharp
// Services/FirebaseNotificationService.cs
using FirebaseAdmin;
using FirebaseAdmin.Messaging;
using Microsoft.Extensions.Logging;
using AiFitnessCoach.Shared.Models;

namespace AiFitnessCoach.NotificationService.Services;

public interface INotificationService
{
    Task<string> SendPushNotificationAsync(PushNotificationRequest request);
    Task<BatchResponse> SendBulkNotificationsAsync(BulkNotificationRequest request);
    Task<bool> SubscribeToTopicAsync(string token, string topic);
    Task<bool> UnsubscribeFromTopicAsync(string token, string topic);
    Task<bool> ValidateTokenAsync(string token);
}

public class FirebaseNotificationService : INotificationService
{
    private readonly FirebaseMessaging _messaging;
    private readonly ILogger<FirebaseNotificationService> _logger;
    private readonly IRedisService _redisService;

    public FirebaseNotificationService(
        ILogger<FirebaseNotificationService> logger,
        IRedisService redisService)
    {
        _logger = logger;
        _redisService = redisService;
        _messaging = FirebaseMessaging.DefaultInstance;
    }

    public async Task<string> SendPushNotificationAsync(PushNotificationRequest request)
    {
        try
        {
            // Check rate limiting
            var rateLimitKey = $"rate_limit:{request.DeviceToken}";
            var sentCount = await _redisService.GetAsync<int>(rateLimitKey);
            
            if (sentCount >= 100) // 100 notifications per hour limit
            {
                throw new InvalidOperationException("Rate limit exceeded");
            }

            var message = BuildMessage(request);
            var response = await _messaging.SendAsync(message);
            
            // Update rate limiting counter
            await _redisService.SetAsync(rateLimitKey, sentCount + 1, TimeSpan.FromHours(1));
            
            _logger.LogInformation("Push notification sent successfully. MessageId: {MessageId}", response);
            
            return response;
        }
        catch (FirebaseMessagingException ex)
        {
            _logger.LogError(ex, "Firebase error sending notification to {Token}: {ErrorCode}", 
                request.DeviceToken, ex.ErrorCode);
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending push notification to {Token}", request.DeviceToken);
            throw;
        }
    }

    public async Task<BatchResponse> SendBulkNotificationsAsync(BulkNotificationRequest request)
    {
        try
        {
            var messages = request.Tokens.Select(token => BuildMessage(new PushNot