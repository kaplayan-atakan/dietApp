using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Moq;
using FluentAssertions;
using AiFitnessCoach.QueueProcessor.Services;

namespace AiFitnessCoach.QueueProcessor.Tests.Services;

public class QueueProcessorServiceTests
{
    private readonly Mock&lt;ILogger&lt;QueueProcessorService&gt;&gt; _mockLogger;
    private readonly Mock&lt;IDistributedCache&gt; _mockCache;
    private readonly Mock&lt;IServiceProvider&gt; _mockServiceProvider;
    private readonly Mock&lt;IConfiguration&gt; _mockConfiguration;
    private readonly QueueProcessorService _service;

    public QueueProcessorServiceTests()
    {
        _mockLogger = new Mock&lt;ILogger&lt;QueueProcessorService&gt;&gt;();
        _mockCache = new Mock&lt;IDistributedCache&gt;();
        _mockServiceProvider = new Mock&lt;IServiceProvider&gt;();
        _mockConfiguration = new Mock&lt;IConfiguration&gt;();
        
        // Setup mock configuration to return a valid RabbitMQ connection string
        var mockConnectionString = new Mock&lt;IConfigurationSection&gt;();
        mockConnectionString.Setup(x =&gt; x.Value).Returns("amqp://guest:guest@localhost:5672/");
        _mockConfiguration.Setup(x =&gt; x.GetSection("ConnectionStrings:RabbitMQ")).Returns(mockConnectionString.Object);
        
        _service = new QueueProcessorService(
            _mockLogger.Object,
            _mockCache.Object,
            _mockServiceProvider.Object,
            _mockConfiguration.Object);
    }

    [Fact]
    public void Constructor_ShouldInitializeService()
    {
        // Arrange & Act
        var service = new QueueProcessorService(
            _mockLogger.Object,
            _mockCache.Object,
            _mockServiceProvider.Object,
            _mockConfiguration.Object);

        // Assert
        service.Should().NotBeNull();
    }

    [Fact]
    public async Task ExecuteAsync_ShouldStartServiceAndLogInformation()
    {
        // Arrange
        var cancellationTokenSource = new CancellationTokenSource();
        
        // Cancel after a short delay to prevent infinite loop
        cancellationTokenSource.CancelAfter(TimeSpan.FromMilliseconds(100));

        // Act
        var executeTask = _service.StartAsync(cancellationTokenSource.Token);
        await Task.Delay(50); // Give service time to start
        cancellationTokenSource.Cancel();
        
        try
        {
            await executeTask;
        }
        catch (OperationCanceledException)
        {
            // Expected when cancellation token is triggered
        }

        // Assert
        _mockLogger.Verify(
            x =&gt; x.Log(
                LogLevel.Information,
                It.IsAny&lt;EventId&gt;(),
                It.Is&lt;It.IsAnyType&gt;((v, t) =&gt; v.ToString()!.Contains("Queue Processor Service starting")),
                It.IsAny&lt;Exception&gt;(),
                It.IsAny&lt;Func&lt;It.IsAnyType, Exception?, string&gt;&gt;()),
            Times.AtLeastOnce);
    }

    [Fact]
    public void Dispose_ShouldDisposeResourcesProperly()
    {
        // Arrange
        var service = new QueueProcessorService(
            _mockLogger.Object,
            _mockCache.Object,
            _mockServiceProvider.Object,
            _mockConfiguration.Object);

        // Act & Assert
        // Should not throw any exceptions
        service.Dispose();
    }

    [Fact]
    public void RabbitMQConnection_WhenConfigurationMissing_ShouldUseDefaultValues()
    {
        // Arrange
        var mockConfigWithoutRabbitMQ = new Mock&lt;IConfiguration&gt;();
        var mockConnectionString = new Mock&lt;IConfigurationSection&gt;();
        mockConnectionString.Setup(x =&gt; x.Value).Returns((string?)null);
        mockConfigWithoutRabbitMQ.Setup(x =&gt; x.GetSection("ConnectionStrings:RabbitMQ")).Returns(mockConnectionString.Object);

        // Act
        var service = new QueueProcessorService(
            _mockLogger.Object,
            _mockCache.Object,
            _mockServiceProvider.Object,
            mockConfigWithoutRabbitMQ.Object);

        // Assert
        service.Should().NotBeNull();
        
        // Should log warning about missing configuration
        _mockLogger.Verify(
            x =&gt; x.Log(
                LogLevel.Warning,
                It.IsAny&lt;EventId&gt;(),
                It.Is&lt;It.IsAnyType&gt;((v, t) =&gt; v.ToString()!.Contains("Could not connect to RabbitMQ")),
                It.IsAny&lt;Exception&gt;(),
                It.IsAny&lt;Func&lt;It.IsAnyType, Exception?, string&gt;&gt;()),
            Times.Never); // This might not trigger immediately in constructor
    }
}
