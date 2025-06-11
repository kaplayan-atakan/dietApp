using AiFitnessCoach.QueueProcessor.Services;
using Serilog;
using Microsoft.Extensions.Caching.StackExchangeRedis;

var builder = Host.CreateApplicationBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/queue-processor-.log", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Logging.ClearProviders();
builder.Logging.AddSerilog();

// Redis Configuration
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("Redis") ?? "localhost:6379";
});

// Add HTTP client
builder.Services.AddHttpClient();

// Background Services
builder.Services.AddHostedService<QueueProcessorService>();
builder.Services.AddHostedService<NotificationQueueWorker>();

var host = builder.Build();

try
{
    Log.Information("Starting Queue Processor Service");
    await host.RunAsync();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Queue Processor Service terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
