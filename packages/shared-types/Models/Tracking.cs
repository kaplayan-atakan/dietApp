using System.ComponentModel.DataAnnotations;

namespace AiFitnessCoach.Shared.Models
{    public class ProgressLog
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
          // Additional properties for API compatibility
        public DateTime Date { get => LogDate; set => LogDate = value; }
        public Dictionary<string, object> Measurements { get => CustomMetrics; set => CustomMetrics = value; }
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
    }    public class BodyMetrics
    {
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public decimal Weight { get; set; }
        public decimal? BodyFatPercentage { get; set; }
        public decimal? MusclePercentage { get; set; }
        public decimal? BMI { get; set; }
        public DateTime RecordedAt { get; set; }
          // Additional properties for API compatibility
        public Dictionary<string, object> Measurements { get; set; } = new();
        public DateTime Date { get; set; }
    }public class Achievement
    {
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? IconUrl { get; set; }
        public string? Category { get; set; }
        public DateTime UnlockedAt { get; set; }
    }    public class Streak
    {
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // workout, nutrition, etc.
        public int CurrentStreak { get; set; }
        public int LongestStreak { get; set; }
        public DateTime LastActivityDate { get; set; }
          // Additional properties for API compatibility
        public int CurrentCount { get; set; }
        public int BestCount { get; set; }
        public DateTime LastActivity { get; set; }
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
        public int LongestStreak { get; set; }        public DateTime LastLogDate { get; set; }
    }
}
