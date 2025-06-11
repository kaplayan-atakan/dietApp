# 🔧 AI Fitness Coach - Backend API

.NET Core 8.0 ile geliştirilmiş yüksek performanslı Web API servisi.

## 🛠️ Teknoloji Stack

- **.NET Core 8.0** - Web API framework
- **Entity Framework Core 8.0** - ORM
- **PostgreSQL 15** - Primary database
- **Redis 7** - Caching layer
- **RabbitMQ 3** - Message broker
- **OpenAI API** - AI integration
- **Swagger/OpenAPI** - API documentation
- **Serilog** - Structured logging
- **AutoMapper** - Object mapping
- **FluentValidation** - Input validation

## 📁 Proje Yapısı

```
AiFitnessCoach.API/
├── Controllers/          # API controllers
├── Models/              # Data models ve DTOs
├── Services/            # Business logic
├── Data/               # Entity Framework context
├── Infrastructure/     # External service integrations
├── Middleware/         # Custom middleware
├── Migrations/         # Database migrations
├── Configuration/      # App configuration
├── Validators/         # FluentValidation validators
├── Mappings/           # AutoMapper profiles
└── Program.cs          # Application entry point
```

## 🚀 Kurulum ve Çalıştırma

### Ön Gereksinimler
```bash
# .NET 8.0 SDK
dotnet --version

# Docker (PostgreSQL, Redis, RabbitMQ için)
docker --version
```

### Database Setup
```bash
# PostgreSQL container başlat
docker run --name postgres-ai-fitness \
  -e POSTGRES_DB=ai_fitness_coach \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password123 \
  -p 5432:5432 -d postgres:15-alpine

# Database migration
dotnet ef database update

# API'yi başlat
dotnet run
```

## 🏗️ Core Components

### 1. Program.cs - Application Startup
```csharp
using Microsoft.EntityFrameworkCore;
using AiFitnessCoach.API.Data;
using AiFitnessCoach.API.Services;
using AiFitnessCoach.API.Infrastructure;
using Serilog;
using FluentValidation;
using AutoMapper;

var builder = WebApplication.CreateBuilder(args);

// Serilog Configuration
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/api-.log", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "AI Fitness Coach API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new()
    {
        Description = "JWT Authorization header using the Bearer scheme.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
});

// Database Configuration
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Redis Configuration
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("Redis");
    options.InstanceName = "AiFitnessCoach";
});

// RabbitMQ Configuration
builder.Services.AddRabbitMQ(builder.Configuration);

// Authentication & Authorization
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

// Service Registration
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAIService, OpenAIService>();
builder.Services.AddScoped<INutritionPlanService, NutritionPlanService>();
builder.Services.AddScoped<IWorkoutPlanService, WorkoutPlanService>();
builder.Services.AddScoped<ITrackingService, TrackingService>();
builder.Services.AddScoped<IQueueService, RabbitMQService>();

// AutoMapper
builder.Services.AddAutoMapper(typeof(Program));

// FluentValidation
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// CORS Configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://aifitnesscoach.app")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Health Checks
builder.Services.AddHealthChecks()
    .AddDbContextCheck<ApplicationDbContext>()
    .AddRedis(builder.Configuration.GetConnectionString("Redis"))
    .AddRabbitMQ(builder.Configuration.GetConnectionString("RabbitMQ"));

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();

app.UseMiddleware<ErrorHandlingMiddleware>();
app.UseMiddleware<RequestLoggingMiddleware>();

app.MapControllers();
app.MapHealthChecks("/health");

app.Run();
```

