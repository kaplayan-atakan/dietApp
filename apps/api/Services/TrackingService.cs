using Microsoft.EntityFrameworkCore;
using AiFitnessCoach.API.Data;
using AiFitnessCoach.Shared.Models;
using AiFitnessCoach.Shared.DTOs;
using System.Text.Json;

namespace AiFitnessCoach.API.Services
{
    public class TrackingService : ITrackingService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<TrackingService> _logger;

        public TrackingService(AppDbContext context, ILogger<TrackingService> logger)
        {
            _context = context;
            _logger = logger;
        }

        // Progress Logging
        public async Task<ProgressLog> LogProgressAsync(string userId, LogProgressRequest request)
        {
            var progressLog = new ProgressLog
            {
                Id = Guid.NewGuid().ToString(),
                UserId = userId,
                Date = request.Date,
                Weight = request.Weight,
                BodyFatPercentage = request.BodyFatPercentage,
                MusclePercentage = request.MusclePercentage,
                Measurements = request.Measurements ?? new Dictionary<string, object>(),
                // Serialize photos to JSON string
                Photos = request.Photos != null ? JsonSerializer.Serialize(request.Photos) : null,
                Notes = request.Notes,
                CreatedAt = DateTime.UtcNow
            };

            _context.ProgressLogs.Add(progressLog);
            await _context.SaveChangesAsync();
            return progressLog;
        }

