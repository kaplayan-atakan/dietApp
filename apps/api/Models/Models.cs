using System.ComponentModel.DataAnnotations;
using AiFitnessCoach.Shared.Models;

namespace AiFitnessCoach.API.Models;

// Workout-related models
public class Workout
{
    public string Id { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public List<WorkoutExercise> Exercises { get; set; } = new();
    public int EstimatedDuration { get; set; }
    public int? ActualDuration { get; set; }
    public string Difficulty { get; set; } = "beginner";
    public List<string> Tags { get; set; } = new();
    public string Status { get; set; } = "draft"; // draft, in_progress, completed
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? StartTime { get; set; }
    public DateTime? CompletedAt { get; set; }
    public int ExerciseCount { get; set; }
    public int? CaloriesBurned { get; set; }
    public string? Notes { get; set; }
    public int? Rating { get; set; }
}

public class WorkoutTemplate
{
    public string Id { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public List<WorkoutExercise> Exercises { get; set; } = new();
    public int EstimatedDuration { get; set; }
    public string Difficulty { get; set; } = "beginner";
    public List<string> Tags { get; set; } = new();
    public bool IsPublic { get; set; } = false;
    public int ExerciseCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int UsageCount { get; set; }
}

public class WorkoutExercise
{
    public string ExerciseId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int Sets { get; set; }
    public int? Reps { get; set; }
    public double? Weight { get; set; }
    public int? Duration { get; set; }
    public double? Distance { get; set; }
    public int RestTime { get; set; }
    public string? Notes { get; set; }
}

public class Exercise
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public List<string> MuscleGroups { get; set; } = new();
    public List<string> Equipment { get; set; } = new();
    public string Difficulty { get; set; } = "beginner";
    public List<string> Instructions { get; set; } = new();
    public string VideoUrl { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
}

public class WorkoutLog
{
    public string Id { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string? WorkoutTemplateId { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public int Duration { get; set; } // in minutes
    public List<ExerciseLogItem> Exercises { get; set; } = new();
    public string? Notes { get; set; }
    public int CaloriesBurned { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Legacy properties for backward compatibility
    public string? WorkoutId { get; set; }
    public DateTime Date { get; set; }
    public int ExerciseCount { get; set; }
    public int? Rating { get; set; }
}

public class ExerciseLogItem
{
    public string ExerciseId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public List<SetLog> Sets { get; set; } = new();
    public string? Notes { get; set; }
}

public class SetLog
{
    public int SetNumber { get; set; }
    public int Reps { get; set; }
    public decimal? Weight { get; set; }
    public int? Duration { get; set; } // for time-based exercises
    public decimal? Distance { get; set; } // for distance-based exercises
    public bool Completed { get; set; }
}

public class ExerciseLog
{
    public string Id { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string? WorkoutLogId { get; set; }
    public string ExerciseId { get; set; } = string.Empty;
    public List<ExerciseSet> Sets { get; set; } = new();
    public int RestTime { get; set; }
    public string? Notes { get; set; }
    public DateTime Date { get; set; }
}

public class ExerciseSet
{
    public int Reps { get; set; }
    public double Weight { get; set; }
    public int Duration { get; set; }
    public double Distance { get; set; }
    public bool Completed { get; set; }
}

// Nutrition-related models
public class Food
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string Barcode { get; set; } = string.Empty;
    public double ServingSize { get; set; }
    public string ServingUnit { get; set; } = string.Empty;
    public NutritionInfo Nutrition { get; set; } = new();
    public string Category { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class Recipe
{
    public string Id { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<RecipeIngredient> Ingredients { get; set; } = new();
    public List<string> Instructions { get; set; } = new();
    public int PrepTime { get; set; }
    public int CookTime { get; set; }
    public int Servings { get; set; }
    public string Difficulty { get; set; } = "easy";
    public List<string> Tags { get; set; } = new();
    public NutritionInfo Nutrition { get; set; } = new();
    public string ImageUrl { get; set; } = string.Empty;
    public bool IsPublic { get; set; } = false;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class RecipeIngredient
{
    public string FoodId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public double Quantity { get; set; }
    public string Unit { get; set; } = string.Empty;
    public string? Notes { get; set; }
}

public class MealPlan
{
    public string Id { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public List<PlannedMeal> Meals { get; set; } = new();
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class PlannedMeal
{
    public DateTime Date { get; set; }
    public string MealType { get; set; } = string.Empty;
    public List<FoodEntry> Foods { get; set; } = new();
    public string? RecipeId { get; set; }
    public string? Notes { get; set; }
}

public class MealLog
{
    public string Id { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string MealType { get; set; } = string.Empty; // breakfast, lunch, dinner, snack
    public List<FoodEntry> Foods { get; set; } = new();
    public NutritionInfo Nutrition { get; set; } = new();
    public int TotalCalories { get; set; }
    public DateTime LoggedAt { get; set; }
    public string? Notes { get; set; }
}

public class FoodEntry
{
    public string FoodId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public double Quantity { get; set; }
    public string Unit { get; set; } = string.Empty;
    public int Calories { get; set; }
}

public class NutritionLog
{
    public string Id { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public NutritionInfo Totals { get; set; } = new();
    public NutritionInfo Goals { get; set; } = new();
}

public class NutritionInfo
{
    public double Calories { get; set; }
    public double Protein { get; set; }
    public double Carbs { get; set; }
    public double Fat { get; set; }
    public double Fiber { get; set; }
    public double Sugar { get; set; }
    public double Sodium { get; set; }
}

// Progress tracking models
public class ProgressLog
{
    public string Id { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public DateTime LogDate { get; set; }
    public decimal? Weight { get; set; }
    public decimal? BodyFatPercentage { get; set; }
    public decimal? MusclePercentage { get; set; }
    public string? Notes { get; set; }
    public string? Photos { get; set; } // JSON array of photo URLs
    public Dictionary<string, object> CustomMetrics { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Legacy properties for backward compatibility
    public DateTime Date => LogDate;
    public double? BodyFat => (double?)BodyFatPercentage;
    public double? MuscleMass => (double?)MusclePercentage;
    public Dictionary<string, double> Measurements { get; set; } = new();
    public List<string> PhotoList { get; set; } = new();
}

public class Goal
{
    public string Id { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty; // weight_loss, muscle_gain, endurance, etc.
    public decimal TargetValue { get; set; }
    public decimal CurrentValue { get; set; }
    public string Unit { get; set; } = string.Empty;
    public DateTime? TargetDate { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Legacy properties for backward compatibility
    public string Type => Category;
    public DateTime StartDate { get; set; }
    public bool IsAchieved => CurrentValue >= TargetValue;
}

// Additional models for tracking and reporting
public class BodyMetrics
{
    public string Id { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public decimal Weight { get; set; }
    public decimal? BodyFatPercentage { get; set; }
    public decimal? MusclePercentage { get; set; }
    public decimal? BMI { get; set; }
    public DateTime RecordedAt { get; set; }
}

public class Achievement
{
    public string Id { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime UnlockedAt { get; set; }
}

public class Streak
{
    public string Id { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // workout, nutrition, etc.
    public int CurrentStreak { get; set; }
    public int LongestStreak { get; set; }
    public DateTime LastActivityDate { get; set; }
}

public class WorkoutStreak
{
    public string UserId { get; set; } = string.Empty;
    public int CurrentStreak { get; set; }
    public int LongestStreak { get; set; }
    public DateTime LastWorkoutDate { get; set; }
}

public class NutritionStreak
{
    public string UserId { get; set; } = string.Empty;
    public int CurrentStreak { get; set; }
    public int LongestStreak { get; set; }
    public DateTime LastLogDate { get; set; }
}

// Dashboard and reporting models
public class ProgressSummary
{
    public decimal? CurrentWeight { get; set; }
    public decimal? WeightChange { get; set; }
    public decimal? CurrentBodyFat { get; set; }
    public int TotalWorkouts { get; set; }
    public int ActiveGoals { get; set; }
    public int CompletedGoals { get; set; }
    public int CurrentStreak { get; set; }
    public string StreakType { get; set; } = string.Empty;
}

public class RecentActivity
{
    public string Id { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // workout, meal, progress
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public Dictionary<string, object> Metadata { get; set; } = new();
}

public class WeeklyStats
{
    public int WorkoutsCompleted { get; set; }
    public int MealsLogged { get; set; }
    public decimal AverageCalories { get; set; }
    public int ActiveDays { get; set; }
    public TimeSpan TotalExerciseTime { get; set; }
    public List<DailyActivity> DailyBreakdown { get; set; } = new();
}

public class DailyActivity
{
    public DateTime Date { get; set; }
    public bool WorkoutCompleted { get; set; }
    public bool MealsLogged { get; set; }
    public decimal CaloriesConsumed { get; set; }
    public int ExerciseMinutes { get; set; }
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
}

public class WeeklyReport
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
}

public class MonthlyReport
{
    public string UserId { get; set; } = string.Empty;
    public int Year { get; set; }
    public int Month { get; set; }
    public int TotalWorkouts { get; set; }
    public TimeSpan TotalExerciseTime { get; set; }
    public decimal AverageCaloriesPerDay { get; set; }
    public decimal WeightChange { get; set; }
    public int GoalsCompleted { get; set; }
    public List<Achievement> Achievements { get; set; } = new();
    public Dictionary<string, int> ExerciseFrequency { get; set; } = new();
    public ProgressSummary ProgressSummary { get; set; } = new();
}

public class ProgressComparison
{
    public string UserId { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public decimal WeightChange { get; set; }
    public decimal? BodyFatChange { get; set; }
    public decimal? MuscleChange { get; set; }
    public int WorkoutsCompleted { get; set; }
    public TimeSpan TotalExerciseTime { get; set; }
    public int GoalsAchieved { get; set; }
    public List<ProgressTrend> Trends { get; set; } = new();
}

// Notification models
public class UserDevice
{
    public string Id { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string DeviceToken { get; set; } = string.Empty;
    public string Platform { get; set; } = string.Empty; // ios, android, web
    public string DeviceName { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public DateTime RegisteredAt { get; set; }
    public DateTime LastUsed { get; set; }
}

public class NotificationSettings
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
}

public class NotificationHistory
{
    public string Id { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public Dictionary<string, string> Data { get; set; } = new();
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
}

public class ScheduledNotification
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
}

// Configuration classes
public class SmtpSettings
{
    public string Host { get; set; } = string.Empty;
    public int Port { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public bool EnableSsl { get; set; }
    public string FromName { get; set; } = string.Empty;
    public string FromEmail { get; set; } = string.Empty;
}

public class RedisSettings
{
    public string ConnectionString { get; set; } = string.Empty;
    public int Database { get; set; } = 0;
}
