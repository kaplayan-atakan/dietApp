using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AiFitnessCoach.API.Services;
using AiFitnessCoach.Shared.Models;
using AiFitnessCoach.Shared.DTOs;

namespace AiFitnessCoach.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NutritionController : ControllerBase
    {
        private readonly INutritionService _nutritionService;
        private readonly ILogger<NutritionController> _logger;

        public NutritionController(INutritionService nutritionService, ILogger<NutritionController> logger)
        {
            _nutritionService = nutritionService;
            _logger = logger;
        }

        // Food Management
        [HttpGet("foods/search")]
        public async Task<ActionResult<List<Food>>> SearchFoods([FromQuery] string query, [FromQuery] int limit = 20)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(query))
                {
                    return BadRequest("Search query is required");
                }

                var foods = await _nutritionService.SearchFoodsAsync(query, limit);
                return Ok(foods);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to search foods with query: {Query}", query);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("foods/{foodId}")]
        public async Task<ActionResult<Food>> GetFood(string foodId)
        {
            try
            {
                var food = await _nutritionService.GetFoodAsync(foodId);
                if (food == null)
                {
                    return NotFound();
                }

                return Ok(food);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get food {FoodId}", foodId);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("foods/favorites")]
        public async Task<ActionResult<List<Food>>> GetFavoriteFoods()
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var foods = await _nutritionService.GetFavoriteFoodsAsync(userId);
                return Ok(foods);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get favorite foods");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        // Recipe Management
        [HttpGet("recipes")]
        public async Task<ActionResult<List<Recipe>>> GetRecipes()
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var recipes = await _nutritionService.GetUserRecipesAsync(userId);
                return Ok(recipes);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get recipes for user");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPost("recipes")]
        public async Task<ActionResult<Recipe>> CreateRecipe([FromBody] CreateRecipeRequest request)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var recipe = await _nutritionService.CreateRecipeAsync(userId, request);
                return CreatedAtAction(nameof(GetRecipe), new { recipeId = recipe.Id }, recipe);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create recipe");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("recipes/{recipeId}")]
        public async Task<ActionResult<Recipe>> GetRecipe(string recipeId)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var recipe = await _nutritionService.GetRecipeAsync(recipeId, userId);
                if (recipe == null)
                {
                    return NotFound();
                }

                return Ok(recipe);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get recipe {RecipeId}", recipeId);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpDelete("recipes/{recipeId}")]
        public async Task<ActionResult> DeleteRecipe(string recipeId)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var deleted = await _nutritionService.DeleteRecipeAsync(recipeId, userId);
                if (!deleted)
                {
                    return NotFound();
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to delete recipe {RecipeId}", recipeId);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        // Meal Planning
        [HttpGet("meal-plans")]
        public async Task<ActionResult<List<MealPlan>>> GetMealPlans()
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var mealPlans = await _nutritionService.GetUserMealPlansAsync(userId);
                return Ok(mealPlans);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get meal plans for user");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPost("meal-plans")]
        public async Task<ActionResult<MealPlan>> CreateMealPlan([FromBody] CreateMealPlanRequest request)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var mealPlan = await _nutritionService.CreateMealPlanAsync(userId, request);
                return CreatedAtAction(nameof(GetMealPlan), new { planId = mealPlan.Id }, mealPlan);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create meal plan");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("meal-plans/{planId}")]
        public async Task<ActionResult<MealPlan>> GetMealPlan(string planId)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var mealPlan = await _nutritionService.GetMealPlanAsync(planId, userId);
                if (mealPlan == null)
                {
                    return NotFound();
                }

                return Ok(mealPlan);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get meal plan {PlanId}", planId);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        // Meal Logging
        [HttpGet("meals/daily")]
        public async Task<ActionResult<List<MealLog>>> GetDailyMeals([FromQuery] DateTime? date)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var targetDate = date ?? DateTime.UtcNow.Date;
                var meals = await _nutritionService.GetDailyMealLogsAsync(userId, targetDate);
                return Ok(meals);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get daily meals");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPost("meals/log")]
        public async Task<ActionResult<MealLog>> LogMeal([FromBody] LogMealRequest request)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var mealLog = await _nutritionService.LogMealAsync(userId, request);
                return CreatedAtAction(nameof(GetDailyMeals), null, mealLog);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to log meal");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPut("meals/{logId}")]
        public async Task<ActionResult<MealLog>> UpdateMealLog(string logId, [FromBody] UpdateMealLogRequest request)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var mealLog = await _nutritionService.UpdateMealLogAsync(logId, userId, request);
                if (mealLog == null)
                {
                    return NotFound();
                }

                return Ok(mealLog);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to update meal log {LogId}", logId);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpDelete("meals/{logId}")]
        public async Task<ActionResult> DeleteMealLog(string logId)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var deleted = await _nutritionService.DeleteMealLogAsync(logId, userId);
                if (!deleted)
                {
                    return NotFound();
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to delete meal log {LogId}", logId);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        // Nutrition Analysis
        [HttpGet("summary/daily")]
        public async Task<ActionResult<NutritionSummary>> GetDailyNutritionSummary([FromQuery] DateTime? date)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var targetDate = date ?? DateTime.UtcNow.Date;
                var summary = await _nutritionService.GetDailyNutritionSummaryAsync(userId, targetDate);
                return Ok(summary);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get daily nutrition summary");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("trends")]
        public async Task<ActionResult<NutritionTrends>> GetNutritionTrends([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var trends = await _nutritionService.GetNutritionTrendsAsync(userId, startDate, endDate);
                return Ok(trends);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get nutrition trends");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("recommendations")]
        public async Task<ActionResult<List<NutritionRecommendation>>> GetRecommendations()
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var recommendations = await _nutritionService.GetNutritionRecommendationsAsync(userId);
                return Ok(recommendations);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get nutrition recommendations");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("meals/recent")]
        public async Task<ActionResult<List<MealLog>>> GetRecentMeals([FromQuery] int limit = 10)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var meals = await _nutritionService.GetRecentMealsAsync(userId, limit);
                return Ok(meals);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get recent meals");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }
}
