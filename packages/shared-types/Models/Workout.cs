using System.ComponentModel.DataAnnotations;

namespace AiFitnessCoach.Shared.Models
{    public class WorkoutTemplate
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public int EstimatedDuration { get; set; } // in minutes
        public string Difficulty { get; set; } = string.Empty;
        public List<ExerciseTemplate> Exercises { get; set; } = new();
        public string? Equipment { get; set; }
        public List<string> MuscleGroups { get; set; } = new();
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        
        // Additional properties for API compatibility
        public string UserId { get; set; } = string.Empty;
        public bool IsPublic { get; set; } = true;
    }

    public class ExerciseTemplate
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Instructions { get; set; } = string.Empty;
        public List<string> MuscleGroups { get; set; } = new();
        public string Equipment { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string? VideoUrl { get; set; }
        public List<string> Images { get; set; } = new();
        public int Sets { get; set; }
        public int Reps { get; set; }
        public int RestTime { get; set; } // in seconds
        public string? Notes { get; set; }
    }    public class WorkoutLog
    {
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string? WorkoutTemplateId { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime StartedAt { get; set; } // Renamed from StartTime to match WorkoutSession
        public DateTime? CompletedAt { get; set; }
        public int Duration { get; set; } // in minutes
        public List<ExerciseLogItem> Exercises { get; set; } = new();
        public string? Notes { get; set; }
        public int CaloriesBurned { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        
        // Additional properties for API compatibility
        public DateTime Date { get; set; } // This was used by DashboardService for filtering by date
        public int ExerciseCount => Exercises?.Count ?? 0; // Added for DashboardService recent activity
        public DateTime StartTime { get => StartedAt; set => StartedAt = value; } // Compatibility for DashboardService query

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

    public class WorkoutPlan
    {
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<WorkoutTemplate> Workouts { get; set; } = new();
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class WorkoutSession
    {
        public Guid Id { get; set; } // Changed to Guid to match _context.Workouts.Id
        public string UserId { get; set; } = string.Empty;
        public string WorkoutTemplateId { get; set; } = string.Empty;
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public DateTime? CompletedAt { get => EndTime; set => EndTime = value; } // Align with DashboardService usage
        public int Duration { get; set; } // in minutes
        public List<ExerciseLogItem> Exercises { get; set; } = new();
        public int ExerciseCount => Exercises?.Count ?? 0; // Added for DashboardService recent activity
        public string? Notes { get; set; }
        public bool Completed { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Name { get; set; } = string.Empty; // Added Name as used in DashboardService
    }
}
