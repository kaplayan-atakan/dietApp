using System.ComponentModel.DataAnnotations;

namespace AiFitnessCoach.Shared.DTOs
{
    // Base Notification DTO
    public class NotificationDto
    {
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // email, push, sms
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Recipient { get; set; } = string.Empty; // email address, device token, phone number
        public Dictionary<string, string>? Data { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ScheduledAt { get; set; }
        public bool IsRead { get; set; }
        public string Priority { get; set; } = "normal"; // low, normal, high
    }

    // Notification DTOs
    public class RegisterDeviceRequest
    {
        [Required]
        public string DeviceToken { get; set; } = string.Empty;

        [Required]
        public string Platform { get; set; } = string.Empty;

        [Required]
        public string DeviceName { get; set; } = string.Empty;
    }

    public class UnregisterDeviceRequest
    {
        [Required]
        public string DeviceToken { get; set; } = string.Empty;
    }    public class UpdateNotificationSettingsRequest
    {
        public bool? PushNotificationsEnabled { get; set; }
        public bool? WorkoutRemindersEnabled { get; set; }
        public bool? MealRemindersEnabled { get; set; }
        public bool? ProgressRemindersEnabled { get; set; }
        public bool? AchievementNotificationsEnabled { get; set; }
        public bool? WeeklyReportsEnabled { get; set; }
        public TimeSpan? QuietHoursStart { get; set; }
        public TimeSpan? QuietHoursEnd { get; set; }
        
        // Keep shared model compatible names too
        public bool? WorkoutReminders { get; set; }
        public bool? MealReminders { get; set; }
        public bool? ProgressReminders { get; set; }
        public bool? GoalDeadlines { get; set; }
        public bool? Achievements { get; set; }
        public bool? WeeklyReports { get; set; }
        public TimeSpan? QuietTimeStart { get; set; }
        public TimeSpan? QuietTimeEnd { get; set; }
        public List<string>? PreferredWorkoutTimes { get; set; }
        public List<string>? PreferredMealTimes { get; set; }
    }    public class ScheduleWorkoutReminderRequest
    {
        [Required]
        public DateTime ScheduledTime { get; set; }
        public DateTime ReminderTime { get; set; }

        [Required]
        [MaxLength(100)]
        public string WorkoutName { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Message { get; set; }
    }    public class ScheduleMealReminderRequest
    {
        [Required]
        public DateTime ScheduledTime { get; set; }
        public DateTime ReminderTime { get; set; }

        [Required]
        public string MealType { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Message { get; set; }
    }    public class ScheduleProgressReminderRequest
    {
        [Required]
        public DateTime ScheduledTime { get; set; }
        public DateTime ReminderTime { get; set; }

        [Required]
        [MaxLength(100)]
        public string ReminderType { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Message { get; set; }
    }    public class SendNotificationRequest
    {
        [Required]
        public string UserId { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string Message { get; set; } = string.Empty;

        public Dictionary<string, string>? Data { get; set; }
    }

    public class SendBulkNotificationRequest
    {
        [Required]
        public List<string> UserIds { get; set; } = new();

        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string Message { get; set; } = string.Empty;

        public Dictionary<string, string>? Data { get; set; }
    }

    public class CreateNotificationTemplateRequest
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Type { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string Message { get; set; } = string.Empty;

        public Dictionary<string, object>? Variables { get; set; }
    }

    public class TestNotificationRequest
    {
        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string Message { get; set; } = string.Empty;

        public Dictionary<string, string>? Data { get; set; }
    }
}
