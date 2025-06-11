using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AiFitnessCoach.API.Services;
using AiFitnessCoach.Shared.Models;
using AiFitnessCoach.Shared.DTOs;

namespace AiFitnessCoach.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;
        private readonly ILogger<DashboardController> _logger;

        public DashboardController(IDashboardService dashboardService, ILogger<DashboardController> logger)
        {
            _dashboardService = dashboardService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<DashboardData>> GetDashboard()
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var dashboardData = await _dashboardService.GetDashboardDataAsync(userId);
                return Ok(dashboardData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get dashboard data for user");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("stats")]
        public async Task<ActionResult<UserStats>> GetStats([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            try
            {                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                // Provide default date range if not specified
                var actualStartDate = startDate ?? DateTime.Now.AddDays(-30);
                var actualEndDate = endDate ?? DateTime.Now;

                var stats = await _dashboardService.GetUserStatsAsync(userId, actualStartDate, actualEndDate);
                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get user stats");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("activities")]
        public async Task<ActionResult<List<UserActivity>>> GetRecentActivities([FromQuery] int limit = 10)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var activities = await _dashboardService.GetRecentActivitiesAsync(userId, limit);
                return Ok(activities);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get recent activities");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }
}
