using System.ComponentModel.DataAnnotations;

namespace AiFitnessCoach.Shared.Models
{    public class DashboardData
    {
        public string UserId { get; set; } = string.Empty;
        public List<DashboardMetric> Metrics { get; set; } = new();
        public List<RecentActivity> RecentActivities { get; set; } = new();
        public GoalProgress GoalProgress { get; set; } = new();
        public WeeklyStats WeeklyStats { get; set; } = new();
        public ProgressSummary ProgressSummary { get; set; } = new();
        public List<GoalProgress> Goals { get; set; } = new();
        public List<Achievement> RecentAchievements { get; set; } = new();
        public UpcomingPlan UpcomingPlan { get; set; } = new();
    }

    public class DashboardMetric
    {
        public string Name { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public string Unit { get; set; } = string.Empty;
        public string Change { get; set; } = string.Empty;
        public string ChangeType { get; set; } = "neutral"; // positive, negative, neutral
        public string Icon { get; set; } = string.Empty;
    }    public class ProgressSummary
    {
        public decimal? CurrentWeight { get; set; }
        public decimal? WeightChange { get; set; }
        public decimal? CurrentBodyFat { get; set; }
        public int TotalWorkouts { get; set; }
        public int ActiveGoals { get; set; }
        public int CompletedGoals { get; set; }
        public int CurrentStreak { get; set; }
        public string StreakType { get; set; } = string.Empty;
          // Additional properties for API compatibility
        public int ActiveGoalsCount { get; set; }
        public int CompletedGoalsCount { get; set; }
        public DateTime? LastLoggedDate { get; set; }
        public int TotalLogsCount { get; set; }
    }public class GoalProgress
    {
        public string GoalId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public decimal CurrentValue { get; set; }
        public decimal TargetValue { get; set; }
        public decimal ProgressPercentage { get; set; }
        public int DaysRemaining { get; set; }
        public bool IsOnTrack { get; set; }
        public string Category { get; set; } = string.Empty;
        public List<GoalItem> Goals { get; set; } = new();
        public double OverallProgress { get; set; }
    }

    public class GoalItem
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public decimal CurrentValue { get; set; } // Added CurrentValue for clarity
        public decimal TargetValue { get; set; } // Renamed Target to TargetValue for clarity
        public string Unit { get; set; } = string.Empty; // Added Unit
        public decimal ProgressPercentage { get; set; } // Calculated: (CurrentValue / TargetValue) * 100
        public string Status { get; set; } = string.Empty;
    }

    public class RecentActivity
    {
        public string Id { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // workout, meal, progress
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime Date { get; set; } // Was Timestamp in API model, ensure this is used consistently
        public string Icon { get; set; } = string.Empty; // Added Icon property
        public Dictionary<string, object> Metadata { get; set; } = new();
    }

    public class WeeklyStats
    {
        public int WorkoutsCompleted { get; set; }
        public int MealsLogged { get; set; }
        public decimal AverageCalories { get; set; } // Calories consumed on average
        public int ActiveDays { get; set; }
        public TimeSpan TotalExerciseTime { get; set; }
        public List<DailyActivity> DailyBreakdown { get; set; } = new(); // Was DailyActivities in API model
        public int CaloriesBurned { get; set; } // Added CaloriesBurned from API model
    }

    public class DailyActivity
    {
        public DateTime Date { get; set; }
        public bool WorkoutCompleted { get; set; }
        public bool MealsLogged { get; set; }
        public decimal CaloriesConsumed { get; set; }
        public int ExerciseMinutes { get; set; }
        public int Workouts { get; set; } // Added from API model
        public int CaloriesBurned { get; set; } // Added from API model (calories burned through exercise)
        public double ActiveMinutes { get; set; } // Added from API model (exercise minutes)
    }

    public class UpcomingPlan
    {
        public PlannedWorkout? NextWorkout { get; set; }
        public PlannedMeal? NextMeal { get; set; }
        public List<PlannedActivity> TodaysActivities { get; set; } = new();
    }

    public class PlannedWorkout
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public DateTime ScheduledTime { get; set; }
        public int EstimatedDuration { get; set; }
        public string Category { get; set; } = string.Empty;
    }

    public class PlannedActivity
    {
        public string Type { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public DateTime ScheduledTime { get; set; }
        public bool IsCompleted { get; set; }
    }

    public class ProgressTrend
    {
        public DateTime Date { get; set; }
        public decimal? Value { get; set; }
        public string MetricType { get; set; } = string.Empty;
    }    public class WeeklyReport
    {
        public string UserId { get; set; } = string.Empty;
        public DateTime WeekStartDate { get; set; }
        public DateTime WeekEndDate { get; set; }
        public int WorkoutsCompleted { get; set; }
        public TimeSpan TotalExerciseTime { get; set; }
        public decimal AverageCaloriesPerDay { get; set; }
        public decimal WeightChange { get; set; }
        public List<string> TopExercises { get; set; } = new();
        public List<Achievement> NewAchievements { get; set; } = new();
        public decimal GoalProgressPercentage { get; set; }
        public string MotivationalMessage { get; set; } = string.Empty;
          // Additional properties for API compatibility
        public int TotalExerciseMinutes { get; set; }
        public decimal AverageDailyCalories { get; set; }
        public int DaysWithMealLogs { get; set; }
    }    public class MonthlyReport
    {
        public string UserId { get; set; } = string.Empty;
        public int Year { get; set; }
        public int Month { get; set; }
        public int TotalWorkouts { get; set; }
        public TimeSpan TotalExerciseTime { get; set; }
        public decimal AverageCaloriesPerDay { get; set; }
        public decimal? WeightChange { get; set; } // Changed to nullable
        public int GoalsCompleted { get; set; }
        public List<Achievement> Achievements { get; set; } = new();
        public Dictionary<string, int> ExerciseFrequency { get; set; } = new();
        public ProgressSummary ProgressSummary { get; set; } = new();
          
        // Additional properties for API compatibility
        public int WorkoutsCompleted { get; set; }
        public int ProgressLogsCount { get; set; }
        public decimal AverageWorkoutsPerWeek { get; set; }
        public int GoalsAchieved { get; set; }
    }    public class ProgressComparison
    {
        public string UserId { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal? WeightChange { get; set; } // Changed to nullable
        public decimal? BodyFatChange { get; set; }
        public decimal? MuscleChange { get; set; }
        public int WorkoutsCompleted { get; set; }
        public TimeSpan TotalExerciseTime { get; set; }
        public int GoalsAchieved { get; set; }
        public List<ProgressTrend> Trends { get; set; } = new();
        public string Period { get; set; } = string.Empty; // Moved to main properties
    }    public class UserStats
    {
        public string UserId { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int TotalWorkouts { get; set; }
        public int TotalWorkoutTime { get; set; } // in minutes
        public int TotalCaloriesBurned { get; set; }
        public int TotalMealsLogged { get; set; }
        public decimal AverageDailyCalories { get; set; }
        public decimal CompletionRate { get; set; }
        public decimal? CurrentWeight { get; set; }
        public decimal? WeightChange { get; set; }
        public int ActiveGoals { get; set; }
        public int CompletedGoals { get; set; }
        public int CurrentStreak { get; set; }
        public int LongestStreak { get; set; }
        public DateTime LastActivity { get; set; }
    }

    public class UserActivity
    {
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;        public string Type { get; set; } = string.Empty; // workout, meal, progress, goal
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public Dictionary<string, object> Metadata { get; set; } = new();
    }
}
