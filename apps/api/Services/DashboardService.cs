using Microsoft.EntityFrameworkCore;
using AiFitnessCoach.API.Data;
using AiFitnessCoach.Shared.Models; // Ensure this is present
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace AiFitnessCoach.API.Services;

public class DashboardService : IDashboardService
{
    private readonly AppDbContext _context;
    private readonly ILogger<DashboardService> _logger;

    public DashboardService(AppDbContext context, ILogger<DashboardService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<DashboardData> GetDashboardDataAsync(string userId)
    {
        try
        {
            var metrics = await GetMetricsAsync(userId);
            var activities = await GetRecentActivitiesAsync(userId);
            var goalProgress = await GetGoalProgressAsync(userId);
            var weeklyStats = await GetWeeklyStatsAsync(userId);

            return new DashboardData
            {
                UserId = userId,
                Metrics = metrics,
                RecentActivities = activities,
                GoalProgress = goalProgress,
                WeeklyStats = weeklyStats,
                ProgressSummary = new AiFitnessCoach.Shared.Models.ProgressSummary(), 
                Goals = new List<AiFitnessCoach.Shared.Models.GoalProgress>(), 
                RecentAchievements = new List<AiFitnessCoach.Shared.Models.Achievement>(), 
                UpcomingPlan = new AiFitnessCoach.Shared.Models.UpcomingPlan()
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting dashboard data for user {UserId}", userId);
            throw;
        }
    }

    public async Task<List<AiFitnessCoach.Shared.Models.DashboardMetric>> GetMetricsAsync(string userId)
    {
        try
        {
            var today = DateTime.UtcNow.Date;
            var weekAgo = today.AddDays(-7);
            var twoWeeksAgo = today.AddDays(-14);

            var currentWeekWorkouts = await _context.WorkoutLogs // Assuming WorkoutLogs are completed workouts
                .Where(w => w.UserId == userId && w.CompletedAt.HasValue && w.CompletedAt.Value.Date >= weekAgo)
                .CountAsync();

            var previousWeekWorkouts = await _context.WorkoutLogs
                .Where(w => w.UserId == userId && w.CompletedAt.HasValue && w.CompletedAt.Value.Date >= twoWeeksAgo && w.CompletedAt.Value.Date < weekAgo)
                .CountAsync();

            var currentWeekCalories = await _context.WorkoutLogs
                .Where(wl => wl.UserId == userId && wl.CompletedAt.HasValue && wl.Date.Date >= weekAgo) // WorkoutLog.Date is the date of the log
                .SumAsync(wl => wl.CaloriesBurned);

            var previousWeekCalories = await _context.WorkoutLogs
                .Where(wl => wl.UserId == userId && wl.CompletedAt.HasValue && wl.Date.Date >= twoWeeksAgo && wl.Date.Date < weekAgo)
                .SumAsync(wl => wl.CaloriesBurned);

            var latestWeight = await _context.ProgressLogs
                .Where(pl => pl.UserId == userId && pl.Weight.HasValue)
                .OrderByDescending(pl => pl.Date)
                .Select(pl => pl.Weight)
                .FirstOrDefaultAsync();

            var workoutChange = previousWeekWorkouts > 0 
                ? ((double)(currentWeekWorkouts - previousWeekWorkouts) / previousWeekWorkouts * 100).ToString("+0;-0;0") + "%"
                : currentWeekWorkouts > 0 ? "+100%" : "0%";
            var workoutChangeType = currentWeekWorkouts >= previousWeekWorkouts ? "positive" : "negative";

            var calorieChange = previousWeekCalories > 0 
                ? ((double)(currentWeekCalories - previousWeekCalories) / previousWeekCalories * 100).ToString("+0;-0;0") + "%"
                : currentWeekCalories > 0 ? "+100%" : "0%";
            var calorieChangeType = currentWeekCalories >= previousWeekCalories ? "positive" : "negative";

            return new List<AiFitnessCoach.Shared.Models.DashboardMetric>
            {
                new AiFitnessCoach.Shared.Models.DashboardMetric { Name = "Weekly Workouts", Value = currentWeekWorkouts.ToString(), Unit = "sessions", Change = workoutChange, ChangeType = workoutChangeType, Icon = "💪" },
                new AiFitnessCoach.Shared.Models.DashboardMetric { Name = "Calories Burned", Value = currentWeekCalories.ToString(), Unit = "kcal", Change = calorieChange, ChangeType = calorieChangeType, Icon = "🔥" },
                new AiFitnessCoach.Shared.Models.DashboardMetric { Name = "Current Weight", Value = latestWeight?.ToString("F1") ?? "N/A", Unit = "kg", Change = "0%", ChangeType = "neutral", Icon = "⚖️" },
                new AiFitnessCoach.Shared.Models.DashboardMetric { Name = "Active Days", Value = await GetActiveDaysThisWeek(userId), Unit = "days", Change = "0%", ChangeType = "neutral", Icon = "📅" }
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting metrics for user {UserId}", userId);
            return new List<AiFitnessCoach.Shared.Models.DashboardMetric>();
        }
    }

    public async Task<List<AiFitnessCoach.Shared.Models.RecentActivity>> GetRecentActivitiesAsync(string userId, int limit = 10)
    {
        try
        {
            var activities = new List<AiFitnessCoach.Shared.Models.RecentActivity>();

            var recentWorkouts = await _context.WorkoutLogs // Using WorkoutLogs as completed workouts
                .Where(w => w.UserId == userId && w.CompletedAt.HasValue)
                .OrderByDescending(w => w.CompletedAt)
                .Take(limit / 2)
                .Select(w => new AiFitnessCoach.Shared.Models.RecentActivity
                {
                    Id = w.Id.ToString(),
                    Type = "workout",
                    Title = w.Name,
                    Description = $"Completed {w.ExerciseCount} exercises",
                    Date = w.CompletedAt!.Value,
                    Icon = "💪"
                })
                .ToListAsync();
            activities.AddRange(recentWorkouts);

            var recentMeals = await _context.MealLogs
                .Where(ml => ml.UserId == userId)
                .OrderByDescending(ml => ml.LoggedAt)
                .Take(limit / 2)
                .Select(ml => new AiFitnessCoach.Shared.Models.RecentActivity
                {
                    Id = ml.Id.ToString(),
                    Type = "meal",
                    Title = $"{ml.MealType} logged",
                    Description = $"{ml.TotalCalories} calories",
                    Date = ml.LoggedAt,
                    Icon = "🍽️"
                })
                .ToListAsync();
            activities.AddRange(recentMeals);

            return activities.OrderByDescending(a => a.Date).Take(limit).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting recent activities for user {UserId}", userId);
            return new List<AiFitnessCoach.Shared.Models.RecentActivity>();
        }
    }

    public async Task<AiFitnessCoach.Shared.Models.GoalProgress> GetGoalProgressAsync(string userId)
    {
        try
        {
            var userGoalsData = await _context.UserGoals.FirstOrDefaultAsync(ug => ug.UserId == userId);
            
            var resultGoalProgress = new AiFitnessCoach.Shared.Models.GoalProgress
            {
                GoalId = userGoalsData?.Id.ToString() ?? Guid.NewGuid().ToString(),
                Title = "Overall Goal Progress",
                Goals = new List<AiFitnessCoach.Shared.Models.GoalItem>()
            };

            if (userGoalsData == null) return resultGoalProgress;

            if (userGoalsData.TargetWeight > 0)
            {
                var currentWeight = await _context.ProgressLogs
                    .Where(pl => pl.UserId == userId && pl.Weight.HasValue)
                    .OrderByDescending(pl => pl.Date)
                    .Select(pl => pl.Weight)
                    .FirstOrDefaultAsync();
                resultGoalProgress.Goals.Add(new AiFitnessCoach.Shared.Models.GoalItem
                {
                    Id = "weight", Name = "Weight Goal", 
                    CurrentValue = currentWeight ?? 0,
                    TargetValue = userGoalsData.TargetWeight,
                    Unit = "kg",
                    ProgressPercentage = userGoalsData.TargetWeight > 0 ? ((currentWeight ?? 0) / userGoalsData.TargetWeight) * 100 : 0
                });
            }

            if (userGoalsData.WeeklyWorkouts > 0)
            {
                var weekAgo = DateTime.UtcNow.Date.AddDays(-7);
                var currentWeekWorkouts = await _context.WorkoutLogs
                    .Where(w => w.UserId == userId && w.CompletedAt.HasValue && w.CompletedAt.Value.Date >= weekAgo)
                    .CountAsync();
                resultGoalProgress.Goals.Add(new AiFitnessCoach.Shared.Models.GoalItem
                {
                    Id = "workouts", Name = "Weekly Workouts", 
                    CurrentValue = currentWeekWorkouts,
                    TargetValue = userGoalsData.WeeklyWorkouts,
                    Unit = "sessions",
                    ProgressPercentage = userGoalsData.WeeklyWorkouts > 0 ? (currentWeekWorkouts / userGoalsData.WeeklyWorkouts) * 100 : 0
                });
            }

            if (userGoalsData.DailyCalories > 0)
            {
                var today = DateTime.UtcNow.Date;
                var todayCalories = await _context.MealLogs
                    .Where(ml => ml.UserId == userId && ml.LoggedAt.Date == today)
                    .SumAsync(ml => ml.TotalCalories);
                resultGoalProgress.Goals.Add(new AiFitnessCoach.Shared.Models.GoalItem
                {
                    Id = "calories", Name = "Daily Calories", 
                    CurrentValue = todayCalories,
                    TargetValue = userGoalsData.DailyCalories,
                    Unit = "kcal",
                    ProgressPercentage = userGoalsData.DailyCalories > 0 ? (todayCalories / userGoalsData.DailyCalories) * 100 : 0
                });
            }
            
            resultGoalProgress.OverallProgress = resultGoalProgress.Goals.Any() ? (double)resultGoalProgress.Goals.Average(g => g.ProgressPercentage) : 0;
            if (resultGoalProgress.Goals.Any()){
                 resultGoalProgress.ProgressPercentage = (decimal)resultGoalProgress.OverallProgress;
                 // Populate single CurrentValue/TargetValue if applicable, e.g., for the primary goal or average
                 // For now, let's assume the primary goal is weight if it exists
                 var weightGoalItem = resultGoalProgress.Goals.FirstOrDefault(g => g.Id == "weight");
                 if (weightGoalItem != null) {
                    resultGoalProgress.CurrentValue = weightGoalItem.CurrentValue;
                    resultGoalProgress.TargetValue = weightGoalItem.TargetValue;
                 }
            }

            return resultGoalProgress;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting goal progress for user {UserId}", userId);
            return new AiFitnessCoach.Shared.Models.GoalProgress { GoalId = Guid.NewGuid().ToString(), Title = "No Goals Set", Goals = new List<AiFitnessCoach.Shared.Models.GoalItem>(), OverallProgress = 0, ProgressPercentage = 0 };
        }
    }

    public async Task<AiFitnessCoach.Shared.Models.WeeklyStats> GetWeeklyStatsAsync(string userId)
    {
        try
        {
            var weekAgo = DateTime.UtcNow.Date.AddDays(-7);
            
            var workoutsCompleted = await _context.WorkoutLogs
                .Where(w => w.UserId == userId && w.CompletedAt.HasValue && w.CompletedAt.Value.Date >= weekAgo)
                .CountAsync();

            var totalCaloriesBurned = await _context.WorkoutLogs
                .Where(wl => wl.UserId == userId && wl.CompletedAt.HasValue && wl.Date.Date >= weekAgo)
                .SumAsync(wl => wl.CaloriesBurned);

            var activeMinutesSum = await _context.WorkoutLogs
                .Where(wl => wl.UserId == userId && wl.CompletedAt.HasValue && wl.Date.Date >= weekAgo)
                .SumAsync(wl => wl.Duration);
            var totalExerciseTime = TimeSpan.FromMinutes(activeMinutesSum);

            var mealsLogged = await _context.MealLogs
                .Where(ml => ml.UserId == userId && ml.LoggedAt.Date >= weekAgo)
                .CountAsync();

            var dailyBreakdown = new List<AiFitnessCoach.Shared.Models.DailyActivity>();
            for (int i = 6; i >= 0; i--)
            {
                var date = DateTime.UtcNow.Date.AddDays(-i);
                var dayWorkoutsCount = await _context.WorkoutLogs
                    .CountAsync(w => w.UserId == userId && w.CompletedAt.HasValue && w.CompletedAt.Value.Date == date);
                var dayWorkoutCompleted = dayWorkoutsCount > 0;

                var dayMealsLoggedCount = await _context.MealLogs
                    .AnyAsync(ml => ml.UserId == userId && ml.LoggedAt.Date == date);
                
                var dayCaloriesConsumed = await _context.MealLogs
                    .Where(ml => ml.UserId == userId && ml.LoggedAt.Date == date)
                    .SumAsync(ml => ml.TotalCalories);

                var dayExerciseMinutes = await _context.WorkoutLogs
                    .Where(wl => wl.UserId == userId && wl.CompletedAt.HasValue && wl.Date.Date == date)
                    .SumAsync(wl => wl.Duration);

                var dayCaloriesBurned = await _context.WorkoutLogs
                    .Where(wl => wl.UserId == userId && wl.CompletedAt.HasValue && wl.Date.Date == date)
                    .SumAsync(wl => wl.CaloriesBurned);

                dailyBreakdown.Add(new AiFitnessCoach.Shared.Models.DailyActivity
                {
                    Date = date,
                    WorkoutCompleted = dayWorkoutCompleted,
                    Workouts = dayWorkoutsCount, // From shared model update
                    MealsLogged = dayMealsLoggedCount,
                    CaloriesConsumed = dayCaloriesConsumed,
                    ExerciseMinutes = dayExerciseMinutes,
                    CaloriesBurned = dayCaloriesBurned, // From shared model update
                    ActiveMinutes = dayExerciseMinutes // From shared model update
                });
            }
            
            var activeDays = dailyBreakdown.Count(d => d.WorkoutCompleted || d.MealsLogged);
            var averageCaloriesConsumed = dailyBreakdown.Any() ? dailyBreakdown.Average(d => d.CaloriesConsumed) : 0;

            return new AiFitnessCoach.Shared.Models.WeeklyStats
            {
                WorkoutsCompleted = workoutsCompleted,
                CaloriesBurned = totalCaloriesBurned, // Added to shared model
                AverageCalories = averageCaloriesConsumed,
                TotalExerciseTime = totalExerciseTime,
                MealsLogged = mealsLogged,
                DailyBreakdown = dailyBreakdown,
                ActiveDays = activeDays
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting weekly stats for user {UserId}", userId);
            return new AiFitnessCoach.Shared.Models.WeeklyStats { DailyBreakdown = new List<AiFitnessCoach.Shared.Models.DailyActivity>() };
        }
    }

    private async Task<string> GetActiveDaysThisWeek(string userId)
    {
        var weekAgo = DateTime.UtcNow.Date.AddDays(-7);
        var activeWorkoutDays = await _context.WorkoutLogs
            .Where(wl => wl.UserId == userId && wl.CompletedAt.HasValue && wl.Date.Date >= weekAgo)
            .Select(wl => wl.Date.Date)
            .Distinct()        .CountAsync();
        // Consider active days based on meal logs too if desired
        return activeWorkoutDays.ToString();
    }

    public async Task<AiFitnessCoach.Shared.Models.UserStats> GetUserStatsAsync(string userId, DateTime startDate, DateTime endDate)
    {
        // Implementation for getting user statistics within date range
        var totalWorkouts = await _context.WorkoutLogs
            .Where(wl => wl.UserId == userId && wl.CompletedAt.HasValue && wl.Date.Date >= startDate.Date && wl.Date.Date <= endDate.Date)
            .CountAsync();

        var totalCaloriesBurned = await _context.WorkoutLogs
            .Where(wl => wl.UserId == userId && wl.CompletedAt.HasValue && wl.Date.Date >= startDate.Date && wl.Date.Date <= endDate.Date)
            .SumAsync(wl => wl.CaloriesBurned);        var totalMealsLogged = await _context.MealLogs
            .Where(ml => ml.UserId == userId && ml.LoggedAt.Date >= startDate.Date && ml.LoggedAt.Date <= endDate.Date)
            .CountAsync();

        var avgDailyCalories = await _context.MealLogs
            .Where(ml => ml.UserId == userId && ml.LoggedAt.Date >= startDate.Date && ml.LoggedAt.Date <= endDate.Date)
            .GroupBy(ml => ml.LoggedAt.Date)
            .Select(g => g.Sum(ml => ml.TotalCalories))
            .DefaultIfEmpty(0)
            .AverageAsync();

        return new AiFitnessCoach.Shared.Models.UserStats
        {
            UserId = userId,
            StartDate = startDate,
            EndDate = endDate,
            TotalWorkouts = totalWorkouts,
            TotalCaloriesBurned = totalCaloriesBurned,
            TotalMealsLogged = totalMealsLogged,
            AverageDailyCalories = (decimal)avgDailyCalories,
            CompletionRate = 85.5m // Placeholder calculation
        };
    }
}
