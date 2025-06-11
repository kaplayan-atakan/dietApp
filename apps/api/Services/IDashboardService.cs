using AiFitnessCoach.Shared.Models;
using System.Collections.Generic; // For List<T>
using System.Threading.Tasks; // For Task<T>
using System; // For DateTime

namespace AiFitnessCoach.API.Services;

public interface IDashboardService
{
    Task<DashboardData> GetDashboardDataAsync(string userId);
    Task<List<AiFitnessCoach.Shared.Models.DashboardMetric>> GetMetricsAsync(string userId);
    Task<List<AiFitnessCoach.Shared.Models.RecentActivity>> GetRecentActivitiesAsync(string userId, int limit = 10);
    Task<AiFitnessCoach.Shared.Models.GoalProgress> GetGoalProgressAsync(string userId);    Task<AiFitnessCoach.Shared.Models.WeeklyStats> GetWeeklyStatsAsync(string userId);
    Task<AiFitnessCoach.Shared.Models.UserStats> GetUserStatsAsync(string userId, DateTime startDate, DateTime endDate);
}
