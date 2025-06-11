using AiFitnessCoach.API.Models;
using AiFitnessCoach.Shared.Models;

namespace AiFitnessCoach.API.Services;

public interface IWorkoutService
{
    Task<List<Workout>> GetWorkoutsAsync(string userId);
    Task<Workout> GetWorkoutByIdAsync(string workoutId, string userId);
    Task<Workout> CreateWorkoutAsync(string userId, CreateWorkoutRequest request);
    Task<Workout> UpdateWorkoutAsync(string workoutId, string userId, UpdateWorkoutRequest request);
    Task<bool> DeleteWorkoutAsync(string workoutId, string userId);
    Task<Workout> StartWorkoutAsync(string workoutId, string userId);
    Task<Workout> CompleteWorkoutAsync(string workoutId, string userId, CompleteWorkoutRequest request);
    Task<List<Exercise>> GetExercisesAsync();
    Task<List<Exercise>> SearchExercisesAsync(string query);
    Task<AiFitnessCoach.API.Models.WorkoutTemplate> CreateWorkoutTemplateAsync(string userId, CreateTemplateRequest request);
    Task<List<AiFitnessCoach.API.Models.WorkoutTemplate>> GetWorkoutTemplatesAsync(string userId);
    
    // Additional methods needed by controllers
    Task<List<AiFitnessCoach.Shared.Models.WorkoutPlan>> GetUserWorkoutsAsync(string userId);
    Task<AiFitnessCoach.Shared.Models.WorkoutPlan> GetWorkoutAsync(string workoutId, string userId);
    Task<AiFitnessCoach.Shared.Models.WorkoutSession> StartWorkoutSessionAsync(string workoutId, string userId);
    Task<AiFitnessCoach.Shared.Models.WorkoutSession> UpdateWorkoutSessionAsync(string sessionId, string userId, object request);
    Task<AiFitnessCoach.Shared.Models.WorkoutSession> CompleteWorkoutSessionAsync(string sessionId, string userId, object request);
}

public class CreateWorkoutRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public List<WorkoutExercise> Exercises { get; set; } = new();
    public int EstimatedDuration { get; set; }
    public string Difficulty { get; set; } = "beginner";
    public List<string> Tags { get; set; } = new();
}

public class UpdateWorkoutRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public List<WorkoutExercise> Exercises { get; set; } = new();
    public int EstimatedDuration { get; set; }
    public string Difficulty { get; set; } = "beginner";
    public List<string> Tags { get; set; } = new();
}

public class CompleteWorkoutRequest
{
    public List<ExerciseLog> ExerciseLogs { get; set; } = new();
    public int ActualDuration { get; set; }
    public int CaloriesBurned { get; set; }
    public string? Notes { get; set; }
    public int Rating { get; set; }
}

public class CreateTemplateRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public List<WorkoutExercise> Exercises { get; set; } = new();
    public int EstimatedDuration { get; set; }
    public string Difficulty { get; set; } = "beginner";
    public List<string> Tags { get; set; } = new();
    public bool IsPublic { get; set; } = false;
}

public class ExerciseLog
{
    public string ExerciseId { get; set; } = string.Empty;
    public List<ExerciseSet> Sets { get; set; } = new();
    public int RestTime { get; set; }
    public string? Notes { get; set; }
}

public class ExerciseSet
{
    public int Reps { get; set; }
    public double Weight { get; set; }
    public int Duration { get; set; }
    public double Distance { get; set; }
    public bool Completed { get; set; }
}
