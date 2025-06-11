using Microsoft.EntityFrameworkCore;
using AiFitnessCoach.API.Models;
using SharedModels = AiFitnessCoach.Shared.Models;

namespace AiFitnessCoach.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }    // User-related entities
    public DbSet<SharedModels.User> Users { get; set; }
    public DbSet<SharedModels.UserSettings> UserSettings { get; set; }      // Workout-related entities
    public DbSet<SharedModels.WorkoutTemplate> WorkoutTemplates { get; set; }
    public DbSet<SharedModels.WorkoutLog> WorkoutLogs { get; set; }
    
    // Nutrition-related entities
    public DbSet<SharedModels.Food> Foods { get; set; }
    public DbSet<SharedModels.Recipe> Recipes { get; set; }
    public DbSet<SharedModels.MealPlan> MealPlans { get; set; }
    public DbSet<SharedModels.MealLog> MealLogs { get; set; }
    
    // Progress-related entities
    public DbSet<SharedModels.ProgressLog> ProgressLogs { get; set; }
    public DbSet<SharedModels.Goal> Goals { get; set; }
    public DbSet<SharedModels.BodyMetrics> BodyMetrics { get; set; }
    public DbSet<SharedModels.Achievement> Achievements { get; set; }
    public DbSet<SharedModels.Streak> Streaks { get; set; }    // Notification entities
    public DbSet<SharedModels.Notification> Notifications { get; set; }
    public DbSet<SharedModels.NotificationHistory> NotificationHistory { get; set; }
    public DbSet<SharedModels.NotificationSettings> NotificationSettings { get; set; }
    public DbSet<SharedModels.NotificationTemplate> NotificationTemplates { get; set; }
    public DbSet<SharedModels.ScheduledNotification> ScheduledNotifications { get; set; }
    public DbSet<SharedModels.UserDevice> UserDevices { get; set; }
    
    // Admin and Logging entities
    public DbSet<ClientLog> ClientLogs { get; set; }
    
    // User Goals entity
    public DbSet<SharedModels.UserGoals> UserGoals { get; set; }
    
    // API-specific entities that don't have shared equivalents
    public DbSet<Workout> Workouts { get; set; }
    public DbSet<Exercise> Exercises { get; set; }
    public DbSet<NutritionLog> NutritionLogs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);        // Configure User entity
        modelBuilder.Entity<SharedModels.User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.PasswordHash).IsRequired();
            entity.Property(e => e.Gender).HasMaxLength(50);
            entity.Property(e => e.ActivityLevel).HasMaxLength(50);
            
            // Configure complex properties as JSON
            entity.Property(e => e.Goals).HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<string>()
            );
            
            entity.Property(e => e.DietaryRestrictions).HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<string>()
            );
        });

        // Configure Workout entity
        modelBuilder.Entity<Workout>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.UserId).IsRequired();
            
            // Configure exercises as JSON
            entity.Property(e => e.Exercises).HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<List<WorkoutExercise>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<WorkoutExercise>()
            );
            
            // Configure tags as JSON
            entity.Property(e => e.Tags).HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<string>()
            );
        });

        // Configure WorkoutTemplate entity
        modelBuilder.Entity<WorkoutTemplate>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.UserId).IsRequired();
            
            // Configure exercises as JSON
            entity.Property(e => e.Exercises).HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<List<WorkoutExercise>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<WorkoutExercise>()
            );
            
            // Configure tags as JSON
            entity.Property(e => e.Tags).HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<string>()
            );
        });

        // Configure Exercise entity
        modelBuilder.Entity<Exercise>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Category).IsRequired().HasMaxLength(100);
            
            // Configure muscle groups as JSON
            entity.Property(e => e.MuscleGroups).HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<string>()
            );
            
            // Configure equipment as JSON
            entity.Property(e => e.Equipment).HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<string>()
            );
        });

        // Configure ExerciseLog entity
        modelBuilder.Entity<ExerciseLog>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.UserId).IsRequired();
            entity.Property(e => e.ExerciseId).IsRequired();
            
            // Configure sets as JSON
            entity.Property(e => e.Sets).HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<List<ExerciseSet>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<ExerciseSet>()
            );
        });

        // Configure Food entity
        modelBuilder.Entity<Food>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Brand).HasMaxLength(100);
            
            // Configure nutrition as JSON
            entity.OwnsOne(e => e.Nutrition, nutrition =>
            {
                nutrition.ToJson();
            });
        });

        // Configure Recipe entity
        modelBuilder.Entity<Recipe>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.UserId).IsRequired();
            
            // Configure ingredients as JSON
            entity.Property(e => e.Ingredients).HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<List<RecipeIngredient>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<RecipeIngredient>()
            );
            
            // Configure instructions as JSON
            entity.Property(e => e.Instructions).HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<string>()
            );
            
            // Configure tags as JSON
            entity.Property(e => e.Tags).HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<string>()
            );
            
            // Configure nutrition as JSON
            entity.OwnsOne(e => e.Nutrition, nutrition =>
            {
                nutrition.ToJson();
            });
        });        // Configure MealLog entity
        modelBuilder.Entity<MealLog>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.UserId).IsRequired();
            entity.Property(e => e.MealType).IsRequired().HasMaxLength(50);
            
            // Configure foods as JSON
            entity.Property(e => e.Foods).HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<List<FoodEntry>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<FoodEntry>()
            );
            
            // Configure nutrition as JSON
            entity.OwnsOne(e => e.Nutrition, nutrition =>
            {
                nutrition.ToJson();
            });
        });        // Configure ProgressLog entity
        modelBuilder.Entity<SharedModels.ProgressLog>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.UserId).IsRequired();
            
            // Configure custom metrics as JSON
            entity.Property(e => e.CustomMetrics).HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new Dictionary<string, object>()
            );            // Configure legacy measurements as JSON for backward compatibility
            entity.Property(e => e.Measurements).HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new Dictionary<string, object>()
            );
        });// Configure Goal entity
        modelBuilder.Entity<SharedModels.Goal>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.UserId).IsRequired();
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Category).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Unit).IsRequired().HasMaxLength(50);
        });// Configure NotificationHistory entity
        modelBuilder.Entity<SharedModels.NotificationHistory>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.UserId).IsRequired();
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Type).IsRequired().HasMaxLength(50);
            
            // Configure data as JSON
            entity.Property(e => e.Data).HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new Dictionary<string, string>()
            );
        });

        // Configure NotificationSettings entity
        modelBuilder.Entity<SharedModels.NotificationSettings>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.UserId).IsRequired();
            entity.HasIndex(e => e.UserId).IsUnique();
            
            // Configure preferred times as JSON
            entity.Property(e => e.PreferredWorkoutTimes).HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<string>()
            );
            
            entity.Property(e => e.PreferredMealTimes).HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<string>()
            );
        });// Configure NotificationTemplate entity
        modelBuilder.Entity<SharedModels.NotificationTemplate>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Type).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            
            // Configure variables as JSON
            entity.Property(e => e.Variables).HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new Dictionary<string, object>()
            );
        });

        // Configure ScheduledNotification entity
        modelBuilder.Entity<ScheduledNotification>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.UserId).IsRequired();
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Type).IsRequired().HasMaxLength(50);
            
            // Configure data as JSON
            entity.Property(e => e.Data).HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new Dictionary<string, string>()
            );        });

        // Configure NutritionLog entity
        modelBuilder.Entity<NutritionLog>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.UserId).IsRequired();
            
            // Configure Totals as owned entity (JSON)
            entity.OwnsOne(e => e.Totals, totals =>
            {
                totals.ToJson();
            });
            
            // Configure Goals as owned entity (JSON)
            entity.OwnsOne(e => e.Goals, goals =>
            {
                goals.ToJson();
            });        });

        // Configure BodyMetrics entity
        modelBuilder.Entity<SharedModels.BodyMetrics>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.UserId).IsRequired();
            
            // Configure Measurements as JSON
            entity.Property(e => e.Measurements).HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new Dictionary<string, object>()
            );        });

        // Configure Notification entity
        modelBuilder.Entity<SharedModels.Notification>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.UserId).IsRequired();
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Message).IsRequired();
            entity.Property(e => e.Type).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Category).IsRequired().HasMaxLength(50);
            
            // Configure Data as JSON
            entity.Property(e => e.Data).HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new Dictionary<string, object>()            );        });

        // Configure WorkoutLog entity
        modelBuilder.Entity<SharedModels.WorkoutLog>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.UserId).IsRequired();
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            
            // Configure Exercises as JSON
            entity.Property(e => e.Exercises).HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<List<SharedModels.ExerciseLogItem>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<SharedModels.ExerciseLogItem>()
            );
        });

        // Configure ScheduledNotification entity
        modelBuilder.Entity<SharedModels.ScheduledNotification>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.UserId).IsRequired();
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Type).IsRequired().HasMaxLength(50);
            
            // Configure data as JSON
            entity.Property(e => e.Data).HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new Dictionary<string, string>()
            );        });        // Configure UserDevice entity
        modelBuilder.Entity<SharedModels.UserDevice>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.UserId).IsRequired();
            entity.Property(e => e.DeviceToken).IsRequired().HasMaxLength(500);
            entity.Property(e => e.Platform).IsRequired().HasMaxLength(20);
            entity.Property(e => e.DeviceName).HasMaxLength(100);
            entity.HasIndex(e => new { e.UserId, e.DeviceToken }).IsUnique();
        });

        // Configure ClientLog entity
        modelBuilder.Entity<ClientLog>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Timestamp).IsRequired();
            entity.Property(e => e.Level).IsRequired().HasMaxLength(20);
            entity.Property(e => e.Message).IsRequired().HasMaxLength(500);
            entity.Property(e => e.Component).HasMaxLength(100);
            entity.Property(e => e.Action).HasMaxLength(100);
            entity.Property(e => e.UserAgent).HasMaxLength(200);
            entity.Property(e => e.Url).HasMaxLength(500);
            entity.Property(e => e.UserId).HasMaxLength(50);
            entity.Property(e => e.SessionId).HasMaxLength(100);
            entity.Property(e => e.IpAddress).HasMaxLength(45);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            
            // Index for better query performance
            entity.HasIndex(e => e.Timestamp);
            entity.HasIndex(e => e.Level);
            entity.HasIndex(e => e.Component);
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.CreatedAt);
        });

        // Configure SharedModels.Food entity - configure NutritionPer100g as owned entity
        modelBuilder.Entity<SharedModels.Food>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Brand).HasMaxLength(100);
            
            // Configure NutritionPer100g as owned entity with dictionary properties
            entity.OwnsOne(e => e.NutritionPer100g, nutrition =>
            {
                nutrition.Property(n => n.Vitamins).HasConversion(
                    v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                    v => System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, decimal>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new Dictionary<string, decimal>()
                );
                nutrition.Property(n => n.Minerals).HasConversion(
                    v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                    v => System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, decimal>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new Dictionary<string, decimal>()
                );
            });
            
            // Configure allergens as JSON
            entity.Property(e => e.Allergens).HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<string>()
            );
        });        // Configure SharedModels.Recipe entity
        modelBuilder.Entity<SharedModels.Recipe>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.UserId).IsRequired();
            
            // Configure ingredients as JSON
            entity.Property(e => e.Ingredients).HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<List<SharedModels.RecipeIngredient>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<SharedModels.RecipeIngredient>()
            );
            
            // Configure instructions as JSON
            entity.Property(e => e.Instructions).HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<string>()
            );
            
            // Configure tags as JSON
            entity.Property(e => e.Tags).HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<string>()
            );
            
            // Configure nutrition info as owned entity with dictionary properties
            entity.OwnsOne(e => e.NutritionPerServing, nutrition =>
            {
                nutrition.Property(n => n.Vitamins).HasConversion(
                    v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                    v => System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, decimal>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new Dictionary<string, decimal>()
                );
                nutrition.Property(n => n.Minerals).HasConversion(
                    v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                    v => System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, decimal>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new Dictionary<string, decimal>()
                );
            });
            
            // Configure NutritionInfo property as owned entity with dictionary properties
            entity.OwnsOne(e => e.NutritionInfo, nutrition =>
            {
                nutrition.Property(n => n.Vitamins).HasConversion(
                    v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                    v => System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, decimal>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new Dictionary<string, decimal>()
                );
                nutrition.Property(n => n.Minerals).HasConversion(
                    v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                    v => System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, decimal>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new Dictionary<string, decimal>()
                );
            });
        });// Configure SharedModels.MealLog entity
        modelBuilder.Entity<SharedModels.MealLog>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.UserId).IsRequired();
            entity.Property(e => e.MealType).IsRequired().HasMaxLength(50);
            
            // Configure Items as JSON
            entity.Property(e => e.Items).HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<List<SharedModels.MealItem>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<SharedModels.MealItem>()
            );
            
            // Configure nutrition info as owned entity with dictionary properties
            entity.OwnsOne(e => e.NutritionInfo, nutrition =>
            {
                nutrition.Property(n => n.Vitamins).HasConversion(
                    v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                    v => System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, decimal>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new Dictionary<string, decimal>()
                );
                nutrition.Property(n => n.Minerals).HasConversion(
                    v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                    v => System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, decimal>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new Dictionary<string, decimal>()
                );
            });
        });        // Configure MealItem to ignore navigation properties since it's stored as JSON
        modelBuilder.Entity<SharedModels.MealItem>(entity =>
        {
            entity.HasNoKey(); // MealItem is not a standalone entity
            entity.Ignore(e => e.Nutrition); // Ignore the Nutrition navigation property
        });        // Configure PlannedMeal to ignore navigation properties since it's stored as JSON
        modelBuilder.Entity<SharedModels.PlannedMeal>(entity =>
        {
            entity.HasNoKey(); // PlannedMeal is not a standalone entity
            entity.Ignore(e => e.Items); // Ignore the Items navigation property
            entity.Ignore(e => e.PlannedNutrition); // Ignore the PlannedNutrition navigation property
        });        // Configure MealPlan entity
        modelBuilder.Entity<SharedModels.MealPlan>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.UserId).IsRequired();
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            
            // Configure Meals as JSON
            entity.Property(e => e.Meals).HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<List<SharedModels.PlannedMeal>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<SharedModels.PlannedMeal>()
            );
            
            // Configure DailyTargets as owned entity
            entity.OwnsOne(e => e.DailyTargets);
        });

        // Seed data
        SeedData(modelBuilder);
    }

    private void SeedData(ModelBuilder modelBuilder)
    {
        // Seed exercises
        var exercises = new List<Exercise>
        {
            new Exercise
            {
                Id = Guid.NewGuid().ToString(),
                Name = "Push-up",
                Description = "A bodyweight exercise that targets chest, shoulders, and triceps",
                Category = "Bodyweight",
                MuscleGroups = new List<string> { "Chest", "Shoulders", "Triceps" },
                Equipment = new List<string>(),
                Difficulty = "beginner",
                Instructions = new List<string>
                {
                    "Start in a plank position with hands shoulder-width apart",
                    "Lower your body until chest nearly touches the floor",
                    "Push back up to starting position"
                },
                VideoUrl = "",
                ImageUrl = ""
            },
            new Exercise
            {
                Id = Guid.NewGuid().ToString(),
                Name = "Squat",
                Description = "A fundamental lower body exercise",
                Category = "Bodyweight",
                MuscleGroups = new List<string> { "Quadriceps", "Glutes", "Hamstrings" },
                Equipment = new List<string>(),
                Difficulty = "beginner",
                Instructions = new List<string>
                {
                    "Stand with feet shoulder-width apart",
                    "Lower your body as if sitting back into a chair",
                    "Return to standing position"
                },
                VideoUrl = "",
                ImageUrl = ""
            }
        };        modelBuilder.Entity<Exercise>().HasData(exercises);

        // Note: Seed data for entities with JSON properties (like Food) is not supported in EF Core
        // Food seed data should be added through data seeding services or initial setup scripts
    }
}
