using System.ComponentModel.DataAnnotations;

namespace AiFitnessCoach.Shared.DTOs
{
    // Workout DTOs
    public class CreateWorkoutTemplateRequest
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        [Required]
        public string Category { get; set; } = string.Empty;

        [Range(5, 300)]
        public int EstimatedDuration { get; set; }

        [Required]
        public string Difficulty { get; set; } = string.Empty;

        public List<CreateExerciseTemplateRequest> Exercises { get; set; } = new();
        public string? Equipment { get; set; }
        public List<string> MuscleGroups { get; set; } = new();
    }

    public class CreateExerciseTemplateRequest
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;

        [MaxLength(2000)]
        public string Instructions { get; set; } = string.Empty;

        public List<string> MuscleGroups { get; set; } = new();
        public string Equipment { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string? VideoUrl { get; set; }
        public List<string> Images { get; set; } = new();

        [Range(1, 10)]
        public int Sets { get; set; }

        [Range(1, 100)]
        public int Reps { get; set; }

        [Range(30, 300)]
        public int RestTime { get; set; }

        public string? Notes { get; set; }
    }

    public class StartWorkoutRequest
    {
        public string? WorkoutTemplateId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        public List<CreateExerciseLogRequest> Exercises { get; set; } = new();
    }

    public class CreateExerciseLogRequest
    {
        [Required]
        public string ExerciseId { get; set; } = string.Empty;

        [Required]
        public string Name { get; set; } = string.Empty;

        public List<CreateSetLogRequest> Sets { get; set; } = new();
        public string? Notes { get; set; }
    }

    public class CreateSetLogRequest
    {
        [Range(1, 20)]
        public int SetNumber { get; set; }

        [Range(1, 1000)]
        public int Reps { get; set; }

        [Range(0, 1000)]
        public decimal? Weight { get; set; }

        [Range(1, 7200)]
        public int? Duration { get; set; }

        [Range(0, 100)]
        public decimal? Distance { get; set; }

        public bool Completed { get; set; } = false;
    }

    public class CompleteWorkoutRequest
    {
        public string? Notes { get; set; }
        public int CaloriesBurned { get; set; }
    }

    public class LogExerciseRequest
    {
        [Required]
        public string WorkoutLogId { get; set; } = string.Empty;

        [Required]
        public CreateExerciseLogRequest Exercise { get; set; } = new();
    }

    public class UpdateWorkoutSessionRequest
    {
        public DateTime? EndTime { get; set; }
        public int? Duration { get; set; } // in minutes
        public List<UpdateExerciseLogRequest> Exercises { get; set; } = new();
        public string? Notes { get; set; }
        public bool Completed { get; set; }
    }    public class UpdateExerciseLogRequest
    {
        [Required]
        public string ExerciseTemplateId { get; set; } = string.Empty;

        [Range(1, 20)]
        public int Sets { get; set; }

        [Range(1, 1000)]
        public int Reps { get; set; }

        [Range(0, 1000)]
        public decimal Weight { get; set; }

        public int? Duration { get; set; } // for time-based exercises
        public decimal? Distance { get; set; } // for distance-based exercises
        public bool Completed { get; set; }
    }

    public class CompleteWorkoutSessionRequest
    {
        [Range(1, 600)]
        public int ActualDuration { get; set; } // in minutes

        [Range(0, 2000)]
        public int CaloriesBurned { get; set; }

        [MaxLength(1000)]
        public string? Notes { get; set; }

        [Range(1, 5)]
        public int Rating { get; set; } = 3;

        public List<CompleteExerciseLogRequest> ExerciseLogs { get; set; } = new();
    }

    public class CompleteExerciseLogRequest
    {
        [Required]
        public string ExerciseTemplateId { get; set; } = string.Empty;

        public List<CompleteSetRequest> Sets { get; set; } = new();

        [Range(0, 600)]
        public int RestTime { get; set; } // in seconds

        [MaxLength(500)]
        public string? Notes { get; set; }
    }

    public class CompleteSetRequest
    {
        [Range(1, 1000)]
        public int Reps { get; set; }

        [Range(0, 1000)]
        public decimal Weight { get; set; }

        [Range(0, 3600)]
        public int Duration { get; set; } // in seconds

        [Range(0, 100)]
        public decimal Distance { get; set; } // in km

        public bool Completed { get; set; }
    }
}
