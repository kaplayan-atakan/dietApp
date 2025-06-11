using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using AiFitnessCoach.API.Data;
using AiFitnessCoach.Shared.Models;
using AiFitnessCoach.Shared.DTOs;
using BCrypt.Net;

namespace AiFitnessCoach.API.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthService> _logger;

    public AuthService(AppDbContext context, IConfiguration configuration, ILogger<AuthService> logger)
    {
        _context = context;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        try
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email.ToLower() == request.Email.ToLower());

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                throw new UnauthorizedAccessException("Invalid email or password");
            }            user.LastLoginDate = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var tokens = GenerateTokens(user);
            
            return new AuthResponse
            {
                AccessToken = tokens.AccessToken,
                RefreshToken = tokens.RefreshToken,
                User = MapToUserProfile(user),
                ExpiresAt = tokens.ExpiresAt
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login for user {Email}", request.Email);
            throw;
        }
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        try
        {
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email.ToLower() == request.Email.ToLower());

            if (existingUser != null)
            {
                throw new InvalidOperationException("User with this email already exists");
            }

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);            var user = new User
            {
                Id = Guid.NewGuid().ToString(),
                Email = request.Email.ToLower(),
                PasswordHash = hashedPassword,
                FirstName = request.FirstName,
                LastName = request.LastName,
                DateOfBirth = request.DateOfBirth,
                Gender = request.Gender,
                Height = request.Height,
                Weight = request.Weight,
                ActivityLevel = request.ActivityLevel,
                Goals = request.Goals,
                DietaryRestrictions = request.DietaryRestrictions,
                CreatedAt = DateTime.UtcNow,
                LastLoginDate = DateTime.UtcNow,
                IsEmailVerified = false,
                IsActive = true,
                UpdatedAt = DateTime.UtcNow
            };            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var tokens = GenerateTokens(user);
            
            return new AuthResponse
            {
                AccessToken = tokens.AccessToken,
                RefreshToken = tokens.RefreshToken,
                User = MapToUserProfile(user),
                ExpiresAt = tokens.ExpiresAt
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during registration for user {Email}", request.Email);
            throw;
        }
    }    public Task<bool> ValidateTokenAsync(string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT key not configured"));

            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = _configuration["Jwt:Issuer"],
                ValidateAudience = true,
                ValidAudience = _configuration["Jwt:Audience"],
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            return Task.FromResult(true);
        }
        catch
        {
            return Task.FromResult(false);
        }
    }

    public async Task<User> GetUserByIdAsync(string userId)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            throw new NotFoundException($"User with ID {userId} not found");
        }

        return user;
    }

    public async Task<bool> RefreshTokenAsync(string refreshToken)
    {
        // In a real implementation, you would store refresh tokens in the database
        // and validate them here. For now, we'll return true if the token is valid
        return await ValidateTokenAsync(refreshToken);
    }

    public async Task<bool> LogoutAsync(string userId)
    {
        try
        {
            // In a real implementation, you would invalidate the refresh token
            // For now, we'll just update the last logout time
            var user = await GetUserByIdAsync(userId);
            user.LastLoginDate = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during logout for user {UserId}", userId);
            return false;
        }
    }

    public async Task<bool> ChangePasswordAsync(string userId, ChangePasswordRequest request)
    {
        try
        {
            var user = await GetUserByIdAsync(userId);
            
            if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.Password))
            {
                throw new UnauthorizedAccessException("Current password is incorrect");
            }

            user.Password = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            await _context.SaveChangesAsync();
            
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error changing password for user {UserId}", userId);
            throw;
        }
    }

    public async Task<bool> ResetPasswordAsync(ResetPasswordRequest request)
    {
        try
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email.ToLower() == request.Email.ToLower());

            if (user == null)
            {
                // For security, don't reveal if the email exists
                return true;
            }

            // In a real implementation, you would:
            // 1. Generate a password reset token
            // 2. Store it in the database with expiration
            // 3. Send email with reset link
            // For now, we'll just log it
            _logger.LogInformation("Password reset requested for user {Email}", request.Email);
            
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during password reset for user {Email}", request.Email);
            return false;
        }
    }

    private (string AccessToken, string RefreshToken, DateTime ExpiresAt) GenerateTokens(User user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT key not configured"));
        
        var expiresAt = DateTime.UtcNow.AddHours(1);
        
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim("userId", user.Id)
            }),
            Expires = expiresAt,
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        var accessToken = tokenHandler.WriteToken(token);
        
        // For refresh token, create a longer-lived token
        var refreshTokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim("tokenType", "refresh")
            }),
            Expires = DateTime.UtcNow.AddDays(7),
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var refreshTokenObj = tokenHandler.CreateToken(refreshTokenDescriptor);
        var refreshToken = tokenHandler.WriteToken(refreshTokenObj);        return (accessToken, refreshToken, expiresAt);
    }

    private UserProfile MapToUserProfile(User user)
    {
        return new UserProfile
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            DateOfBirth = user.DateOfBirth,
            Gender = user.Gender,
            Height = user.Height,
            Weight = user.Weight,
            ActivityLevel = user.ActivityLevel,
            Goals = user.Goals,
            DietaryRestrictions = user.DietaryRestrictions,
            CreatedAt = user.CreatedAt
        };
    }
}

public class NotFoundException : Exception
{
    public NotFoundException(string message) : base(message) { }
}
