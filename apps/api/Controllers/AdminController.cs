using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using AiFitnessCoach.API.Data;
using AiFitnessCoach.API.Models;
using System.Text.Json;

namespace AiFitnessCoach.API.Controllers
{
    [ApiController]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<AdminController> _logger;

        public AdminController(AppDbContext context, ILogger<AdminController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Submit client-side logs from the web application
        /// </summary>
        [HttpPost("logs")]
        public async Task<IActionResult> SubmitLogs([FromBody] List<ClientLogDto> logs)
        {
            try
            {
                if (logs == null || !logs.Any())
                {
                    return BadRequest("No logs provided");
                }

                var clientLogs = logs.Select(dto => new ClientLog
                {
                    Timestamp = dto.Timestamp,
                    Level = dto.Level,
                    Message = dto.Message,
                    Component = dto.Component,
                    Action = dto.Action,
                    Context = dto.Context != null ? JsonSerializer.Serialize(dto.Context) : null,
                    UserAgent = dto.UserAgent,
                    Url = dto.Url,
                    UserId = dto.UserId,
                    SessionId = dto.SessionId,
                    IpAddress = GetClientIpAddress(),
                    StackTrace = dto.StackTrace,
                    CreatedAt = DateTime.UtcNow
                }).ToList();

                await _context.ClientLogs.AddRangeAsync(clientLogs);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Logs submitted successfully", count = logs.Count });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error submitting client logs");
                return StatusCode(500, "Error submitting logs");
            }
        }

        /// <summary>
        /// Get client logs with filtering and pagination
        /// </summary>
        [HttpGet("logs")]
        public async Task<IActionResult> GetLogs([FromQuery] LogQueryParams queryParams)
        {
            try
            {
                var query = _context.ClientLogs.AsQueryable();

                // Apply filters
                if (!string.IsNullOrEmpty(queryParams.Level))
                {
                    query = query.Where(l => l.Level == queryParams.Level);
                }

                if (!string.IsNullOrEmpty(queryParams.Component))
                {
                    query = query.Where(l => l.Component == queryParams.Component);
                }

                if (!string.IsNullOrEmpty(queryParams.UserId))
                {
                    query = query.Where(l => l.UserId == queryParams.UserId);
                }

                if (queryParams.StartDate.HasValue)
                {
                    query = query.Where(l => l.Timestamp >= queryParams.StartDate.Value);
                }

                if (queryParams.EndDate.HasValue)
                {
                    query = query.Where(l => l.Timestamp <= queryParams.EndDate.Value);
                }

                if (!string.IsNullOrEmpty(queryParams.Search))
                {
                    query = query.Where(l => l.Message.Contains(queryParams.Search) || 
                                           (l.Component != null && l.Component.Contains(queryParams.Search)));
                }

                // Get total count for pagination
                var totalCount = await query.CountAsync();

                // Apply pagination
                var logs = await query
                    .OrderByDescending(l => l.Timestamp)
                    .Skip((queryParams.Page - 1) * queryParams.PageSize)
                    .Take(queryParams.PageSize)
                    .ToListAsync();

                var result = new
                {
                    logs = logs.Select(l => new
                    {
                        l.Id,
                        l.Timestamp,
                        l.Level,
                        l.Message,
                        l.Component,
                        l.Action,
                        Context = !string.IsNullOrEmpty(l.Context) ? JsonSerializer.Deserialize<object>(l.Context) : null,
                        l.UserAgent,
                        l.Url,
                        l.UserId,
                        l.SessionId,
                        l.IpAddress,
                        l.StackTrace,
                        l.CreatedAt
                    }),
                    pagination = new
                    {
                        currentPage = queryParams.Page,
                        pageSize = queryParams.PageSize,
                        totalCount,
                        totalPages = (int)Math.Ceiling((double)totalCount / queryParams.PageSize)
                    }
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving client logs");
                return StatusCode(500, "Error retrieving logs");
            }
        }

        /// <summary>
        /// Get log statistics for dashboard
        /// </summary>
        [HttpGet("logs/stats")]
        public async Task<IActionResult> GetLogStats([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            try
            {
                var query = _context.ClientLogs.AsQueryable();

                // Apply date filters
                if (startDate.HasValue)
                {
                    query = query.Where(l => l.Timestamp >= startDate.Value);
                }

                if (endDate.HasValue)
                {
                    query = query.Where(l => l.Timestamp <= endDate.Value);
                }

                var stats = new LogStatsDto
                {
                    TotalLogs = await query.CountAsync(),
                    ErrorCount = await query.CountAsync(l => l.Level == "ERROR" || l.Level == "FATAL"),
                    WarnCount = await query.CountAsync(l => l.Level == "WARN"),
                    InfoCount = await query.CountAsync(l => l.Level == "INFO"),
                    DebugCount = await query.CountAsync(l => l.Level == "DEBUG"),
                    ComponentStats = await query
                        .Where(l => l.Component != null)
                        .GroupBy(l => l.Component)
                        .Select(g => new { Component = g.Key, Count = g.Count() })
                        .ToDictionaryAsync(x => x.Component!, x => x.Count),
                    HourlyStats = await query
                        .GroupBy(l => l.Timestamp.Hour)
                        .Select(g => new { Hour = g.Key, Count = g.Count() })
                        .ToDictionaryAsync(x => x.Hour.ToString(), x => x.Count)
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving log statistics");
                return StatusCode(500, "Error retrieving statistics");
            }
        }

        /// <summary>
        /// Delete old logs (cleanup)
        /// </summary>
        [HttpDelete("logs/cleanup")]
        public async Task<IActionResult> CleanupLogs([FromQuery] int daysOld = 30)
        {
            try
            {
                var cutoffDate = DateTime.UtcNow.AddDays(-daysOld);
                var logsToDelete = await _context.ClientLogs
                    .Where(l => l.CreatedAt < cutoffDate)
                    .ToListAsync();

                _context.ClientLogs.RemoveRange(logsToDelete);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Logs cleaned up successfully", deletedCount = logsToDelete.Count });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error cleaning up logs");
                return StatusCode(500, "Error cleaning up logs");
            }
        }

        private string GetClientIpAddress()
        {
            // Get client IP address from headers
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            
            // Check for forwarded IP in case of proxy/load balancer
            if (HttpContext.Request.Headers.ContainsKey("X-Forwarded-For"))
            {
                ipAddress = HttpContext.Request.Headers["X-Forwarded-For"].FirstOrDefault();
            }
            else if (HttpContext.Request.Headers.ContainsKey("X-Real-IP"))
            {
                ipAddress = HttpContext.Request.Headers["X-Real-IP"].FirstOrDefault();
            }

            return ipAddress ?? "Unknown";
        }
    }
}
