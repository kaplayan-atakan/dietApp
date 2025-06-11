using Microsoft.AspNetCore.Mvc;
using AiFitnessCoach.NotificationService.Services;
using AiFitnessCoach.Shared.DTOs;

namespace AiFitnessCoach.NotificationService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotificationController : ControllerBase
{
    private readonly INotificationService _notificationService;
    private readonly ILogger<NotificationController> _logger;

    public NotificationController(
        INotificationService notificationService,
        ILogger<NotificationController> logger)
    {
        _notificationService = notificationService;
        _logger = logger;
    }

    [HttpPost("send")]
    public async Task<IActionResult> SendNotification([FromBody] NotificationDto notification)
    {
        try
        {
            await _notificationService.SendNotificationAsync(notification);
            return Ok(new { message = "Notification sent successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send notification");
            return StatusCode(500, new { message = "Failed to send notification" });
        }
    }

    [HttpPost("send-bulk")]
    public async Task<IActionResult> SendBulkNotification([FromBody] IEnumerable<NotificationDto> notifications)
    {
        try
        {
            await _notificationService.SendBulkNotificationAsync(notifications);
            return Ok(new { message = "Bulk notifications sent successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send bulk notifications");
            return StatusCode(500, new { message = "Failed to send bulk notifications" });
        }
    }

    [HttpPost("schedule")]
    public async Task<IActionResult> ScheduleNotification([FromBody] ScheduleNotificationRequest request)
    {
        try
        {
            var result = await _notificationService.ScheduleNotificationAsync(request.Notification, request.ScheduledTime);
            return Ok(new { success = result, message = result ? "Notification scheduled successfully" : "Failed to schedule notification" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to schedule notification");
            return StatusCode(500, new { message = "Failed to schedule notification" });
        }
    }
}

public class ScheduleNotificationRequest
{
    public NotificationDto Notification { get; set; } = null!;
    public DateTime ScheduledTime { get; set; }
}
