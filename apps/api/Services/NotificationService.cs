using Microsoft.EntityFrameworkCore;
using AiFitnessCoach.API.Data;
using AiFitnessCoach.Shared.Models;
using AiFitnessCoach.Shared.DTOs;

namespace AiFitnessCoach.API.Services
{
    public class NotificationService : INotificationService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<NotificationService> _logger;
        private readonly IConfiguration _configuration;

        public NotificationService(AppDbContext context, ILogger<NotificationService> logger, IConfiguration configuration)
        {
            _context = context;
            _logger = logger;
            _configuration = configuration;
        }        // Push Notifications
        public async Task<bool> SendPushNotificationAsync(string userId, string title, string message, Dictionary<string, string>? data = null)
        {
            try
            {
                var devices = await GetUserDevicesAsync(userId);
                var settings = await GetNotificationSettingsAsync(userId);

                if (!settings.PushNotificationsEnabled)
                {
                    _logger.LogInformation("Push notifications disabled for user {UserId}", userId);
                    return true;
                }

                // Log notification to history
                var notification = new NotificationHistory
                {
                    Id = Guid.NewGuid().ToString(),
                    UserId = userId,
                    Title = title,
                    Message = message,
                    Type = "push",
                    Data = data,
                    SentAt = DateTime.UtcNow,
                    IsRead = false
                };

                _context.NotificationHistory.Add(notification);
                await _context.SaveChangesAsync();

                // In a real implementation, you would integrate with FCM, APNS, etc.
                foreach (var device in devices)
                {
                    _logger.LogInformation("Sending push notification to device {DeviceToken} for user {UserId}", 
                        device.DeviceToken, userId);
                    
                    // Here you would call your push notification service
                    // await _pushNotificationProvider.SendAsync(device.DeviceToken, title, message, data);
                }

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send push notification to user {UserId}", userId);
                return false;
            }
        }

        public async Task<bool> SendBulkNotificationAsync(List<string> userIds, string title, string message, Dictionary<string, string>? data = null)
        {
            var tasks = userIds.Select(userId => SendPushNotificationAsync(userId, title, message, data));
            var results = await Task.WhenAll(tasks);
            return results.All(r => r);
        }

        // Device Management
        public async Task<bool> RegisterDeviceAsync(string userId, string deviceToken, string platform)
        {
            try
            {
                var existingDevice = await _context.UserDevices
                    .FirstOrDefaultAsync(ud => ud.UserId == userId && ud.DeviceToken == deviceToken);

                if (existingDevice != null)
                {
                    existingDevice.Platform = platform;
                    existingDevice.UpdatedAt = DateTime.UtcNow;
                    existingDevice.IsActive = true;
                }
                else
                {
                    var device = new UserDevice
                    {
                        Id = Guid.NewGuid().ToString(),
                        UserId = userId,
                        DeviceToken = deviceToken,
                        Platform = platform,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };

                    _context.UserDevices.Add(device);
                }

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to register device for user {UserId}", userId);
                return false;
            }
        }

        public async Task<bool> UnregisterDeviceAsync(string userId, string deviceToken)
        {
            try
            {
                var device = await _context.UserDevices
                    .FirstOrDefaultAsync(ud => ud.UserId == userId && ud.DeviceToken == deviceToken);

                if (device != null)
                {
                    device.IsActive = false;
                    device.UpdatedAt = DateTime.UtcNow;
                    await _context.SaveChangesAsync();
                }

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to unregister device for user {UserId}", userId);
                return false;
            }
        }

        public async Task<List<UserDevice>> GetUserDevicesAsync(string userId)
        {
            return await _context.UserDevices
                .Where(ud => ud.UserId == userId && ud.IsActive)
                .ToListAsync();
        }

