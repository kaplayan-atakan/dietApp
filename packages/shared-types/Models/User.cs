using System.ComponentModel.DataAnnotations;

namespace AiFitnessCoach.Shared.Models
{    public class User
    {
        public string Id { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; } = string.Empty;
        public decimal Height { get; set; } // in cm
        public decimal Weight { get; set; } // in kg
        public string ActivityLevel { get; set; } = string.Empty;
        public List<string> Goals { get; set; } = new();
        public List<string> DietaryRestrictions { get; set; } = new();
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        
        // Additional properties for compatibility
        public string Name => $"{FirstName} {LastName}".Trim();
        public string? Avatar { get; set; }
        public DateTime? LastLoginDate { get; set; }
        public bool IsEmailVerified { get; set; }
        public string Password { get; set; } = string.Empty; // For API compatibility
    }

    public class UserGoals
    {
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public decimal TargetWeight { get; set; }
        public decimal WeeklyWorkouts { get; set; }
        public decimal DailyCalories { get; set; } // Already present
        public decimal DailyProteinGoal { get; set; } // Added
        public decimal DailyCarbGoal { get; set; }    // Added
        public decimal DailyFatGoal { get; set; }      // Added
        public bool IsActive { get; set; } // Added IsActive
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
