using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using AiFitnessCoach.API.Data;
using System.Text;
using System.Text.Json;
using FluentAssertions;
using AiFitnessCoach.Shared.DTOs;

namespace AiFitnessCoach.API.Tests.Controllers;

public class AuthControllerTests : IClassFixture&lt;WebApplicationFactory&lt;Program&gt;&gt;
{
    private readonly WebApplicationFactory&lt;Program&gt; _factory;
    private readonly HttpClient _client;

    public AuthControllerTests(WebApplicationFactory&lt;Program&gt; factory)
    {
        _factory = factory.WithWebHostBuilder(builder =&gt;
        {
            builder.ConfigureServices(services =&gt;
            {
                // Remove the existing DbContext
                var descriptor = services.SingleOrDefault(
                    d =&gt; d.ServiceType == typeof(DbContextOptions&lt;AppDbContext&gt;));
                if (descriptor != null)
                {
                    services.Remove(descriptor);
                }

                // Add in-memory database for testing
                services.AddDbContext&lt;AppDbContext&gt;(options =&gt;
                {
                    options.UseInMemoryDatabase("TestDb");
                });
            });
        });
        
        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task Register_WithValidData_ShouldReturnSuccessResponse()
    {
        // Arrange
        var registerRequest = new RegisterRequest
        {
            Email = "test@example.com",
            Password = "TestPassword123!",
            FirstName = "Test",
            LastName = "User",
            DateOfBirth = new DateTime(1990, 1, 1),
            Gender = "Male",
            Height = 180,
            Weight = 75,
            ActivityLevel = "Moderate"
        };

        var json = JsonSerializer.Serialize(registerRequest);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/auth/register", content);

        // Assert
        response.IsSuccessStatusCode.Should().BeTrue();
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var authResponse = JsonSerializer.Deserialize&lt;AuthResponse&gt;(responseContent, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });
        
        authResponse.Should().NotBeNull();
        authResponse!.AccessToken.Should().NotBeEmpty();
    }

    [Fact]
    public async Task Login_WithValidCredentials_ShouldReturnSuccessResponse()
    {
        // Arrange - First register a user
        var registerRequest = new RegisterRequest
        {
            Email = "login@example.com",
            Password = "TestPassword123!",
            FirstName = "Login",
            LastName = "User",
            DateOfBirth = new DateTime(1990, 1, 1),
            Gender = "Male",
            Height = 180,
            Weight = 75,
            ActivityLevel = "Moderate"
        };

        var registerJson = JsonSerializer.Serialize(registerRequest);
        var registerContent = new StringContent(registerJson, Encoding.UTF8, "application/json");
        await _client.PostAsync("/api/auth/register", registerContent);

        // Now test login
        var loginRequest = new LoginRequest
        {
            Email = "login@example.com",
            Password = "TestPassword123!"
        };

        var loginJson = JsonSerializer.Serialize(loginRequest);
        var loginContent = new StringContent(loginJson, Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/auth/login", loginContent);

        // Assert
        response.IsSuccessStatusCode.Should().BeTrue();
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var authResponse = JsonSerializer.Deserialize&lt;AuthResponse&gt;(responseContent, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });
        
        authResponse.Should().NotBeNull();
        authResponse!.AccessToken.Should().NotBeEmpty();
    }

    [Fact]
    public async Task Login_WithInvalidCredentials_ShouldReturnUnauthorized()
    {
        // Arrange
        var loginRequest = new LoginRequest
        {
            Email = "invalid@example.com",
            Password = "WrongPassword"
        };

        var json = JsonSerializer.Serialize(loginRequest);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/auth/login", content);

        // Assert
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Register_WithInvalidEmail_ShouldReturnBadRequest()
    {
        // Arrange
        var registerRequest = new RegisterRequest
        {
            Email = "invalid-email",
            Password = "TestPassword123!",
            FirstName = "Test",
            LastName = "User",
            DateOfBirth = new DateTime(1990, 1, 1),
            Gender = "Male",
            Height = 180,
            Weight = 75,
            ActivityLevel = "Moderate"
        };

        var json = JsonSerializer.Serialize(registerRequest);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/auth/register", content);

        // Assert
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.BadRequest);
    }
}