        // Notification Preferences
        public async Task<NotificationSettings> GetNotificationSettingsAsync(string userId)
        {
            var settings = await _context.NotificationSettings
                .FirstOrDefaultAsync(ns => ns.UserId == userId);

            if (settings == null)
            {
                // Create default settings
                settings = new NotificationSettings
                {
                    Id = Guid.NewGuid().ToString(),
                    UserId = userId,
                    PushNotificationsEnabled = true,
                    WorkoutRemindersEnabled = true,
                    MealRemindersEnabled = true,
                    ProgressRemindersEnabled = true,
                    AchievementNotificationsEnabled = true,
                    WeeklyReportsEnabled = true,
                    QuietHoursStart = TimeSpan.FromHours(22), // 10 PM
                    QuietHoursEnd = TimeSpan.FromHours(7),    // 7 AM
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.NotificationSettings.Add(settings);
                await _context.SaveChangesAsync();
            }

            return settings;
        }

        public async Task<NotificationSettings> UpdateNotificationSettingsAsync(string userId, UpdateNotificationSettingsRequest request)
        {
            var settings = await GetNotificationSettingsAsync(userId);

            settings.PushNotificationsEnabled = request.PushNotificationsEnabled ?? settings.PushNotificationsEnabled;
            settings.WorkoutRemindersEnabled = request.WorkoutRemindersEnabled ?? settings.WorkoutRemindersEnabled;
            settings.MealRemindersEnabled = request.MealRemindersEnabled ?? settings.MealRemindersEnabled;
            settings.ProgressRemindersEnabled = request.ProgressRemindersEnabled ?? settings.ProgressRemindersEnabled;
            settings.AchievementNotificationsEnabled = request.AchievementNotificationsEnabled ?? settings.AchievementNotificationsEnabled;
            settings.WeeklyReportsEnabled = request.WeeklyReportsEnabled ?? settings.WeeklyReportsEnabled;
            settings.QuietHoursStart = request.QuietHoursStart ?? settings.QuietHoursStart;
            settings.QuietHoursEnd = request.QuietHoursEnd ?? settings.QuietHoursEnd;
            settings.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return settings;
        }

        // Scheduled Notifications
        public async Task<bool> ScheduleWorkoutReminderAsync(string userId, DateTime reminderTime, string workoutName)
        {
            var scheduledNotification = new ScheduledNotification
            {
                Id = Guid.NewGuid().ToString(),
                UserId = userId,
                Type = "workout_reminder",
                Title = "Workout Reminder",
                Message = $"Time for your {workoutName} workout!",
                ScheduledFor = reminderTime,
                Data = new Dictionary<string, string> { { "workoutName", workoutName } },
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.ScheduledNotifications.Add(scheduledNotification);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ScheduleMealReminderAsync(string userId, DateTime reminderTime, string mealType)
        {
            var scheduledNotification = new ScheduledNotification
            {
                Id = Guid.NewGuid().ToString(),
                UserId = userId,
                Type = "meal_reminder",
                Title = "Meal Reminder",
                Message = $"Don't forget to log your {mealType}!",
                ScheduledFor = reminderTime,
                Data = new Dictionary<string, string> { { "mealType", mealType } },
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.ScheduledNotifications.Add(scheduledNotification);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ScheduleProgressReminderAsync(string userId, DateTime reminderTime)
        {
            var scheduledNotification = new ScheduledNotification
            {
                Id = Guid.NewGuid().ToString(),
                UserId = userId,
                Type = "progress_reminder",
                Title = "Progress Check-in",
                Message = "Time to log your progress and measurements!",
                ScheduledFor = reminderTime,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.ScheduledNotifications.Add(scheduledNotification);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CancelScheduledNotificationAsync(string notificationId)
        {
            var notification = await _context.ScheduledNotifications.FindAsync(notificationId);
            if (notification != null)
            {
                notification.IsActive = false;
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }        // Smart Notifications
        public async Task ProcessDailyNotificationsAsync()
        {
            _logger.LogInformation("Processing daily notifications");

            // Get all users who should receive notifications
            var activeUsers = await _context.Users
                .Where(u => u.IsActive)
                .Select(u => u.Id)
                .ToListAsync();

            foreach (var userId in activeUsers)
            {
                var settings = await GetNotificationSettingsAsync(userId);
                if (!settings.PushNotificationsEnabled) continue;

                var now = DateTime.UtcNow;
                var today = now.Date;

                // Check for workout streak encouragement
                var lastWorkout = await _context.WorkoutLogs
                    .Where(wl => wl.UserId == userId && wl.CompletedAt.HasValue)
                    .OrderByDescending(wl => wl.CompletedAt)
                    .FirstOrDefaultAsync();                if (lastWorkout == null || (lastWorkout.CompletedAt?.Date < today.AddDays(-1)))
                {
                    await SendWorkoutEncouragementAsync(userId);
                }

                // Check for meal logging reminders
                var todayMealLogs = await _context.MealLogs
                    .Where(ml => ml.UserId == userId && ml.LoggedAt.Date == today)
                    .CountAsync();

                if (todayMealLogs == 0 && now.Hour >= 12) // After noon
                {
                    await SendPushNotificationAsync(userId, "Meal Logging", "Don't forget to log your meals today!");
                }
            }
        }

        public async Task SendWorkoutEncouragementAsync(string userId)
        {
            var messages = new[]
            {
                "Ready to crush your workout today?",
                "Your muscles are waiting for you!",
                "Let's keep that momentum going!",
                "Every workout counts towards your goals!"
            };

            var message = messages[new Random().Next(messages.Length)];
            await SendPushNotificationAsync(userId, "Workout Time!", message);
        }        public async Task SendProgressMilestoneAsync(string userId, string milestone)
        {
            await SendPushNotificationAsync(userId, "Achievement Unlocked!", $"Congratulations! {milestone}");
        }

        public async Task SendGoalReminderAsync(string userId, string goalId)
        {
            var goal = await _context.Goals.FindAsync(goalId);
            if (goal != null)
            {
                var daysRemaining = goal.TargetDate?.Subtract(DateTime.UtcNow).Days;
                var message = daysRemaining.HasValue 
                    ? $"Only {daysRemaining} days left to achieve your goal: {goal.Title}"
                    : $"Don't forget about your goal: {goal.Title}";

                await SendPushNotificationAsync(userId, "Goal Reminder", message);
            }
        }

        // Notification History
        public async Task<List<NotificationHistory>> GetNotificationHistoryAsync(string userId, int page = 1, int limit = 20)
        {
            return await _context.NotificationHistory
                .Where(nh => nh.UserId == userId)
                .OrderByDescending(nh => nh.SentAt)
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToListAsync();
        }

        public async Task<bool> MarkNotificationAsReadAsync(string userId, string notificationId)
        {
            var notification = await _context.NotificationHistory
                .FirstOrDefaultAsync(nh => nh.Id == notificationId && nh.UserId == userId);

            if (notification != null)
            {
                notification.IsRead = true;
                notification.ReadAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                return true;
            }

            return false;
        }

        public async Task<bool> MarkAllNotificationsAsReadAsync(string userId)
        {
            var unreadNotifications = await _context.NotificationHistory
                .Where(nh => nh.UserId == userId && !nh.IsRead)
                .ToListAsync();

            foreach (var notification in unreadNotifications)
            {
                notification.IsRead = true;
                notification.ReadAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<int> GetUnreadNotificationCountAsync(string userId)
        {
            return await _context.NotificationHistory
                .CountAsync(nh => nh.UserId == userId && !nh.IsRead);
        }

        // Templates and Personalization
        public async Task<string> GeneratePersonalizedMessageAsync(string userId, string templateType, Dictionary<string, object>? variables = null)
        {
            var user = await _context.Users.FindAsync(userId);
            var userName = user?.FirstName ?? "there";

            var templates = new Dictionary<string, string>
            {
                ["workout_motivation"] = $"Hey {userName}! Ready to crush your workout today? 💪",
                ["meal_reminder"] = $"{userName}, don't forget to log your meals to stay on track! 🍎",
                ["progress_celebration"] = $"Amazing work, {userName}! You're making great progress! 🎉",
                ["goal_encouragement"] = $"You're getting closer to your goal, {userName}! Keep it up! 🎯"
            };

            if (templates.TryGetValue(templateType, out var template))
            {
                // Simple variable replacement if provided
                if (variables != null)
                {
                    foreach (var variable in variables)
                    {
                        template = template.Replace($"{{{variable.Key}}}", variable.Value?.ToString());
                    }
                }
                return template;
            }

            return $"Hi {userName}! Keep up the great work!";
        }        public async Task<List<AiFitnessCoach.Shared.Models.NotificationTemplate>> GetNotificationTemplatesAsync()
        {
            var templates = await _context.NotificationTemplates
                .Where(nt => nt.IsActive)
                .OrderBy(nt => nt.Name)
                .ToListAsync();

            return templates.Select(t => new AiFitnessCoach.Shared.Models.NotificationTemplate
            {
                Id = t.Id,
                Name = t.Name,
                Type = t.Type,
                Title = t.Title,
                Message = t.Message,
                Variables = t.Variables,
                IsActive = t.IsActive,
                CreatedAt = t.CreatedAt,
                UpdatedAt = t.UpdatedAt
            }).ToList();
        }        public async Task<AiFitnessCoach.Shared.Models.NotificationTemplate> CreateNotificationTemplateAsync(CreateNotificationTemplateRequest request)
        {
            var template = new AiFitnessCoach.Shared.Models.NotificationTemplate
            {
                Id = Guid.NewGuid().ToString(),
                Name = request.Name ?? string.Empty,
                Type = request.Type ?? string.Empty,
                Title = request.Title ?? string.Empty,
                Message = request.Message ?? string.Empty,
                Variables = request.Variables ?? new Dictionary<string, object>(),
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };            _context.NotificationTemplates.Add(template);
            await _context.SaveChangesAsync();

            return template;
        }
    }
}