        public async Task<List<ProgressLog>> GetProgressLogsAsync(string userId, DateTime? startDate = null, DateTime? endDate = null)
        {
            var query = _context.ProgressLogs.Where(pl => pl.UserId == userId);

            if (startDate.HasValue)
                query = query.Where(pl => pl.Date >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(pl => pl.Date <= endDate.Value);

            return await query.OrderByDescending(pl => pl.Date).ToListAsync();
        }

        public async Task<ProgressLog?> UpdateProgressLogAsync(string logId, string userId, UpdateProgressLogRequest request)
        {
            var progressLog = await _context.ProgressLogs
                .FirstOrDefaultAsync(pl => pl.Id == logId && pl.UserId == userId);

            if (progressLog == null) return null;

            progressLog.Weight = request.Weight ?? progressLog.Weight;
            progressLog.BodyFatPercentage = request.BodyFatPercentage ?? progressLog.BodyFatPercentage;
            progressLog.MusclePercentage = request.MusclePercentage ?? progressLog.MusclePercentage;
            progressLog.Measurements = request.Measurements ?? progressLog.Measurements;
            progressLog.Notes = request.Notes ?? progressLog.Notes;
            // Only update photos if provided
            if (request.Photos != null)
            {
                progressLog.Photos = JsonSerializer.Serialize(request.Photos);
            }

            await _context.SaveChangesAsync();
            return progressLog;
        }

        public async Task<bool> DeleteProgressLogAsync(string logId, string userId)
        {
            var progressLog = await _context.ProgressLogs
                .FirstOrDefaultAsync(pl => pl.Id == logId && pl.UserId == userId);

            if (progressLog == null) return false;

            _context.ProgressLogs.Remove(progressLog);
            await _context.SaveChangesAsync();
            return true;
        }

        // Goal Management
        public async Task<List<Goal>> GetUserGoalsAsync(string userId)
        {
            return await _context.Goals
                .Where(g => g.UserId == userId)
                .OrderByDescending(g => g.CreatedAt)
                .ToListAsync();
        }

        public async Task<Goal> CreateGoalAsync(string userId, CreateGoalRequest request)
        {
            var goal = new Goal
            {
                Id = Guid.NewGuid().ToString(),
                UserId = userId,
                Title = request.Title,
                Description = request.Description,
                Category = request.Category,
                TargetValue = request.TargetValue,
                CurrentValue = 0,
                Unit = request.Unit,
                TargetDate = request.TargetDate,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Goals.Add(goal);
            await _context.SaveChangesAsync();
            return goal;
        }

        public async Task<Goal?> UpdateGoalAsync(string goalId, string userId, UpdateGoalRequest request)
        {
            var goal = await _context.Goals
                .FirstOrDefaultAsync(g => g.Id == goalId && g.UserId == userId);

            if (goal == null) return null;

            goal.Title = request.Title ?? goal.Title;
            goal.Description = request.Description ?? goal.Description;
            goal.TargetValue = request.TargetValue ?? goal.TargetValue;
            goal.CurrentValue = request.CurrentValue ?? goal.CurrentValue;
            goal.TargetDate = request.TargetDate ?? goal.TargetDate;
            goal.IsActive = request.IsActive ?? goal.IsActive;
            goal.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return goal;
        }

        public async Task<bool> DeleteGoalAsync(string goalId, string userId)
        {
            var goal = await _context.Goals
                .FirstOrDefaultAsync(g => g.Id == goalId && g.UserId == userId);

            if (goal == null) return false;

            _context.Goals.Remove(goal);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Goal?> GetGoalAsync(string goalId, string userId)
        {
            return await _context.Goals
                .FirstOrDefaultAsync(g => g.Id == goalId && g.UserId == userId);
        }

        // Progress Analysis
        public async Task<ProgressSummary> GetProgressSummaryAsync(string userId)
        {
            var recentLogs = await _context.ProgressLogs
                .Where(pl => pl.UserId == userId)
                .OrderByDescending(pl => pl.Date)
                .Take(30)
                .ToListAsync();

            var activeGoals = await _context.Goals
                .Where(g => g.UserId == userId && g.IsActive)
                .ToListAsync();

            var latestLog = recentLogs.FirstOrDefault();
            var previousLog = recentLogs.Skip(1).FirstOrDefault();

            decimal? weightChange = null;
            if (latestLog?.Weight != null && previousLog?.Weight != null)
            {
                weightChange = latestLog.Weight - previousLog.Weight;
            }

            return new ProgressSummary
            {
                CurrentWeight = latestLog?.Weight,
                WeightChange = weightChange,
                CurrentBodyFat = latestLog?.BodyFatPercentage,
                ActiveGoalsCount = activeGoals.Count,
                CompletedGoalsCount = await _context.Goals
                    .CountAsync(g => g.UserId == userId && !g.IsActive && g.CurrentValue >= g.TargetValue),
                LastLoggedDate = latestLog?.Date,
                TotalLogsCount = await _context.ProgressLogs.CountAsync(pl => pl.UserId == userId)
            };
        }

        public async Task<List<ProgressTrend>> GetProgressTrendsAsync(string userId, string metricType, DateTime startDate, DateTime endDate)
        {
            var logs = await _context.ProgressLogs
                .Where(pl => pl.UserId == userId && pl.Date >= startDate && pl.Date <= endDate)
                .OrderBy(pl => pl.Date)
                .ToListAsync();

            return logs.Select(log => new ProgressTrend
            {
                Date = log.Date,
                Value = metricType.ToLower() switch
                {
                    "weight" => log.Weight,
                    "bodyfat" => log.BodyFatPercentage,
                    "muscle" => log.MusclePercentage,
                    _ => null
                }
            }).Where(pt => pt.Value.HasValue).ToList();
        }

        public async Task<GoalProgress?> GetGoalProgressAsync(string goalId, string userId)
        {
            var goal = await GetGoalAsync(goalId, userId);
            if (goal == null) return null;

            var progressPercentage = goal.TargetValue > 0 ? (goal.CurrentValue / goal.TargetValue) * 100 : 0;
            var daysRemaining = goal.TargetDate.HasValue 
                ? Math.Max(0, (goal.TargetDate.Value - DateTime.UtcNow).Days)
                : 0;  // Default to 0 if no target date

            return new GoalProgress
            {
                GoalId = goal.Id,
                Title = goal.Title,
                CurrentValue = goal.CurrentValue,
                TargetValue = goal.TargetValue,
                ProgressPercentage = progressPercentage,
                DaysRemaining = daysRemaining,
                IsOnTrack = progressPercentage >= 70 || daysRemaining > 30,
                Category = goal.Category
            };
        }

        public async Task<List<Achievement>> GetUserAchievementsAsync(string userId)
        {
            var achievements = new List<Achievement>();
            
            // Weight loss achievements
            var firstLog = await _context.ProgressLogs
                .Where(pl => pl.UserId == userId && pl.Weight.HasValue)
                .OrderBy(pl => pl.Date)
                .FirstOrDefaultAsync();
            
            var latestLog = await _context.ProgressLogs
                .Where(pl => pl.UserId == userId && pl.Weight.HasValue)
                .OrderByDescending(pl => pl.Date)
                .FirstOrDefaultAsync();

            if (firstLog?.Weight != null && latestLog?.Weight != null)
            {
                var weightLoss = firstLog.Weight.Value - latestLog.Weight.Value;
                if (weightLoss >= 5)
                {
                    achievements.Add(new Achievement
                    {
                        Id = "weight_loss_5",
                        Title = "5 Pound Champion",
                        Description = "Lost 5 or more pounds",
                        IconUrl = "/icons/weight-loss.svg",
                        UnlockedAt = latestLog.Date,
                        Category = "weight_loss"
                    });
                }
            }

            // Workout consistency achievements
            var workoutCount = await _context.WorkoutLogs
                .CountAsync(wl => wl.UserId == userId && wl.CompletedAt.HasValue && wl.CompletedAt.Value >= DateTime.UtcNow.AddDays(-30));

            if (workoutCount >= 12)
            {
                achievements.Add(new Achievement
                {
                    Id = "workout_consistency",
                    Title = "Workout Warrior",
                    Description = "Completed 12+ workouts in 30 days",
                    IconUrl = "/icons/workout-warrior.svg",
                    UnlockedAt = DateTime.UtcNow,
                    Category = "workout"
                });
            }

            return achievements;
        }

        // Body Metrics
        public async Task<BodyMetrics?> GetLatestBodyMetricsAsync(string userId)
        {
            var latestLog = await _context.ProgressLogs
                .Where(pl => pl.UserId == userId)
                .OrderByDescending(pl => pl.Date)
                .FirstOrDefaultAsync();

            if (latestLog == null) return null;

            return new BodyMetrics
            {
                Weight = latestLog.Weight ?? 0, // Default to 0 if null
                BodyFatPercentage = latestLog.BodyFatPercentage,
                MusclePercentage = latestLog.MusclePercentage,
                Measurements = latestLog.Measurements,
                Date = latestLog.Date
            };
        }

        public async Task<List<BodyMetrics>> GetBodyMetricsHistoryAsync(string userId, DateTime? startDate = null, DateTime? endDate = null)
        {
            var query = _context.ProgressLogs.Where(pl => pl.UserId == userId);

            if (startDate.HasValue)
                query = query.Where(pl => pl.Date >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(pl => pl.Date <= endDate.Value);

            var logs = await query.OrderBy(pl => pl.Date).ToListAsync();

            return logs.Select(log => new BodyMetrics
            {
                Weight = log.Weight ?? 0, // Default to 0 if null
                BodyFatPercentage = log.BodyFatPercentage,
                MusclePercentage = log.MusclePercentage,
                Measurements = log.Measurements,
                Date = log.Date
            }).ToList();
        }

        public async Task<BodyMetrics> LogBodyMetricsAsync(string userId, LogBodyMetricsRequest request)
        {
            var progressLog = await LogProgressAsync(userId, new LogProgressRequest
            {
                Date = request.Date,
                Weight = request.Weight,
                BodyFatPercentage = request.BodyFatPercentage,
                MusclePercentage = request.MusclePercentage,
                Measurements = request.Measurements
            });

            return new BodyMetrics
            {
                Weight = progressLog.Weight ?? 0, // Default to 0 if null
                BodyFatPercentage = progressLog.BodyFatPercentage,
                MusclePercentage = progressLog.MusclePercentage,
                Measurements = progressLog.Measurements,
                Date = progressLog.Date
            };
        }

        // Streaks and Habits
        public async Task<List<Streak>> GetActiveStreaksAsync(string userId)
        {
            var streaks = new List<Streak>();

            var workoutStreak = await GetWorkoutStreakAsync(userId);
            if (workoutStreak.CurrentStreak > 0)
            {
                streaks.Add(new Streak
                {
                    Type = "workout",
                    CurrentCount = workoutStreak.CurrentStreak, 
                    CurrentStreak = workoutStreak.CurrentStreak, // Set both fields
                    BestCount = workoutStreak.LongestStreak,
                    LongestStreak = workoutStreak.LongestStreak, // Set both fields
                    LastActivity = workoutStreak.LastWorkoutDate,
                    LastActivityDate = workoutStreak.LastWorkoutDate // Set both fields
                });
            }

            var nutritionStreak = await GetNutritionStreakAsync(userId);
            if (nutritionStreak.CurrentStreak > 0)
            {
                streaks.Add(new Streak
                {
                    Type = "nutrition",
                    CurrentCount = nutritionStreak.CurrentStreak,
                    CurrentStreak = nutritionStreak.CurrentStreak, // Set both fields
                    BestCount = nutritionStreak.LongestStreak,
                    LongestStreak = nutritionStreak.LongestStreak, // Set both fields
                    LastActivity = nutritionStreak.LastLogDate,
                    LastActivityDate = nutritionStreak.LastLogDate // Set both fields
                });
            }

            return streaks;
        }

        public async Task<WorkoutStreak> GetWorkoutStreakAsync(string userId)
        {
            var recentWorkouts = await _context.WorkoutLogs
                .Where(wl => wl.UserId == userId && wl.CompletedAt.HasValue)
                .OrderByDescending(wl => wl.StartedAt)
                .Take(30)
                .Select(wl => wl.StartedAt.Date)
                .Distinct()
                .ToListAsync();

            var currentStreak = 0;
            var currentDate = DateTime.UtcNow.Date;

            foreach (var workoutDate in recentWorkouts)
            {
                if (workoutDate == currentDate || workoutDate == currentDate.AddDays(-1))
                {
                    currentStreak++;
                    currentDate = workoutDate.AddDays(-1);
                }
                else
                {
                    break;
                }
            }

            return new WorkoutStreak
            {
                CurrentStreak = currentStreak,
                LongestStreak = recentWorkouts.Count, // Simplified calculation
                LastWorkoutDate = recentWorkouts.FirstOrDefault()
            };
        }

        public async Task<NutritionStreak> GetNutritionStreakAsync(string userId)
        {
            var recentLogs = await _context.MealLogs
                .Where(ml => ml.UserId == userId)
                .OrderByDescending(ml => ml.LoggedAt)
                .Take(30)
                .Select(ml => ml.LoggedAt.Date)
                .Distinct()
                .ToListAsync();

            var currentStreak = 0;
            var currentDate = DateTime.UtcNow.Date;

            foreach (var logDate in recentLogs)
            {
                if (logDate == currentDate || logDate == currentDate.AddDays(-1))
                {
                    currentStreak++;
                    currentDate = logDate.AddDays(-1);
                }
                else
                {
                    break;
                }
            }

            return new NutritionStreak
            {
                CurrentStreak = currentStreak,
                LongestStreak = recentLogs.Count, // Simplified calculation
                LastLogDate = recentLogs.FirstOrDefault()
            };
        }

        public async Task UpdateStreaksAsync(string userId)
        {
            // This method would update streak calculations
            // Implementation depends on how streaks are stored
            _logger.LogInformation("Updating streaks for user {UserId}", userId);
            
            // Add at least one await operation to make this truly async
            await Task.CompletedTask;
        }

        // Reports
        public async Task<WeeklyReport> GenerateWeeklyReportAsync(string userId, DateTime weekStartDate)
        {
            var weekEndDate = weekStartDate.AddDays(7);

            var workouts = await _context.WorkoutLogs
                .Where(wl => wl.UserId == userId && wl.StartedAt >= weekStartDate && wl.StartedAt < weekEndDate)
                .ToListAsync();

            var mealLogs = await _context.MealLogs
                .Where(ml => ml.UserId == userId && ml.LoggedAt >= weekStartDate && ml.LoggedAt < weekEndDate)
                .ToListAsync();

            // Calculate total exercise minutes from Duration (int)
            int totalExerciseMinutes = workouts.Sum(w => w.Duration);
            
            // Calculate average daily calories from MealLogs
            decimal averageDailyCalories = 0;
            if (mealLogs.Any())
            {
                var dailyCalories = mealLogs
                    .GroupBy(ml => ml.LoggedAt.Date)
                    .Select(g => g.Sum(ml => ml.NutritionInfo?.Calories ?? 0));
                
                averageDailyCalories = dailyCalories.Any() ? 
                    dailyCalories.Average() : 0;
            }

            return new WeeklyReport
            {
                UserId = userId,
                WeekStartDate = weekStartDate,
                WeekEndDate = weekEndDate,
                WorkoutsCompleted = workouts.Count(w => w.CompletedAt.HasValue),
                TotalExerciseTime = TimeSpan.FromMinutes(totalExerciseMinutes),
                TotalExerciseMinutes = totalExerciseMinutes,
                AverageCaloriesPerDay = averageDailyCalories,
                AverageDailyCalories = averageDailyCalories,
                DaysWithMealLogs = mealLogs.Select(ml => ml.LoggedAt.Date).Distinct().Count(),
                TopExercises = workouts
                    .SelectMany(w => w.Exercises ?? new List<ExerciseLogItem>())
                    .GroupBy(e => e.ExerciseId)
                    .OrderByDescending(g => g.Count())
                    .Take(3)
                    .Select(g => g.First().Name) // Use the name instead of just the ID
                    .ToList()
            };
        }

        public async Task<MonthlyReport> GenerateMonthlyReportAsync(string userId, int year, int month)
        {
            var monthStart = new DateTime(year, month, 1);
            var monthEnd = monthStart.AddMonths(1);

            var progressLogs = await _context.ProgressLogs
                .Where(pl => pl.UserId == userId && pl.Date >= monthStart && pl.Date < monthEnd)
                .OrderBy(pl => pl.Date)
                .ToListAsync();

            var workouts = await _context.WorkoutLogs
                .Where(wl => wl.UserId == userId && wl.StartedAt >= monthStart && wl.StartedAt < monthEnd)
                .ToListAsync();

            var firstLog = progressLogs.FirstOrDefault();
            var lastLog = progressLogs.LastOrDefault();

            // Calculate total exercise minutes from Duration (int)
            int totalExerciseMinutes = workouts.Sum(w => w.Duration);
            
            // Calculate weight change
            decimal? weightChange = null;
            if (firstLog?.Weight != null && lastLog?.Weight != null)
            {
                weightChange = lastLog.Weight - firstLog.Weight;
            }

            // Calculate average workouts per week (4.0 -> 4.0M for decimal)
            decimal averageWorkoutsPerWeek = workouts.Count(w => w.CompletedAt.HasValue) / 4.0M;

            return new MonthlyReport
            {
                UserId = userId,
                Month = month,
                Year = year,
                WorkoutsCompleted = workouts.Count(w => w.CompletedAt.HasValue),
                TotalExerciseTime = TimeSpan.FromMinutes(totalExerciseMinutes),
                WeightChange = weightChange,
                ProgressLogsCount = progressLogs.Count,
                AverageWorkoutsPerWeek = averageWorkoutsPerWeek,
                GoalsAchieved = await _context.Goals
                    .CountAsync(g => g.UserId == userId && g.UpdatedAt >= monthStart && g.UpdatedAt < monthEnd && g.CurrentValue >= g.TargetValue)
            };
        }

        public async Task<ProgressComparison> CompareProgressAsync(string userId, DateTime startDate, DateTime endDate)
        {
            var startLog = await _context.ProgressLogs
                .Where(pl => pl.UserId == userId && pl.Date <= startDate)
                .OrderByDescending(pl => pl.Date)
                .FirstOrDefaultAsync();

            var endLog = await _context.ProgressLogs
                .Where(pl => pl.UserId == userId && pl.Date <= endDate)
                .OrderByDescending(pl => pl.Date)
                .FirstOrDefaultAsync();

            // Calculate weight change
            decimal? weightChange = null;
            if (startLog?.Weight != null && endLog?.Weight != null)
            {
                weightChange = endLog.Weight - startLog.Weight;
            }

            return new ProgressComparison
            {
                UserId = userId,
                StartDate = startDate,
                EndDate = endDate,
                WeightChange = weightChange,
                BodyFatChange = startLog?.BodyFatPercentage != null && endLog?.BodyFatPercentage != null 
                    ? endLog.BodyFatPercentage - startLog.BodyFatPercentage 
                    : null,
                MuscleChange = startLog?.MusclePercentage != null && endLog?.MusclePercentage != null 
                    ? endLog.MusclePercentage - startLog.MusclePercentage 
                    : null,
                Period = $"{(endDate - startDate).Days} days"
            };
        }
    }
}
