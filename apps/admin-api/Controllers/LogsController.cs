using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AdminApi.DTOs;
using AdminApi.Services;

namespace AdminApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class LogsController : ControllerBase
    {
        private readonly ILogService _logService;

        public LogsController(ILogService logService)
        {
            _logService = logService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResponse<LogResponse>>> GetLogs([FromQuery] LogQueryRequest request)
        {
            try
            {
                var result = await _logService.GetLogsAsync(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching logs", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<LogResponse>> GetLog(int id)
        {
            try
            {
                var log = await _logService.GetLogByIdAsync(id);
                if (log == null)
                {
                    return NotFound(new { message = "Log not found" });
                }
                return Ok(log);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching the log", error = ex.Message });
            }
        }

        [HttpGet("summary")]
        public async Task<ActionResult<LogSummaryResponse>> GetLogSummary([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            try
            {
                var summary = await _logService.GetLogSummaryAsync(startDate, endDate);
                return Ok(summary);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching log summary", error = ex.Message });
            }
        }

        [HttpGet("components")]
        public async Task<ActionResult<List<string>>> GetComponents()
        {
            try
            {
                var components = await _logService.GetComponentsAsync();
                return Ok(components);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching components", error = ex.Message });
            }
        }        [HttpGet("levels")]
        public async Task<ActionResult<List<string>>> GetLogLevels()
        {
            try
            {
                var levels = await _logService.GetLogLevelsAsync();
                return Ok(levels);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching log levels", error = ex.Message });
            }
        }

        [HttpPost]
        [AllowAnonymous] // Allow client-side logging without admin authentication
        public async Task<ActionResult> CreateLogs([FromBody] BatchLogRequest request)
        {
            try
            {
                if (request.Logs == null || !request.Logs.Any())
                {
                    return BadRequest(new { message = "No logs provided" });
                }

                var result = await _logService.CreateLogsAsync(request.Logs);
                return Ok(new { message = "Logs created successfully", count = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating logs", error = ex.Message });
            }
        }
    }
}