### 2. Database Models
```csharp
// Models/User.cs
using System.ComponentModel.DataAnnotations;

namespace AiFitnessCoach.API.Models;

public class User
{
    public Guid Id { get; set; }
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation Properties
    public UserProfile? Profile { get; set; }
    public ICollection<NutritionPlan> NutritionPlans { get; set; } = new List<NutritionPlan>();
    public ICollection<WorkoutPlan> WorkoutPlans { get; set; } = new List<WorkoutPlan>();
    public ICollection<NutritionTracking> NutritionTrackings { get; set; } = new List<NutritionTracking>();
    public ICollection<WorkoutTracking> WorkoutTrackings { get; set; } = new List<WorkoutTracking>();
    public ICollection<NotificationToken> NotificationTokens { get; set; } = new List<NotificationToken>();
}

// Models/NotificationToken.cs
namespace AiFitnessCoach.API.Models;

public class NotificationToken
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Token { get; set; } = string.Empty;
    public string Platform { get; set; } = string.Empty; // "ios", "android", "web"
    public string AppVersion { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime LastUsedAt { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation Properties
    public User User { get; set; } = null!;
}
```

### 3. Queue Service Integration
```csharp
// Services/QueueService.cs
using RabbitMQ.Client;
using System.Text;
using System.Text.Json;
using AiFitnessCoach.Shared.Models;

namespace AiFitnessCoach.API.Services;

public interface IQueueService
{
    Task QueueAIProcessing(AIProcessingRequest request);
    Task QueueNotification(PushNotificationRequest request);
    Task QueueBulkNotifications(BulkNotificationRequest request);
}

public class RabbitMQService : IQueueService
{
    private readonly IConnection _connection;
    private readonly IModel _channel;
    private readonly ILogger<RabbitMQService> _logger;

    public RabbitMQService(IConnectionFactory connectionFactory, ILogger<RabbitMQService> logger)
    {
        _logger = logger;
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
    }

    public async Task QueueAIProcessing(AIProcessingRequest request)
    {
        try
        {
            var message = JsonSerializer.Serialize(request);
            var body = Encoding.UTF8.GetBytes(message);

            var properties = _channel.CreateBasicProperties();
            properties.Persistent = true;
            properties.MessageId = Guid.NewGuid().ToString();
            properties.Timestamp = new AmqpTimestamp(DateTimeOffset.UtcNow.ToUnixTimeSeconds());

            _channel.BasicPublish(
                exchange: "",
                routingKey: "ai-processing",
                basicProperties: properties,
                body: body);

            _logger.LogInformation("AI processing request queued for user {UserId}", request.UserId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error queuing AI processing request");
            throw;
        }
    }

    public async Task QueueNotification(PushNotificationRequest request)
    {
        try
        {
            var message = JsonSerializer.Serialize(request);
            var body = Encoding.UTF8.GetBytes(message);

            var properties = _channel.CreateBasicProperties();
            properties.Persistent = true;

            _channel.BasicPublish(
                exchange: "",
                routingKey: "push-notifications",
                basicProperties: properties,
                body: body);

            _logger.LogInformation("Notification queued for token {Token}", request.DeviceToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error queuing notification");
            throw;
        }
    }

    public async Task QueueBulkNotifications(BulkNotificationRequest request)
    {
        try
        {
            var message = JsonSerializer.Serialize(request);
            var body = Encoding.UTF8.GetBytes(message);

            var properties = _channel.CreateBasicProperties();
            properties.Persistent = true;

            _channel.BasicPublish(
                exchange: "",
                routingKey: "push-notifications",
                basicProperties: properties,
                body: body);

            _logger.LogInformation("Bulk notifications queued for {Count} tokens", request.Tokens.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error queuing bulk notifications");
            throw;
        }
    }

    public void Dispose()
    {
        _channel?.Close();
        _connection?.Close();
    }
}
```

