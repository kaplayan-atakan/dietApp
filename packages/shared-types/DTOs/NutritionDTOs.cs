using System.ComponentModel.DataAnnotations;

namespace AiFitnessCoach.Shared.DTOs
{
    // Nutrition DTOs
    public class CreateFoodRequest
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(100)]
        public string Brand { get; set; } = string.Empty;

        public string Barcode { get; set; } = string.Empty;

        [Required]
        public CreateNutritionInfoRequest NutritionPer100g { get; set; } = new();

        [Required]
        public string ServingSize { get; set; } = string.Empty;

        [Required]
        public string Category { get; set; } = string.Empty;

        public List<string> Allergens { get; set; } = new();
    }

    public class CreateNutritionInfoRequest
    {
        [Range(0, 10000)]
        public decimal Calories { get; set; }

        [Range(0, 1000)]
        public decimal Protein { get; set; }

        [Range(0, 1000)]
        public decimal Carbohydrates { get; set; }

        [Range(0, 1000)]
        public decimal Fat { get; set; }

        [Range(0, 1000)]
        public decimal Fiber { get; set; }

        [Range(0, 1000)]
        public decimal Sugar { get; set; }

        [Range(0, 10000)]
        public decimal Sodium { get; set; }

        public Dictionary<string, decimal> Vitamins { get; set; } = new();
        public Dictionary<string, decimal> Minerals { get; set; } = new();
    }    public class CreateRecipeRequest
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;

        [Required]
        public List<CreateRecipeIngredientRequest> Ingredients { get; set; } = new();

        [Required]
        public List<string> Instructions { get; set; } = new();

        [Range(1, 600)]
        public int PrepTime { get; set; }

        [Range(0, 600)]
        public int CookTime { get; set; }

        [Range(1, 20)]
        public int Servings { get; set; }

        [Required]
        public string Difficulty { get; set; } = string.Empty;

        public List<string> Tags { get; set; } = new();
        public string? ImageUrl { get; set; }
        public CreateNutritionInfoRequest? NutritionInfo { get; set; }
    }

    public class CreateRecipeIngredientRequest
    {
        [Required]
        public string FoodId { get; set; } = string.Empty;

        [Required]
        public string Name { get; set; } = string.Empty;

        [Range(0.1, 10000)]
        public decimal Amount { get; set; }

        [Required]
        public string Unit { get; set; } = string.Empty;

        public string? Notes { get; set; }
    }    public class CreateMealPlanRequest
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        public List<CreatePlannedMealRequest> Meals { get; set; } = new();

        [Required]
        public CreateNutritionGoalsRequest DailyTargets { get; set; } = new();
    }

    public class CreatePlannedMealRequest
    {
        [Required]
        public DateTime Date { get; set; }

        [Required]
        public string MealType { get; set; } = string.Empty;

        public string? RecipeId { get; set; }
        public string? RecipeName { get; set; }
        public List<CreateMealItemRequest> Items { get; set; } = new();
    }

    public class CreateMealItemRequest
    {
        [Required]
        public string FoodId { get; set; } = string.Empty;

        [Required]
        public string Name { get; set; } = string.Empty;

        [Range(0.1, 10000)]
        public decimal Amount { get; set; }

        [Required]
        public string Unit { get; set; } = string.Empty;
    }

    public class CreateNutritionGoalsRequest
    {
        [Range(800, 5000)]
        public decimal CalorieGoal { get; set; }

        [Range(10, 500)]
        public decimal ProteinGoal { get; set; }

        [Range(50, 1000)]
        public decimal CarbGoal { get; set; }

        [Range(20, 300)]
        public decimal FatGoal { get; set; }

        [Range(10, 100)]
        public decimal FiberGoal { get; set; }

        [Range(0, 5000)]
        public decimal SodiumLimit { get; set; }
    }    public class LogMealRequest
    {
        public DateTime LoggedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public string MealType { get; set; } = string.Empty;

        // Support for individual food/recipe logging
        public string? FoodId { get; set; }
        public string? RecipeId { get; set; }
        public decimal? Quantity { get; set; }
        public string? Unit { get; set; }
        public CreateNutritionInfoRequest? NutritionInfo { get; set; }

        [Required]
        public List<CreateMealItemRequest> Items { get; set; } = new();

        public string? Notes { get; set; }
    }    public class UpdateMealLogRequest
    {
        public string? MealType { get; set; }
        public List<CreateMealItemRequest>? Items { get; set; }
        public decimal? Quantity { get; set; }
        public string? Unit { get; set; }
        public CreateNutritionInfoRequest? NutritionInfo { get; set; }
        public string? Notes { get; set; }
    }

    public class FoodSearchRequest
    {
        [Required]
        [MinLength(2)]
        public string Query { get; set; } = string.Empty;

        [Range(1, 100)]
        public int Limit { get; set; } = 10;

        public string? Category { get; set; }
    }

    public class UpdateMealPlanRequest
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        [Required]
        public List<UpdatePlannedMealRequest> Meals { get; set; } = new();
    }

    public class UpdatePlannedMealRequest
    {
        [Required]
        public DateTime Date { get; set; } // Added Date

        [Required]
        public string MealType { get; set; } = string.Empty; // breakfast, lunch, dinner, snack

        [Required]
        public List<UpdateMealItemRequest> Items { get; set; } = new();
    }

    public class UpdateMealItemRequest
    {
        [Required]
        public string FoodId { get; set; } = string.Empty;

        [Required] // Added Name
        public string Name { get; set; } = string.Empty;

        [Range(0.1, 10000)] // Changed from 0.1, 10 to match CreateMealItemRequest and allow larger quantities
        public decimal Quantity { get; set; }

        [Required]
        public string Unit { get; set; } = string.Empty;
    }
}
