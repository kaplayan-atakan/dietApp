using System.ComponentModel.DataAnnotations;

namespace AiFitnessCoach.Shared.Models
{
    public class Food
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public string Barcode { get; set; } = string.Empty;
        public NutritionInfo NutritionPer100g { get; set; } = new();
        public string ServingSize { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public List<string> Allergens { get; set; } = new();
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class Recipe
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<RecipeIngredient> Ingredients { get; set; } = new();
        public List<string> Instructions { get; set; } = new();
        public int PrepTime { get; set; } // in minutes
        public int CookTime { get; set; } // in minutes
        public int Servings { get; set; }
        public string Difficulty { get; set; } = string.Empty;
        public List<string> Tags { get; set; } = new();
        public NutritionInfo NutritionPerServing { get; set; } = new();
        public string? ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        
        // Additional properties for API compatibility
        public string UserId { get; set; } = string.Empty;
        public NutritionInfo NutritionInfo { get; set; } = new();
    }

    public class RecipeIngredient
    {
        public string FoodId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Unit { get; set; } = string.Empty;
        public string? Notes { get; set; }
    }

    public class MealPlan
    {
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public List<PlannedMeal> Meals { get; set; } = new();
        public NutritionGoals DailyTargets { get; set; } = new();
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        
        // Additional properties for API compatibility
        public string Description { get; set; } = string.Empty;
    }

    public class PlannedMeal
    {
        public string Id { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string MealType { get; set; } = string.Empty; // breakfast, lunch, dinner, snack
        public string? RecipeId { get; set; }
        public string? RecipeName { get; set; }
        public List<MealItem> Items { get; set; } = new();
        public NutritionInfo PlannedNutrition { get; set; } = new();
    }

    public class MealItem
    {
        public string FoodId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Unit { get; set; } = string.Empty;
        public NutritionInfo Nutrition { get; set; } = new();
    }

    public class MealLog
    {
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public DateTime LogDate { get; set; }
        public string MealType { get; set; } = string.Empty;
        public List<MealItem> Items { get; set; } = new();
        public NutritionInfo NutritionInfo { get; set; } = new(); // Contains detailed nutrition
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        
        // Additional properties for API compatibility
        public DateTime LoggedAt { get; set; }
        public string? FoodId { get; set; }
        public string? RecipeId { get; set; }
        public decimal Quantity { get; set; }
        public string Unit { get; set; } = string.Empty;
        public decimal TotalCalories // Added to match usage in DashboardService
        {
            get { return NutritionInfo?.Calories ?? 0; } 
            set { if (NutritionInfo != null) NutritionInfo.Calories = value; }
        }
    }

    public class NutritionInfo
    {
        public decimal Calories { get; set; }
        public decimal Protein { get; set; } // in grams
        public decimal Carbohydrates { get; set; } // in grams
        public decimal Fat { get; set; } // in grams
        public decimal Fiber { get; set; } // in grams
        public decimal Sugar { get; set; } // in grams
        public decimal Sodium { get; set; } // in mg
        public Dictionary<string, decimal> Vitamins { get; set; } = new();
        public Dictionary<string, decimal> Minerals { get; set; } = new();
    }

    public class NutritionGoals
    {
        public string UserId { get; set; } = string.Empty;
        public decimal CalorieGoal { get; set; }
        public decimal ProteinGoal { get; set; }
        public decimal CarbGoal { get; set; }
        public decimal FatGoal { get; set; }
        public decimal FiberGoal { get; set; }
        public decimal SodiumLimit { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class NutritionSummary
    {
        public string UserId { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public decimal TotalCalories { get; set; }
        public decimal TotalProtein { get; set; }
        public decimal TotalCarbs { get; set; } // Retained for potential direct use
        public decimal TotalFat { get; set; }
        public decimal TotalFiber { get; set; }
        public decimal TotalSodium { get; set; }
        public decimal CalorieGoal { get; set; }
        public decimal ProteinGoal { get; set; }
        public decimal CarbGoal { get; set; } // Retained for potential direct use
        public decimal FatGoal { get; set; }
        public List<MealLog> Meals { get; set; } = new();
        
        // Additional properties for API compatibility
        public decimal TotalCarbohydrates { get; set; } // This is used by the service
        public Dictionary<string, decimal> MealBreakdown { get; set; } = new(); // Changed from List<object>
    }

    public class NutritionTrends
    {
        public string UserId { get; set; } = string.Empty;
        public List<DailyNutritionData> DailyData { get; set; } = new(); // Changed from List<DailyNutrition>
        public decimal AverageCalories { get; set; }
        public decimal AverageProtein { get; set; }
        public decimal AverageCarbs { get; set; }
        public decimal AverageFat { get; set; }
        public string TrendDirection { get; set; } = string.Empty;
        
        // Additional properties for API compatibility
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }

    public class DailyNutrition
    {
        public DateTime Date { get; set; }
        public decimal Calories { get; set; }
        public decimal Protein { get; set; }
        public decimal Carbs { get; set; }
        public decimal Fat { get; set; }
    }

    public class DailyNutritionData
    {
        public DateTime Date { get; set; }
        public decimal Calories { get; set; }
        public decimal Protein { get; set; }
        public decimal Carbs { get; set; }
        public decimal Fat { get; set; }
        public decimal Fiber { get; set; }
        public decimal Sodium { get; set; }
        
        // Additional properties for API compatibility
        public decimal Carbohydrates { get; set; }
    }

    public class NutritionRecommendation
    {
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // food, meal, supplement
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty; // Renamed from Message for clarity if Message is API specific
        public string Reason { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty; // Changed from decimal to string
        public DateTime CreatedAt { get; set; }
        
        // Additional properties for API compatibility
        public string Message { get; set; } = string.Empty; // Kept if it's specifically for API response
    }
}