### 4. Controllers
```csharp
// Controllers/OnboardingController.cs
using Microsoft.AspNetCore.Mvc;
using AiFitnessCoach.API.DTOs;
using AiFitnessCoach.API.Services;
using FluentValidation;

namespace AiFitnessCoach.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OnboardingController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IQueueService _queueService;
    private readonly ILogger<OnboardingController> _logger;
    private readonly IValidator<BasicInfoDto> _basicInfoValidator;

    public OnboardingController(
        IUserService userService,
        IQueueService queueService,
        ILogger<OnboardingController> logger,
        IValidator<BasicInfoDto> basicInfoValidator)
    {
        _userService = userService;
        _queueService = queueService;
        _logger = logger;
        _basicInfoValidator = basicInfoValidator;
    }

    [HttpPost("basic-info")]
    public async Task<IActionResult> SaveBasicInfo([FromBody] BasicInfoDto basicInfo)
    {
        try
        {
            // Validate input
            var validationResult = await _basicInfoValidator.ValidateAsync(basicInfo);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);
            }

            var userId = await _userService.CreateOrUpdateBasicInfo(basicInfo);
            
            _logger.LogInformation("Basic info saved successfully for user {UserId}", userId);
            
            return Ok(new { 
                UserId = userId, 
                Message = "Basic info saved successfully",
                NextStep = "eating-habits"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error saving basic info");
            return StatusCode(500, new { Error = "Internal server error" });
        }
    }

    [HttpPost("generate-plan")]
    public async Task<IActionResult> GeneratePlan([FromBody] GeneratePlanRequest request)
    {
        try
        {
            var user = await _userService.GetUserById(request.UserId);
            if (user == null)
            {
                return NotFound(new { Error = "User not found" });
            }

            // Queue AI processing instead of processing immediately
            var aiRequest = new AIProcessingRequest
            {
                UserId = request.UserId,
                RequestType = "complete_plan",
                DeviceToken = request.DeviceToken,
                Priority = "high",
                RequestedAt = DateTime.UtcNow
            };

            await _queueService.QueueAIProcessing(aiRequest);
            
            _logger.LogInformation("AI plan generation queued for user {UserId}", request.UserId);
            
            return Ok(new
            {
                Message = "Plan generation started",
                EstimatedTime = "2-3 minutes",
                Status = "processing"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error queuing plan generation for user {UserId}", request.UserId);
            return StatusCode(500, new { Error = "Failed to start plan generation" });
        }
    }
}

// Controllers/NotificationsController.cs
[ApiController]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IQueueService _queueService;
    private readonly ILogger<NotificationsController> _logger;

    public NotificationsController(
        IUserService userService,
        IQueueService queueService,
        ILogger<NotificationsController> logger)
    {
        _userService = userService;
        _queueService = queueService;
        _logger = logger;
    }

    [HttpPost("register-token")]
    public async Task<IActionResult> RegisterToken([FromBody] RegisterTokenRequest request)
    {
        try
        {
            await _userService.RegisterNotificationToken(request);
            return Ok(new { Message = "Token registered successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error registering notification token");
            return StatusCode(500, new { Error = "Failed to register token" });
        }
    }

    [HttpPost("send")]
    public async Task<IActionResult> SendNotification([FromBody] PushNotificationRequest request)
    {
        try
        {
            await _queueService.QueueNotification(request);
            return Ok(new { Message = "Notification queued successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error queuing notification");
            return StatusCode(500, new { Error = "Failed to queue notification" });
        }
    }

    [HttpPost("send-bulk")]
    public async Task<IActionResult> SendBulkNotifications([FromBody] BulkNotificationRequest request)
    {
        try
        {
            await _queueService.QueueBulkNotifications(request);
            return Ok(new { Message = $"Bulk notifications queued for {request.Tokens.Count} devices" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error queuing bulk notifications");
            return StatusCode(500, new { Error = "Failed to queue bulk notifications" });
        }
    }
}
```

## 🧪 Testing

```bash
# Unit testleri çalıştır
dotnet test

# Integration testler
dotnet test --filter Category=Integration

# Coverage report
dotnet test --collect:"XPlat Code Coverage"
```

## 📊 Monitoring & Logging

```csharp
// Middleware/RequestLoggingMiddleware.cs
public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;

    public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var stopwatch = Stopwatch.StartNew();
        
        _logger.LogInformation("Request started: {Method} {Path}", 
            context.Request.Method, context.Request.Path);

        await _next(context);

        stopwatch.Stop();
        
        _logger.LogInformation("Request completed: {Method} {Path} {StatusCode} in {ElapsedMs}ms",
            context.Request.Method, 
            context.Request.Path, 
            context.Response.StatusCode,
            stopwatch.ElapsedMilliseconds);
    }
}
```

---

**Last Updated**: 2025-05-30