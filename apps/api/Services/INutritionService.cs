using AiFitnessCoach.Shared.Models;
using AiFitnessCoach.Shared.DTOs;

namespace AiFitnessCoach.API.Services
{
    public interface INutritionService
    {
        // Food and Recipe Management
        Task<List<Food>> SearchFoodsAsync(string query, int limit = 20);
        Task<Food?> GetFoodAsync(string foodId); // Changed to Food?
        Task<List<Recipe>> GetUserRecipesAsync(string userId);
        Task<Recipe> CreateRecipeAsync(string userId, CreateRecipeRequest request);
        Task<Recipe?> GetRecipeAsync(string recipeId, string userId); // Changed to Recipe?
        Task<bool> DeleteRecipeAsync(string recipeId, string userId);

        // Meal Planning
        Task<List<MealPlan>> GetUserMealPlansAsync(string userId);
        Task<MealPlan> CreateMealPlanAsync(string userId, CreateMealPlanRequest request);
        Task<MealPlan?> GetMealPlanAsync(string planId, string userId); // Changed to MealPlan?
        Task<MealPlan?> UpdateMealPlanAsync(string planId, string userId, UpdateMealPlanRequest request); // Changed to MealPlan?
        Task<bool> DeleteMealPlanAsync(string planId, string userId);

        // Meal Logging
        Task<List<MealLog>> GetDailyMealLogsAsync(string userId, DateTime date);
        Task<MealLog> LogMealAsync(string userId, LogMealRequest request);
        Task<MealLog?> UpdateMealLogAsync(string logId, string userId, UpdateMealLogRequest request); // Changed to MealLog?
        Task<bool> DeleteMealLogAsync(string logId, string userId);

        // Nutrition Analysis
        Task<NutritionSummary> GetDailyNutritionSummaryAsync(string userId, DateTime date);
        Task<NutritionTrends> GetNutritionTrendsAsync(string userId, DateTime startDate, DateTime endDate);
        Task<List<NutritionRecommendation>> GetNutritionRecommendationsAsync(string userId);        // Quick Actions
        Task<List<Food>> GetFavoriteFoodsAsync(string userId);
        Task<bool> AddFavoriteFoodAsync(string userId, string foodId);
        Task<bool> RemoveFavoriteFoodAsync(string userId, string foodId);
        Task<List<MealLog>> GetRecentMealsAsync(string userId, int limit = 10);
    }
}
