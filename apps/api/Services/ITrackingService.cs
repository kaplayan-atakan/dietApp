using AiFitnessCoach.Shared.Models;
using AiFitnessCoach.Shared.DTOs;

namespace AiFitnessCoach.API.Services
{
    public interface ITrackingService
    {
        // Progress Logging
        Task<ProgressLog> LogProgressAsync(string userId, LogProgressRequest request);
        Task<List<ProgressLog>> GetProgressLogsAsync(string userId, DateTime? startDate = null, DateTime? endDate = null);
        Task<ProgressLog?> UpdateProgressLogAsync(string logId, string userId, UpdateProgressLogRequest request);
        Task<bool> DeleteProgressLogAsync(string logId, string userId);

        // Goal Management
        Task<List<Goal>> GetUserGoalsAsync(string userId);
        Task<Goal> CreateGoalAsync(string userId, CreateGoalRequest request);
        Task<Goal?> UpdateGoalAsync(string goalId, string userId, UpdateGoalRequest request);
        Task<bool> DeleteGoalAsync(string goalId, string userId);
        Task<Goal?> GetGoalAsync(string goalId, string userId);

        // Progress Analysis
        Task<ProgressSummary> GetProgressSummaryAsync(string userId);
        Task<List<ProgressTrend>> GetProgressTrendsAsync(string userId, string metricType, DateTime startDate, DateTime endDate);
        Task<GoalProgress?> GetGoalProgressAsync(string goalId, string userId);
        Task<List<Achievement>> GetUserAchievementsAsync(string userId);

        // Body Metrics
        Task<BodyMetrics?> GetLatestBodyMetricsAsync(string userId);
        Task<List<BodyMetrics>> GetBodyMetricsHistoryAsync(string userId, DateTime? startDate = null, DateTime? endDate = null);
        Task<BodyMetrics> LogBodyMetricsAsync(string userId, LogBodyMetricsRequest request);        // Streaks and Habits
        Task<List<Streak>> GetActiveStreaksAsync(string userId);
        Task<WorkoutStreak> GetWorkoutStreakAsync(string userId);
        Task<NutritionStreak> GetNutritionStreakAsync(string userId);
        Task UpdateStreaksAsync(string userId);

        // Reports
        Task<WeeklyReport> GenerateWeeklyReportAsync(string userId, DateTime weekStartDate);
        Task<MonthlyReport> GenerateMonthlyReportAsync(string userId, int year, int month);
        Task<ProgressComparison> CompareProgressAsync(string userId, DateTime startDate, DateTime endDate);
    }
}
