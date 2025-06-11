using Microsoft.Extensions.Caching.Distributed;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;
using AiFitnessCoach.Shared.DTOs;

namespace AiFitnessCoach.QueueProcessor.Services;

public class QueueProcessorService : BackgroundService
{
    private readonly ILogger<QueueProcessorService> _logger;
    private readonly IDistributedCache _cache;
    private readonly IServiceProvider _serviceProvider;
    private readonly IConfiguration _configuration;
    private IConnection? _connection;
    private IModel? _channel;

    public QueueProcessorService(
        ILogger<QueueProcessorService> logger,
        IDistributedCache cache,
        IServiceProvider serviceProvider,
        IConfiguration configuration)
    {
        _logger = logger;
        _cache = cache;
        _serviceProvider = serviceProvider;
        _configuration = configuration;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Queue Processor Service starting...");

        try
        {
            InitializeRabbitMQ();
            
            while (!stoppingToken.IsCancellationRequested)
            {
                await Task.Delay(1000, stoppingToken);
                // Keep the service running
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in Queue Processor Service");
        }
    }    private void InitializeRabbitMQ()
    {
        try
        {
            var connectionString = _configuration["RabbitMQ:ConnectionString"];
            
            if (string.IsNullOrEmpty(connectionString))
            {
                _logger.LogWarning("RabbitMQ connection string not found in configuration. Using default localhost settings.");
                connectionString = "amqp://guest:guest@localhost:5672/";
            }            _logger.LogInformation("Connecting to RabbitMQ using connection string: {ConnectionString}", 
                connectionString.Contains("@") ? connectionString.Split('@')[1] : connectionString);

            var factory = new ConnectionFactory();
            factory.Uri = new Uri(connectionString);

            _connection = factory.CreateConnection();
            _channel = _connection.CreateModel();

            // Declare queues
            _channel.QueueDeclare(queue: "fitness_notifications", durable: true, exclusive: false, autoDelete: false, arguments: null);
            _channel.QueueDeclare(queue: "workout_processing", durable: true, exclusive: false, autoDelete: false, arguments: null);
            _channel.QueueDeclare(queue: "nutrition_analysis", durable: true, exclusive: false, autoDelete: false, arguments: null);

            _logger.LogInformation("RabbitMQ connection established and queues declared");
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Could not connect to RabbitMQ. Running in standalone mode.");
        }
    }

    public override void Dispose()
    {
        _channel?.Close();
        _connection?.Close();
        base.Dispose();
    }
}

public class NotificationQueueWorker : BackgroundService
{
    private readonly ILogger<NotificationQueueWorker> _logger;
    private readonly IHttpClientFactory _httpClientFactory;

    public NotificationQueueWorker(
        ILogger<NotificationQueueWorker> logger,
        IHttpClientFactory httpClientFactory)
    {
        _logger = logger;
        _httpClientFactory = httpClientFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Notification Queue Worker starting...");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                // Process notification queue
                await ProcessNotificationQueue();
                await Task.Delay(5000, stoppingToken); // Process every 5 seconds
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing notification queue");
                await Task.Delay(10000, stoppingToken); // Wait longer on error
            }
        }
    }

    private async Task ProcessNotificationQueue()
    {
        // Simulate processing notifications from queue
        _logger.LogDebug("Processing notification queue...");
        
        // In a real implementation, this would:
        // 1. Connect to message queue (RabbitMQ, Azure Service Bus, etc.)
        // 2. Process messages
        // 3. Send to notification service
        
        await Task.CompletedTask;
    }
}
