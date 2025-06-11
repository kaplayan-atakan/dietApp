using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AdminApi.DTOs;
using AdminApi.Services;

namespace AdminApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
        {
            try
            {
                var token = await _authService.ValidateUserAsync(request.Username, request.Password);

                if (token == null)
                {
                    return Unauthorized(new { message = "Invalid username or password" });
                }

                var expiryMinutes = 60; // Default to 60 minutes
                var expiresAt = DateTime.UtcNow.AddMinutes(expiryMinutes);

                return Ok(new LoginResponse
                {
                    Token = token,
                    Username = request.Username,
                    Role = "Admin",
                    ExpiresAt = expiresAt
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred during login", error = ex.Message });
            }
        }

        [HttpPost("validate")]
        [Authorize]
        public ActionResult ValidateToken()
        {
            return Ok(new { message = "Token is valid", user = User.Identity?.Name });
        }
    }
}
