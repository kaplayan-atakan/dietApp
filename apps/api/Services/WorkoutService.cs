using Microsoft.EntityFrameworkCore;
using AiFitnessCoach.API.Data;
using AiFitnessCoach.API.Models;
using SharedModels = AiFitnessCoach.Shared.Models;

namespace AiFitnessCoach.API.Services;

public class WorkoutService : IWorkoutService
{
    private readonly AppDbContext _context;
    private readonly ILogger<WorkoutService> _logger;

    public WorkoutService(AppDbContext context, ILogger<WorkoutService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<List<Workout>> GetWorkoutsAsync(string userId)
    {
        try
        {
            return await _context.Workouts
                .Where(w => w.UserId == userId)
                .OrderByDescending(w => w.CreatedAt)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting workouts for user {UserId}", userId);
            throw;
        }
    }

    public async Task<Workout> GetWorkoutByIdAsync(string workoutId, string userId)
    {
        try
        {
            var workout = await _context.Workouts
                .FirstOrDefaultAsync(w => w.Id == workoutId && w.UserId == userId);

            if (workout == null)
            {
                throw new NotFoundException($"Workout with ID {workoutId} not found");
            }

            return workout;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting workout {WorkoutId} for user {UserId}", workoutId, userId);
            throw;
        }
    }

    public async Task<Workout> CreateWorkoutAsync(string userId, CreateWorkoutRequest request)
    {
        try
        {
            var workout = new Workout
            {
                Id = Guid.NewGuid().ToString(),
                UserId = userId,
                Name = request.Name,
                Description = request.Description,
                Exercises = request.Exercises,
                EstimatedDuration = request.EstimatedDuration,
                Difficulty = request.Difficulty,
                Tags = request.Tags,
                ExerciseCount = request.Exercises.Count,
                CreatedAt = DateTime.UtcNow,
                Status = "draft"
            };

            _context.Workouts.Add(workout);
            await _context.SaveChangesAsync();

            return workout;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating workout for user {UserId}", userId);
            throw;
        }
    }

    public async Task<Workout> UpdateWorkoutAsync(string workoutId, string userId, UpdateWorkoutRequest request)
    {
        try
        {
            var workout = await GetWorkoutByIdAsync(workoutId, userId);

            workout.Name = request.Name;
            workout.Description = request.Description;
            workout.Exercises = request.Exercises;
            workout.EstimatedDuration = request.EstimatedDuration;
            workout.Difficulty = request.Difficulty;
            workout.Tags = request.Tags;
            workout.ExerciseCount = request.Exercises.Count;
            workout.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return workout;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating workout {WorkoutId} for user {UserId}", workoutId, userId);
            throw;
        }
    }

    public async Task<bool> DeleteWorkoutAsync(string workoutId, string userId)
    {
        try
        {
            var workout = await GetWorkoutByIdAsync(workoutId, userId);
            
            _context.Workouts.Remove(workout);
            await _context.SaveChangesAsync();

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting workout {WorkoutId} for user {UserId}", workoutId, userId);
            return false;
        }
    }

    public async Task<Workout> StartWorkoutAsync(string workoutId, string userId)
    {
        try
        {
            var workout = await GetWorkoutByIdAsync(workoutId, userId);

            workout.Status = "in_progress";
            workout.StartTime = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return workout;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error starting workout {WorkoutId} for user {UserId}", workoutId, userId);
            throw;
        }
    }

    public async Task<Workout> CompleteWorkoutAsync(string workoutId, string userId, CompleteWorkoutRequest request)
    {
        try
        {
            var workout = await GetWorkoutByIdAsync(workoutId, userId);

            workout.Status = "completed";
            workout.CompletedAt = DateTime.UtcNow;
            workout.ActualDuration = request.ActualDuration;
            workout.CaloriesBurned = request.CaloriesBurned;
            workout.Notes = request.Notes;
            workout.Rating = request.Rating;            // Create workout log entry
            var workoutLog = new SharedModels.WorkoutLog
            {
                Id = Guid.NewGuid().ToString(),
                UserId = userId,
                WorkoutTemplateId = workoutId,
                Name = workout.Name,
                StartedAt = workout.StartTime ?? DateTime.UtcNow,
                CompletedAt = DateTime.UtcNow,
                Date = DateTime.UtcNow,
                Duration = request.ActualDuration,
                CaloriesBurned = request.CaloriesBurned,
                Notes = request.Notes,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Exercises = new List<SharedModels.ExerciseLogItem>()
            };            _context.WorkoutLogs.Add(workoutLog);            // Log individual exercises
            foreach (var exerciseLog in request.ExerciseLogs)
            {
                var exerciseLogEntry = new SharedModels.ExerciseLogItem
                {
                    ExerciseId = exerciseLog.ExerciseId,
                    Name = "Exercise", // Placeholder name
                    Sets = exerciseLog.Sets.Select((s, index) => new SharedModels.SetLog
                    {
                        SetNumber = index + 1,
                        Reps = s.Reps,
                        Weight = (decimal?)s.Weight,
                        Duration = s.Duration,
                        Distance = (decimal?)s.Distance,
                        Completed = s.Completed
                    }).ToList(),
                    Notes = exerciseLog.Notes
                };

                workoutLog.Exercises.Add(exerciseLogEntry);
            }

            await _context.SaveChangesAsync();

            return workout;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error completing workout {WorkoutId} for user {UserId}", workoutId, userId);
            throw;
        }
    }

    public async Task<List<Exercise>> GetExercisesAsync()
    {
        try
        {
            return await _context.Exercises
                .OrderBy(e => e.Name)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting exercises");
            throw;
        }
    }

    public async Task<List<Exercise>> SearchExercisesAsync(string query)
    {
        try
        {
            return await _context.Exercises
                .Where(e => e.Name.Contains(query) || 
                           e.Category.Contains(query) ||
                           e.MuscleGroups.Any(mg => mg.Contains(query)))
                .OrderBy(e => e.Name)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching exercises with query {Query}", query);
            throw;
        }
    }    public async Task<WorkoutTemplate> CreateWorkoutTemplateAsync(string userId, CreateTemplateRequest request)
    {
        try
        {            var sharedTemplate = new SharedModels.WorkoutTemplate
            {
                Id = Guid.NewGuid().ToString(),
                UserId = userId,
                Name = request.Name,
                Description = request.Description ?? string.Empty,
                Category = "Custom",
                EstimatedDuration = request.EstimatedDuration,
                Difficulty = request.Difficulty,
                Equipment = string.Empty, // Default value
                MuscleGroups = new List<string>(), // Default empty list
                IsPublic = request.IsPublic,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Exercises = new List<SharedModels.ExerciseTemplate>()
            };

            _context.WorkoutTemplates.Add(sharedTemplate);
            await _context.SaveChangesAsync();

            // Map to API model for return
            var apiTemplate = new WorkoutTemplate
            {
                Id = sharedTemplate.Id,
                UserId = sharedTemplate.UserId,
                Name = sharedTemplate.Name,
                Description = sharedTemplate.Description,
                Exercises = request.Exercises, // Use original request exercises
                EstimatedDuration = sharedTemplate.EstimatedDuration,
                Difficulty = sharedTemplate.Difficulty,
                Tags = request.Tags,
                IsPublic = sharedTemplate.IsPublic,
                ExerciseCount = request.Exercises.Count,
                CreatedAt = sharedTemplate.CreatedAt,
                UpdatedAt = sharedTemplate.UpdatedAt
            };

            return apiTemplate;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating workout template for user {UserId}", userId);
            throw;
        }
    }    public async Task<List<WorkoutTemplate>> GetWorkoutTemplatesAsync(string userId)
    {
        try
        {
            var sharedTemplates = await _context.WorkoutTemplates
                .Where(wt => wt.UserId == userId || wt.IsPublic)
                .OrderByDescending(wt => wt.CreatedAt)
                .ToListAsync();

            // Convert to API models
            return sharedTemplates.Select(st => new WorkoutTemplate
            {
                Id = st.Id,
                UserId = st.UserId,
                Name = st.Name,
                Description = st.Description,
                Exercises = new List<WorkoutExercise>(), // Empty for now
                EstimatedDuration = st.EstimatedDuration,
                Difficulty = st.Difficulty,
                Tags = new List<string>(), // Default empty
                IsPublic = st.IsPublic,
                ExerciseCount = st.Exercises.Count,
                CreatedAt = st.CreatedAt,
                UpdatedAt = st.UpdatedAt,
                UsageCount = 0 // Default value
            }).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting workout templates for user {UserId}", userId);
            throw;
        }
    }

    // Additional implementation for missing methods
    public async Task<List<AiFitnessCoach.Shared.Models.WorkoutPlan>> GetUserWorkoutsAsync(string userId)
    {
        try
        {
            // Map API Workouts to shared WorkoutPlan models
            var workouts = await GetWorkoutsAsync(userId);
            return workouts.Select(w => new AiFitnessCoach.Shared.Models.WorkoutPlan
            {
                Id = w.Id,
                UserId = w.UserId,
                Name = w.Name,
                Description = w.Description ?? string.Empty,
                StartDate = w.CreatedAt,
                IsActive = w.Status != "completed",
                CreatedAt = w.CreatedAt,
                UpdatedAt = w.UpdatedAt ?? w.CreatedAt,
                Workouts = new List<AiFitnessCoach.Shared.Models.WorkoutTemplate>()
            }).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user workouts for {UserId}", userId);
            throw;
        }
    }

    public async Task<AiFitnessCoach.Shared.Models.WorkoutPlan> GetWorkoutAsync(string workoutId, string userId)
    {
        try
        {
            var workout = await GetWorkoutByIdAsync(workoutId, userId);
            return new AiFitnessCoach.Shared.Models.WorkoutPlan
            {
                Id = workout.Id,
                UserId = workout.UserId,
                Name = workout.Name,
                Description = workout.Description ?? string.Empty,
                StartDate = workout.CreatedAt,
                IsActive = workout.Status != "completed",
                CreatedAt = workout.CreatedAt,
                UpdatedAt = workout.UpdatedAt ?? workout.CreatedAt,
                Workouts = new List<AiFitnessCoach.Shared.Models.WorkoutTemplate>()
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting workout {WorkoutId} for user {UserId}", workoutId, userId);
            throw;
        }
    }

    public async Task<AiFitnessCoach.Shared.Models.WorkoutSession> StartWorkoutSessionAsync(string workoutId, string userId)
    {
        try
        {
            var workout = await GetWorkoutByIdAsync(workoutId, userId);
              var session = new AiFitnessCoach.Shared.Models.WorkoutSession
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                WorkoutTemplateId = workoutId,
                StartTime = DateTime.UtcNow,
                Duration = 0,
                Exercises = new List<AiFitnessCoach.Shared.Models.ExerciseLogItem>(),
                Notes = null,
                Completed = false,
                CreatedAt = DateTime.UtcNow
            };
            
            return session;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error starting workout session for {WorkoutId} and user {UserId}", workoutId, userId);
            throw;
        }
    }    public async Task<AiFitnessCoach.Shared.Models.WorkoutSession> UpdateWorkoutSessionAsync(string sessionId, string userId, object request)
    {
        try
        {
            // Create a mock updated session for now
            var session = new AiFitnessCoach.Shared.Models.WorkoutSession
            {
                Id = Guid.Parse(sessionId),
                UserId = userId,
                WorkoutTemplateId = string.Empty,
                StartTime = DateTime.UtcNow.AddMinutes(-30),
                Duration = 30,
                Exercises = new List<AiFitnessCoach.Shared.Models.ExerciseLogItem>(),
                Notes = "Updated session",
                Completed = false,
                CreatedAt = DateTime.UtcNow.AddMinutes(-30)
            };
            
            return await Task.FromResult(session);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating workout session {SessionId} for user {UserId}", sessionId, userId);
            throw;
        }
    }    public async Task<AiFitnessCoach.Shared.Models.WorkoutSession> CompleteWorkoutSessionAsync(string sessionId, string userId, object request)
    {
        try
        {
            // Create a mock completed session for now
            var session = new AiFitnessCoach.Shared.Models.WorkoutSession
            {
                Id = Guid.Parse(sessionId),
                UserId = userId,
                WorkoutTemplateId = string.Empty,
                StartTime = DateTime.UtcNow.AddMinutes(-60),
                EndTime = DateTime.UtcNow,
                Duration = 60,
                Exercises = new List<AiFitnessCoach.Shared.Models.ExerciseLogItem>(),
                Notes = "Completed session",
                Completed = true,
                CreatedAt = DateTime.UtcNow.AddMinutes(-60)
            };
            
            return await Task.FromResult(session);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error completing workout session {SessionId} for user {UserId}", sessionId, userId);
            throw;
        }
    }
}
