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
    public class TrackingController : ControllerBase
    {
        private readonly ITrackingService _trackingService;
        private readonly ILogger<TrackingController> _logger;

        public TrackingController(ITrackingService trackingService, ILogger<TrackingController> logger)
        {
            _trackingService = trackingService;
            _logger = logger;
        }

        // Progress Logging
        [HttpPost("progress")]
        public async Task<ActionResult<ProgressLog>> LogProgress([FromBody] LogProgressRequest request)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var progressLog = await _trackingService.LogProgressAsync(userId, request);
                return CreatedAtAction(nameof(GetProgressLogs), null, progressLog);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to log progress");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("progress")]
        public async Task<ActionResult<List<ProgressLog>>> GetProgressLogs([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var progressLogs = await _trackingService.GetProgressLogsAsync(userId, startDate, endDate);
                return Ok(progressLogs);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get progress logs");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPut("progress/{logId}")]
        public async Task<ActionResult<ProgressLog>> UpdateProgressLog(string logId, [FromBody] UpdateProgressLogRequest request)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var progressLog = await _trackingService.UpdateProgressLogAsync(logId, userId, request);
                if (progressLog == null)
                {
                    return NotFound();
                }

                return Ok(progressLog);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to update progress log {LogId}", logId);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpDelete("progress/{logId}")]
        public async Task<ActionResult> DeleteProgressLog(string logId)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var deleted = await _trackingService.DeleteProgressLogAsync(logId, userId);
                if (!deleted)
                {
                    return NotFound();
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to delete progress log {LogId}", logId);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        // Goal Management
        [HttpGet("goals")]
        public async Task<ActionResult<List<Goal>>> GetGoals()
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var goals = await _trackingService.GetUserGoalsAsync(userId);
                return Ok(goals);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get goals for user");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPost("goals")]
        public async Task<ActionResult<Goal>> CreateGoal([FromBody] CreateGoalRequest request)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var goal = await _trackingService.CreateGoalAsync(userId, request);
                return CreatedAtAction(nameof(GetGoal), new { goalId = goal.Id }, goal);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create goal");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("goals/{goalId}")]
        public async Task<ActionResult<Goal>> GetGoal(string goalId)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var goal = await _trackingService.GetGoalAsync(goalId, userId);
                if (goal == null)
                {
                    return NotFound();
                }

                return Ok(goal);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get goal {GoalId}", goalId);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPut("goals/{goalId}")]
        public async Task<ActionResult<Goal>> UpdateGoal(string goalId, [FromBody] UpdateGoalRequest request)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var goal = await _trackingService.UpdateGoalAsync(goalId, userId, request);
                if (goal == null)
                {
                    return NotFound();
                }

                return Ok(goal);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to update goal {GoalId}", goalId);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpDelete("goals/{goalId}")]
        public async Task<ActionResult> DeleteGoal(string goalId)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var deleted = await _trackingService.DeleteGoalAsync(goalId, userId);
                if (!deleted)
                {
                    return NotFound();
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to delete goal {GoalId}", goalId);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        // Progress Analysis
        [HttpGet("summary")]
        public async Task<ActionResult<ProgressSummary>> GetProgressSummary()
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var summary = await _trackingService.GetProgressSummaryAsync(userId);
                return Ok(summary);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get progress summary");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("trends")]
        public async Task<ActionResult<List<ProgressTrend>>> GetProgressTrends(
            [FromQuery] string metricType, 
            [FromQuery] DateTime startDate, 
            [FromQuery] DateTime endDate)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var trends = await _trackingService.GetProgressTrendsAsync(userId, metricType, startDate, endDate);
                return Ok(trends);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get progress trends");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("goals/{goalId}/progress")]
        public async Task<ActionResult<GoalProgress>> GetGoalProgress(string goalId)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var progress = await _trackingService.GetGoalProgressAsync(goalId, userId);
                if (progress == null)
                {
                    return NotFound();
                }

                return Ok(progress);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get goal progress for {GoalId}", goalId);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("achievements")]
        public async Task<ActionResult<List<Achievement>>> GetAchievements()
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var achievements = await _trackingService.GetUserAchievementsAsync(userId);
                return Ok(achievements);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get achievements");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        // Body Metrics
        [HttpGet("body-metrics/latest")]
        public async Task<ActionResult<BodyMetrics>> GetLatestBodyMetrics()
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var metrics = await _trackingService.GetLatestBodyMetricsAsync(userId);
                if (metrics == null)
                {
                    return NotFound();
                }

                return Ok(metrics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get latest body metrics");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("body-metrics/history")]
        public async Task<ActionResult<List<BodyMetrics>>> GetBodyMetricsHistory([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var history = await _trackingService.GetBodyMetricsHistoryAsync(userId, startDate, endDate);
                return Ok(history);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get body metrics history");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPost("body-metrics")]
        public async Task<ActionResult<BodyMetrics>> LogBodyMetrics([FromBody] LogBodyMetricsRequest request)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var metrics = await _trackingService.LogBodyMetricsAsync(userId, request);
                return CreatedAtAction(nameof(GetLatestBodyMetrics), null, metrics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to log body metrics");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        // Streaks
        [HttpGet("streaks")]
        public async Task<ActionResult<List<Streak>>> GetActiveStreaks()
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var streaks = await _trackingService.GetActiveStreaksAsync(userId);
                return Ok(streaks);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get active streaks");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("streaks/workout")]
        public async Task<ActionResult<WorkoutStreak>> GetWorkoutStreak()
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var streak = await _trackingService.GetWorkoutStreakAsync(userId);
                return Ok(streak);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get workout streak");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("streaks/nutrition")]
        public async Task<ActionResult<NutritionStreak>> GetNutritionStreak()
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var streak = await _trackingService.GetNutritionStreakAsync(userId);
                return Ok(streak);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get nutrition streak");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        // Reports
        [HttpGet("reports/weekly")]
        public async Task<ActionResult<WeeklyReport>> GetWeeklyReport([FromQuery] DateTime weekStartDate)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var report = await _trackingService.GenerateWeeklyReportAsync(userId, weekStartDate);
                return Ok(report);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to generate weekly report");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("reports/monthly")]
        public async Task<ActionResult<MonthlyReport>> GetMonthlyReport([FromQuery] int year, [FromQuery] int month)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var report = await _trackingService.GenerateMonthlyReportAsync(userId, year, month);
                return Ok(report);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to generate monthly report");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("reports/comparison")]
        public async Task<ActionResult<ProgressComparison>> GetProgressComparison([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var comparison = await _trackingService.CompareProgressAsync(userId, startDate, endDate);
                return Ok(comparison);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to generate progress comparison");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPost("streaks/update")]
        public async Task<ActionResult> UpdateStreaks()
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                await _trackingService.UpdateStreaksAsync(userId);
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to update streaks");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }
}
