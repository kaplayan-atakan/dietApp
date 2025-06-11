using AiFitnessCoach.Shared.Models;
using AiFitnessCoach.Shared.DTOs;

namespace AiFitnessCoach.API.Services
{    public interface INotificationService
    {
        // Push Notifications
        Task<bool> SendPushNotificationAsync(string userId, string title, string message, Dictionary<string, string>? data = null);
        Task<bool> SendBulkNotificationAsync(List<string> userIds, string title, string message, Dictionary<string, string>? data = null);
        
        // Device Management
        Task<bool> RegisterDeviceAsync(string userId, string deviceToken, string platform);
        Task<bool> UnregisterDeviceAsync(string userId, string deviceToken);
        Task<List<UserDevice>> GetUserDevicesAsync(string userId);

        // Notification Preferences
        Task<NotificationSettings> GetNotificationSettingsAsync(string userId);
        Task<NotificationSettings> UpdateNotificationSettingsAsync(string userId, UpdateNotificationSettingsRequest request);

        // Scheduled Notifications
        Task<bool> ScheduleWorkoutReminderAsync(string userId, DateTime reminderTime, string workoutName);
        Task<bool> ScheduleMealReminderAsync(string userId, DateTime reminderTime, string mealType);
        Task<bool> ScheduleProgressReminderAsync(string userId, DateTime reminderTime);
        Task<bool> CancelScheduledNotificationAsync(string notificationId);        // Smart Notifications
        Task ProcessDailyNotificationsAsync();
        Task SendWorkoutEncouragementAsync(string userId);
        Task SendProgressMilestoneAsync(string userId, string milestone);
        Task SendGoalReminderAsync(string userId, string goalId);

        // Notification History
        Task<List<NotificationHistory>> GetNotificationHistoryAsync(string userId, int page = 1, int limit = 20);
        Task<bool> MarkNotificationAsReadAsync(string userId, string notificationId);
        Task<bool> MarkAllNotificationsAsReadAsync(string userId);
        Task<int> GetUnreadNotificationCountAsync(string userId);        // Templates and Personalization
        Task<string> GeneratePersonalizedMessageAsync(string userId, string templateType, Dictionary<string, object>? variables = null);
        Task<List<NotificationTemplate>> GetNotificationTemplatesAsync();
        Task<NotificationTemplate> CreateNotificationTemplateAsync(CreateNotificationTemplateRequest request);
    }
}
