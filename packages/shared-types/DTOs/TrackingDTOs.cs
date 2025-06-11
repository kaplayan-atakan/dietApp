using System.ComponentModel.DataAnnotations;

namespace AiFitnessCoach.Shared.DTOs
{    // Progress Tracking DTOs
    public class LogProgressRequest
    {
        public DateTime Date { get; set; } = DateTime.UtcNow;

        [Range(30, 500)]
        public decimal? Weight { get; set; }

        [Range(0, 50)]
        public decimal? BodyFatPercentage { get; set; }

        [Range(0, 100)]
        public decimal? MusclePercentage { get; set; }

        public string? Notes { get; set; }
        public List<string>? Photos { get; set; } = new();
        public Dictionary<string, object>? CustomMetrics { get; set; } = new();
        public Dictionary<string, object>? Measurements { get; set; } = new();
    }    public class UpdateProgressLogRequest
    {
        [Range(30, 500)]
        public decimal? Weight { get; set; }

        [Range(0, 50)]
        public decimal? BodyFatPercentage { get; set; }

        [Range(0, 100)]
        public decimal? MusclePercentage { get; set; }

        public string? Notes { get; set; }
        public List<string>? Photos { get; set; }
        public Dictionary<string, object>? CustomMetrics { get; set; }
        public Dictionary<string, object>? Measurements { get; set; } = new();
    }    public class LogBodyMetricsRequest
    {
        public DateTime Date { get; set; } = DateTime.UtcNow;

        [Required]
        [Range(30, 500)]
        public decimal Weight { get; set; }

        [Range(0, 50)]
        public decimal? BodyFatPercentage { get; set; }

        [Range(0, 100)]
        public decimal? MusclePercentage { get; set; }

        public Dictionary<string, object>? Measurements { get; set; } = new();
    }

    // Goal DTOs
    public class CreateGoalRequest
    {
        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        [Required]
        public string Category { get; set; } = string.Empty;

        [Required]
        public decimal TargetValue { get; set; }

        public decimal CurrentValue { get; set; } = 0;

        [Required]
        public string Unit { get; set; } = string.Empty;

        [Required]
        public DateTime TargetDate { get; set; }
    }

    public class UpdateGoalRequest
    {
        [MaxLength(100)]
        public string? Title { get; set; }

        [MaxLength(500)]
        public string? Description { get; set; }

        public string? Category { get; set; }
        public decimal? TargetValue { get; set; }
        public decimal? CurrentValue { get; set; }
        public string? Unit { get; set; }
        public DateTime? TargetDate { get; set; }
        public bool? IsActive { get; set; }
    }
}
