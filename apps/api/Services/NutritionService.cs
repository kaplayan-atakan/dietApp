using Microsoft.EntityFrameworkCore;
using AiFitnessCoach.API.Data;
using AiFitnessCoach.Shared.Models;
using AiFitnessCoach.Shared.DTOs;

namespace AiFitnessCoach.API.Services
{
    public class NutritionService : INutritionService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<NutritionService> _logger;

        public NutritionService(AppDbContext context, ILogger<NutritionService> logger)
        {
            _context = context;
            _logger = logger;
        }

        // Food and Recipe Management
        public async Task<List<Food>> SearchFoodsAsync(string query, int limit = 20)
        {
            return await _context.Foods
                .Where(f => f.Name.Contains(query) || f.Brand.Contains(query))
                .OrderBy(f => f.Name)
                .Take(limit)
                .ToListAsync();
        }

        public async Task<Food?> GetFoodAsync(string foodId) // Changed to Food?
        {
            return await _context.Foods.FindAsync(foodId);
        }

        public async Task<List<Recipe>> GetUserRecipesAsync(string userId)
        {
            return await _context.Recipes
                .Where(r => r.UserId == userId)
                .OrderBy(r => r.Name)
                .ToListAsync();
        }

        public async Task<Recipe> CreateRecipeAsync(string userId, CreateRecipeRequest request)
        {
            var recipe = new Recipe
            {
                Id = Guid.NewGuid().ToString(),
                UserId = userId,
                Name = request.Name,
                Description = request.Description,
                Ingredients = request.Ingredients.Select(i => new RecipeIngredient // Manual mapping
                {
                    FoodId = i.FoodId,
                    Name = i.Name,
                    Amount = i.Amount,
                    Unit = i.Unit,
                    Notes = i.Notes
                }).ToList(),
                Instructions = request.Instructions,
                PrepTime = request.PrepTime,
                CookTime = request.CookTime,
                Servings = request.Servings,
                Tags = request.Tags,
                NutritionInfo = request.NutritionInfo != null ? new NutritionInfo // Manual mapping
                {
                    Calories = request.NutritionInfo.Calories,
                    Protein = request.NutritionInfo.Protein,
                    Carbohydrates = request.NutritionInfo.Carbohydrates,
                    Fat = request.NutritionInfo.Fat,
                    Fiber = request.NutritionInfo.Fiber,
                    Sugar = request.NutritionInfo.Sugar,
                    Sodium = request.NutritionInfo.Sodium,
                    Vitamins = request.NutritionInfo.Vitamins,
                    Minerals = request.NutritionInfo.Minerals
                } : new NutritionInfo(),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync();
            return recipe;
        }

        public async Task<Recipe?> GetRecipeAsync(string recipeId, string userId) // Changed to Recipe?
        {
            return await _context.Recipes
                .FirstOrDefaultAsync(r => r.Id == recipeId && r.UserId == userId);
        }

        public async Task<bool> DeleteRecipeAsync(string recipeId, string userId)
        {
            var recipe = await _context.Recipes
                .FirstOrDefaultAsync(r => r.Id == recipeId && r.UserId == userId);

            if (recipe == null) return false;

            _context.Recipes.Remove(recipe);
            await _context.SaveChangesAsync();
            return true;
        }

        // Meal Planning
        public async Task<List<MealPlan>> GetUserMealPlansAsync(string userId)
        {
            return await _context.MealPlans
                .Where(mp => mp.UserId == userId)
                .OrderBy(mp => mp.StartDate)
                .ToListAsync();
        }

        public async Task<MealPlan> CreateMealPlanAsync(string userId, CreateMealPlanRequest request)
        {
            var mealPlan = new MealPlan
            {
                Id = Guid.NewGuid().ToString(),
                UserId = userId,
                Name = request.Name,
                Description = request.Description,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Meals = request.Meals.Select(m => new PlannedMeal // Manual mapping
                {
                    Date = m.Date,
                    MealType = m.MealType,
                    RecipeId = m.RecipeId,
                    RecipeName = m.RecipeName,
                    Items = m.Items.Select(i => new MealItem
                    {
                        FoodId = i.FoodId,
                        Name = i.Name,
                        Amount = i.Amount,
                        Unit = i.Unit
                        // Nutrition for MealItem can be calculated or fetched if needed
                    }).ToList()
                }).ToList(),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.MealPlans.Add(mealPlan);
            await _context.SaveChangesAsync();
            return mealPlan;
        }

        public async Task<MealPlan?> GetMealPlanAsync(string planId, string userId) // Changed to MealPlan?
        {
            return await _context.MealPlans
                .FirstOrDefaultAsync(mp => mp.Id == planId && mp.UserId == userId);
        }

        public async Task<MealPlan?> UpdateMealPlanAsync(string planId, string userId, UpdateMealPlanRequest request)
        {
            var mealPlan = await _context.MealPlans
                .Include(mp => mp.Meals) 
                .ThenInclude(m => m.Items) 
                .FirstOrDefaultAsync(mp => mp.Id == planId && mp.UserId == userId);

            if (mealPlan == null) return null;

            mealPlan.Name = request.Name ?? mealPlan.Name;
            mealPlan.Description = request.Description ?? mealPlan.Description;
            mealPlan.StartDate = request.StartDate; 
            mealPlan.EndDate = request.EndDate ?? mealPlan.EndDate; 

            mealPlan.Meals.Clear();
            if (request.Meals != null)
            {
                foreach (var mealRequest in request.Meals)
                {
                    var plannedMeal = new PlannedMeal
                    {
                        Date = mealRequest.Date, 
                        MealType = mealRequest.MealType,
                        Items = mealRequest.Items.Select(itemRequest => new MealItem
                        {
                            FoodId = itemRequest.FoodId,
                            Name = itemRequest.Name, 
                            Amount = itemRequest.Quantity, // Corrected from itemRequest.Amount to itemRequest.Quantity
                            Unit = itemRequest.Unit
                        }).ToList()
                    };
                    mealPlan.Meals.Add(plannedMeal);
                }
            }
            
            mealPlan.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return mealPlan;
        }

        public async Task<bool> DeleteMealPlanAsync(string planId, string userId)
        {
            var mealPlan = await _context.MealPlans
                .FirstOrDefaultAsync(mp => mp.Id == planId && mp.UserId == userId);

            if (mealPlan == null) return false;

            _context.MealPlans.Remove(mealPlan);
            await _context.SaveChangesAsync();
            return true;
        }

        // Meal Logging
        public async Task<List<MealLog>> GetDailyMealLogsAsync(string userId, DateTime date)
        {
            var startDate = date.Date;
            var endDate = startDate.AddDays(1);

            return await _context.MealLogs
                .Where(ml => ml.UserId == userId && ml.LoggedAt >= startDate && ml.LoggedAt < endDate)
                .OrderBy(ml => ml.LoggedAt)
                .ToListAsync();
        }

        public async Task<MealLog> LogMealAsync(string userId, LogMealRequest request)
        {
            var mealLog = new MealLog
            {
                Id = Guid.NewGuid().ToString(),
                UserId = userId,
                FoodId = request.FoodId,
                RecipeId = request.RecipeId,
                MealType = request.MealType,
                Quantity = request.Quantity ?? 0, 
                Unit = request.Unit ?? string.Empty, 
                NutritionInfo = request.NutritionInfo != null ? new NutritionInfo 
                {
                    Calories = request.NutritionInfo.Calories,
                    Protein = request.NutritionInfo.Protein,
                    Carbohydrates = request.NutritionInfo.Carbohydrates,
                    Fat = request.NutritionInfo.Fat,
                    Fiber = request.NutritionInfo.Fiber,
                    Sugar = request.NutritionInfo.Sugar,
                    Sodium = request.NutritionInfo.Sodium,
                    Vitamins = request.NutritionInfo.Vitamins,
                    Minerals = request.NutritionInfo.Minerals
                } : new NutritionInfo(),
                LoggedAt = request.LoggedAt, 
                CreatedAt = DateTime.UtcNow
            };

            _context.MealLogs.Add(mealLog);
            await _context.SaveChangesAsync();
            return mealLog;
        }

        public async Task<MealLog?> UpdateMealLogAsync(string logId, string userId, UpdateMealLogRequest request) // Changed to MealLog?
        {
            var mealLog = await _context.MealLogs
                .FirstOrDefaultAsync(ml => ml.Id == logId && ml.UserId == userId);

            if (mealLog == null) return null;

            mealLog.Quantity = request.Quantity ?? mealLog.Quantity;
            mealLog.Unit = request.Unit ?? mealLog.Unit;
            
            if (request.NutritionInfo != null) 
            {
                mealLog.NutritionInfo.Calories = request.NutritionInfo.Calories;
                mealLog.NutritionInfo.Protein = request.NutritionInfo.Protein;
                mealLog.NutritionInfo.Carbohydrates = request.NutritionInfo.Carbohydrates;
                mealLog.NutritionInfo.Fat = request.NutritionInfo.Fat;
                mealLog.NutritionInfo.Fiber = request.NutritionInfo.Fiber;
                mealLog.NutritionInfo.Sugar = request.NutritionInfo.Sugar;
                mealLog.NutritionInfo.Sodium = request.NutritionInfo.Sodium;
                mealLog.NutritionInfo.Vitamins = request.NutritionInfo.Vitamins ?? mealLog.NutritionInfo.Vitamins;
                mealLog.NutritionInfo.Minerals = request.NutritionInfo.Minerals ?? mealLog.NutritionInfo.Minerals;
            }
            
            mealLog.MealType = request.MealType ?? mealLog.MealType;

            await _context.SaveChangesAsync();
            return mealLog;
        }

        public async Task<bool> DeleteMealLogAsync(string logId, string userId)
        {
            var mealLog = await _context.MealLogs
                .FirstOrDefaultAsync(ml => ml.Id == logId && ml.UserId == userId);

            if (mealLog == null) return false;

            _context.MealLogs.Remove(mealLog);
            await _context.SaveChangesAsync();
            return true;
        }

        // Nutrition Analysis
        public async Task<NutritionSummary> GetDailyNutritionSummaryAsync(string userId, DateTime date)
        {
            var mealLogs = await GetDailyMealLogsAsync(userId, date);
            
            var totalCalories = mealLogs.Sum(ml => ml.NutritionInfo?.Calories ?? 0);
            var totalProtein = mealLogs.Sum(ml => ml.NutritionInfo?.Protein ?? 0);
            var totalCarbs = mealLogs.Sum(ml => ml.NutritionInfo?.Carbohydrates ?? 0);
            var totalFat = mealLogs.Sum(ml => ml.NutritionInfo?.Fat ?? 0);
            var totalFiber = mealLogs.Sum(ml => ml.NutritionInfo?.Fiber ?? 0);

            // Get user goals for comparison
            var user = await _context.Users.FindAsync(userId);
            var userGoals = await _context.UserGoals
                .FirstOrDefaultAsync(ug => ug.UserId == userId && ug.IsActive);

            return new NutritionSummary
            {
                Date = date,
                TotalCalories = totalCalories,
                TotalProtein = totalProtein,
                TotalCarbohydrates = totalCarbs, // Corrected: TotalCarbohydrates is the correct property name
                TotalFat = totalFat,
                TotalFiber = totalFiber,
                CalorieGoal = userGoals?.DailyCalories ?? 2000, // Corrected: UserGoals.DailyCalories
                ProteinGoal = userGoals?.DailyProteinGoal ?? 150,
                CarbGoal = userGoals?.DailyCarbGoal ?? 250,
                FatGoal = userGoals?.DailyFatGoal ?? 65,
                MealBreakdown = mealLogs.GroupBy(ml => ml.MealType)
                    .ToDictionary(g => g.Key ?? "Unknown", g => g.Sum(ml => ml.NutritionInfo?.Calories ?? 0)) 
            };
        }

        public async Task<NutritionTrends> GetNutritionTrendsAsync(string userId, DateTime startDate, DateTime endDate)
        {
            var mealLogs = await _context.MealLogs
                .Where(ml => ml.UserId == userId && ml.LoggedAt >= startDate && ml.LoggedAt <= endDate)
                .ToListAsync();

            var dailyData = mealLogs
                .GroupBy(ml => ml.LoggedAt.Date)
                .Select(g => new DailyNutritionData 
                {
                    Date = g.Key,
                    Calories = g.Sum(ml => ml.NutritionInfo?.Calories ?? 0),
                    Protein = g.Sum(ml => ml.NutritionInfo?.Protein ?? 0),
                    Carbohydrates = g.Sum(ml => ml.NutritionInfo?.Carbohydrates ?? 0),
                    Fat = g.Sum(ml => ml.NutritionInfo?.Fat ?? 0),
                    Fiber = g.Sum(ml => ml.NutritionInfo?.Fiber ?? 0), 
                    Sodium = g.Sum(ml => ml.NutritionInfo?.Sodium ?? 0)  
                })
                .OrderBy(d => d.Date)
                .ToList();
            
            decimal avgCalories = dailyData.Any() ? dailyData.Average(d => d.Calories) : 0;
            decimal avgProtein = dailyData.Any() ? dailyData.Average(d => d.Protein) : 0;
            decimal avgCarbs = dailyData.Any() ? dailyData.Average(d => d.Carbohydrates) : 0;
            decimal avgFat = dailyData.Any() ? dailyData.Average(d => d.Fat) : 0;


            return new NutritionTrends
            {
                StartDate = startDate,
                EndDate = endDate,
                DailyData = dailyData,
                AverageCalories = avgCalories,
                AverageProtein = avgProtein,
                AverageCarbs = avgCarbs,
                AverageFat = avgFat
            };
        }

        public async Task<List<NutritionRecommendation>> GetNutritionRecommendationsAsync(string userId)
        {
            var recommendations = new List<NutritionRecommendation>();
            
            var recentDate = DateTime.UtcNow.AddDays(-7);
            var recentLogs = await _context.MealLogs
                .Where(ml => ml.UserId == userId && ml.LoggedAt >= recentDate)
                .Include(ml => ml.NutritionInfo) 
                .ToListAsync();

            decimal avgCalories = recentLogs.Any() ? recentLogs.Average(ml => ml.NutritionInfo?.Calories ?? 0) : 0;
            decimal avgProtein = recentLogs.Any() ? recentLogs.Average(ml => ml.NutritionInfo?.Protein ?? 0) : 0;

            var userGoals = await _context.UserGoals
                .FirstOrDefaultAsync(ug => ug.UserId == userId && ug.IsActive); 

            if (userGoals != null)
            {
                if (userGoals.DailyCalories > 0 && avgCalories < userGoals.DailyCalories * 0.8m) 
                {
                    recommendations.Add(new NutritionRecommendation
                    {
                        Type = "calorie_increase",
                        Title = "Increase Daily Calories",
                        Message = "You're consistently eating below your calorie goal. Consider adding healthy snacks.",
                        Priority = "medium" 
                    });
                }

                if (userGoals.DailyProteinGoal > 0 && avgProtein < userGoals.DailyProteinGoal * 0.8m)
                {
                    recommendations.Add(new NutritionRecommendation
                    {
                        Type = "protein_increase",
                        Title = "Boost Protein Intake",
                        Message = "Your protein intake is below target. Consider adding lean meats, eggs, or protein shakes.",
                        Priority = "high" 
                    });
                }
            }

            return recommendations;
        }

        // Quick Actions
        public async Task<List<Food>> GetFavoriteFoodsAsync(string userId)
        {
            // Get most logged foods as favorites
            var frequentFoodIds = await _context.MealLogs
                .Where(ml => ml.UserId == userId && ml.FoodId != null)
                .GroupBy(ml => ml.FoodId)
                .OrderByDescending(g => g.Count())
                .Take(20)
                .Select(g => g.Key)
                .ToListAsync();

            return await _context.Foods
                .Where(f => frequentFoodIds.Contains(f.Id))
                .ToListAsync();
        }

        public async Task<bool> AddFavoriteFoodAsync(string userId, string foodId)
        {
            await Task.CompletedTask; 
            return true;
        }

        public async Task<bool> RemoveFavoriteFoodAsync(string userId, string foodId)
        {
            await Task.CompletedTask; 
            return true;
        }

        public async Task<List<MealLog>> GetRecentMealsAsync(string userId, int limit = 10)
        {
            return await _context.MealLogs
                .Where(ml => ml.UserId == userId)
                .OrderByDescending(ml => ml.LoggedAt)
                .Take(limit)
                .ToListAsync();
        }
    }
}
