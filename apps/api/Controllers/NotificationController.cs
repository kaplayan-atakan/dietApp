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
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;
        private readonly ILogger<NotificationController> _logger;

        public NotificationController(INotificationService notificationService, ILogger<NotificationController> logger)
        {
            _notificationService = notificationService;
            _logger = logger;
        }

        // Device Management
        [HttpPost("devices/register")]
        public async Task<ActionResult> RegisterDevice([FromBody] RegisterDeviceRequest request)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var success = await _notificationService.RegisterDeviceAsync(userId, request.DeviceToken, request.Platform);
                if (success)
                {
                    return Ok(new { message = "Device registered successfully" });
                }

                return BadRequest(new { message = "Failed to register device" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to register device");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPost("devices/unregister")]
        public async Task<ActionResult> UnregisterDevice([FromBody] UnregisterDeviceRequest request)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var success = await _notificationService.UnregisterDeviceAsync(userId, request.DeviceToken);
                if (success)
                {
                    return Ok(new { message = "Device unregistered successfully" });
                }

                return BadRequest(new { message = "Failed to unregister device" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to unregister device");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("devices")]
        public async Task<ActionResult<List<UserDevice>>> GetUserDevices()
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var devices = await _notificationService.GetUserDevicesAsync(userId);
                return Ok(devices);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get user devices");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        // Notification Settings
        [HttpGet("settings")]
        public async Task<ActionResult<NotificationSettings>> GetNotificationSettings()
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var settings = await _notificationService.GetNotificationSettingsAsync(userId);
                return Ok(settings);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get notification settings");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPut("settings")]
        public async Task<ActionResult<NotificationSettings>> UpdateNotificationSettings([FromBody] UpdateNotificationSettingsRequest request)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var settings = await _notificationService.UpdateNotificationSettingsAsync(userId, request);
                return Ok(settings);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to update notification settings");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        // Scheduled Notifications
        [HttpPost("schedule/workout")]
        public async Task<ActionResult> ScheduleWorkoutReminder([FromBody] ScheduleWorkoutReminderRequest request)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var success = await _notificationService.ScheduleWorkoutReminderAsync(userId, request.ReminderTime, request.WorkoutName);
                if (success)
                {
                    return Ok(new { message = "Workout reminder scheduled successfully" });
                }

                return BadRequest(new { message = "Failed to schedule workout reminder" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to schedule workout reminder");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPost("schedule/meal")]
        public async Task<ActionResult> ScheduleMealReminder([FromBody] ScheduleMealReminderRequest request)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var success = await _notificationService.ScheduleMealReminderAsync(userId, request.ReminderTime, request.MealType);
                if (success)
                {
                    return Ok(new { message = "Meal reminder scheduled successfully" });
                }

                return BadRequest(new { message = "Failed to schedule meal reminder" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to schedule meal reminder");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPost("schedule/progress")]
        public async Task<ActionResult> ScheduleProgressReminder([FromBody] ScheduleProgressReminderRequest request)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var success = await _notificationService.ScheduleProgressReminderAsync(userId, request.ReminderTime);
                if (success)
                {
                    return Ok(new { message = "Progress reminder scheduled successfully" });
                }

                return BadRequest(new { message = "Failed to schedule progress reminder" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to schedule progress reminder");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpDelete("schedule/{notificationId}")]
        public async Task<ActionResult> CancelScheduledNotification(string notificationId)
        {
            try
            {
                var success = await _notificationService.CancelScheduledNotificationAsync(notificationId);
                if (success)
                {
                    return Ok(new { message = "Notification cancelled successfully" });
                }

                return NotFound(new { message = "Notification not found" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to cancel scheduled notification {NotificationId}", notificationId);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        // Notification History
        [HttpGet("history")]
        public async Task<ActionResult<List<NotificationHistory>>> GetNotificationHistory([FromQuery] int page = 1, [FromQuery] int limit = 20)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var history = await _notificationService.GetNotificationHistoryAsync(userId, page, limit);
                return Ok(history);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get notification history");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPut("history/{notificationId}/read")]
        public async Task<ActionResult> MarkNotificationAsRead(string notificationId)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var success = await _notificationService.MarkNotificationAsReadAsync(userId, notificationId);
                if (success)
                {
                    return Ok(new { message = "Notification marked as read" });
                }

                return NotFound(new { message = "Notification not found" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to mark notification as read");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPut("history/read-all")]
        public async Task<ActionResult> MarkAllNotificationsAsRead()
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var success = await _notificationService.MarkAllNotificationsAsReadAsync(userId);
                if (success)
                {
                    return Ok(new { message = "All notifications marked as read" });
                }

                return BadRequest(new { message = "Failed to mark notifications as read" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to mark all notifications as read");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("unread-count")]
        public async Task<ActionResult<int>> GetUnreadNotificationCount()
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var count = await _notificationService.GetUnreadNotificationCountAsync(userId);
                return Ok(count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get unread notification count");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        // Smart Notifications (Admin/System endpoints)
        [HttpPost("send")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> SendNotification([FromBody] SendNotificationRequest request)
        {
            try
            {
                var success = await _notificationService.SendPushNotificationAsync(
                    request.UserId, 
                    request.Title, 
                    request.Message, 
                    request.Data);

                if (success)
                {
                    return Ok(new { message = "Notification sent successfully" });
                }

                return BadRequest(new { message = "Failed to send notification" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send notification");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPost("send-bulk")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> SendBulkNotification([FromBody] SendBulkNotificationRequest request)
        {
            try
            {
                var success = await _notificationService.SendBulkNotificationAsync(
                    request.UserIds, 
                    request.Title, 
                    request.Message, 
                    request.Data);

                if (success)
                {
                    return Ok(new { message = "Bulk notification sent successfully" });
                }

                return BadRequest(new { message = "Failed to send bulk notification" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send bulk notification");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        // Templates
        [HttpGet("templates")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<NotificationTemplate>>> GetNotificationTemplates()
        {
            try
            {
                var templates = await _notificationService.GetNotificationTemplatesAsync();
                return Ok(templates);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get notification templates");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPost("templates")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<NotificationTemplate>> CreateNotificationTemplate([FromBody] CreateNotificationTemplateRequest request)
        {
            try
            {
                var template = await _notificationService.CreateNotificationTemplateAsync(request);
                return CreatedAtAction(nameof(GetNotificationTemplates), null, template);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create notification template");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        // Test endpoint for development
        [HttpPost("test")]
        public async Task<ActionResult> SendTestNotification([FromBody] TestNotificationRequest request)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var success = await _notificationService.SendPushNotificationAsync(
                    userId, 
                    request.Title ?? "Test Notification", 
                    request.Message ?? "This is a test notification from your AI Fitness Coach!");

                if (success)
                {
                    return Ok(new { message = "Test notification sent successfully" });
                }

                return BadRequest(new { message = "Failed to send test notification" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send test notification");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }
}
