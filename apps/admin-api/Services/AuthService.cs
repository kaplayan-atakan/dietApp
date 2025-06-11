using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AdminApi.Models;

namespace AdminApi.Services
{
    public interface IAuthService
    {
        Task<string?> ValidateUserAsync(string username, string password);
        string GenerateJwtToken(User user);
    }

    public class AuthService : IAuthService
    {
        private readonly IConfiguration _configuration;

        public AuthService(IConfiguration configuration)
        {
            _configuration = configuration;
        }        public Task<string?> ValidateUserAsync(string username, string password)
        {
            // For this admin panel, we only allow the "arastas" user
            if (username != "arastas" || password != "arastas123")
            {
                return Task.FromResult<string?>(null);
            }

            // Create a mock user for token generation
            var user = new User
            {
                Id = 1,
                Username = "arastas",
                Email = "arastas@admin.com",
                Role = "Admin"
            };

            return Task.FromResult<string?>(GenerateJwtToken(user));
        }

        public string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT key not configured")));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("username", user.Username)
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(int.Parse(_configuration["Jwt:ExpiryMinutes"] ?? "60")),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
