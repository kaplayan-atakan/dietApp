using AiFitnessCoach.Shared.Models;
using AiFitnessCoach.Shared.DTOs;

namespace AiFitnessCoach.API.Services;

public interface IAuthService
{
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<bool> ValidateTokenAsync(string token);
    Task<User> GetUserByIdAsync(string userId);
    Task<bool> RefreshTokenAsync(string refreshToken);
    Task<bool> LogoutAsync(string userId);
    Task<bool> ChangePasswordAsync(string userId, ChangePasswordRequest request);
    Task<bool> ResetPasswordAsync(ResetPasswordRequest request);
}
