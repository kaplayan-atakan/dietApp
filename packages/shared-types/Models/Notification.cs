using System.ComponentModel.DataAnnotations;

namespace AiFitnessCoach.Shared.Models
{    public class UserDevice
    {
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string DeviceToken { get; set; } = string.Empty;
        public string Platform { get; set; } = string.Empty; // ios, android, web
        public string DeviceName { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public DateTime RegisteredAt { get; set; }
        public DateTime LastUsed { get; set; }
        
        // Additional properties for API compatibility
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }public class NotificationSettings
    {
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public bool WorkoutReminders { get; set; } = true;
        public bool MealReminders { get; set; } = true;
        public bool ProgressReminders { get; set; } = true;
        public bool GoalDeadlines { get; set; } = true;
        public bool Achievements { get; set; } = true;
        public bool WeeklyReports { get; set; } = true;
        public TimeSpan? QuietTimeStart { get; set; }
        public TimeSpan? QuietTimeEnd { get; set; }
        public List<string> PreferredWorkoutTimes { get; set; } = new();
        public List<string> PreferredMealTimes { get; set; } = new();
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        
        // Additional properties for API compatibility
        public bool PushNotificationsEnabled { get; set; } = true;
        public bool WorkoutRemindersEnabled { get; set; } = true;
        public bool MealRemindersEnabled { get; set; } = true;
        public bool ProgressRemindersEnabled { get; set; } = true;
        public bool AchievementNotificationsEnabled { get; set; } = true;
        public bool WeeklyReportsEnabled { get; set; } = true;
        public TimeSpan? QuietHoursStart { get; set; }
        public TimeSpan? QuietHoursEnd { get; set; }
    }    public class NotificationHistory
    {
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public Dictionary<string, string>? Data { get; set; }
        public bool IsRead { get; set; } = false;
        public DateTime SentAt { get; set; }
        public DateTime? ReadAt { get; set; }
    }

    public class NotificationTemplate
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public Dictionary<string, object> Variables { get; set; } = new();
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }    public class ScheduledNotification
    {
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public DateTime ScheduledFor { get; set; }
        public bool IsSent { get; set; } = false;
        public DateTime? SentAt { get; set; }
        public Dictionary<string, string> Data { get; set; } = new();
        public DateTime CreatedAt { get; set; }
        
        // Additional properties for API compatibility
        public bool IsActive { get; set; } = true;
    }

    public class Notification
    {
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // push, email, in-app
        public string Category { get; set; } = string.Empty; // workout, nutrition, goal, achievement
        public Dictionary<string, object> Data { get; set; } = new();
        public bool IsRead { get; set; } = false;
        public bool IsSent { get; set; } = false;
        public DateTime? ScheduledFor { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? SentAt { get; set; }
        public DateTime? ReadAt { get; set; }
    }
}
