import React, { useEffect, useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';
import useLogger from '../hooks/useLogger';
import withLogging from './withLogging';

interface MealData {
  meal: string;
  items: string[];
  calories: number;
  time: string;
}

interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  caloriesRemaining: number;
}

const NutritionSection: React.FC = () => {
  const logger = useLogger({ componentName: 'NutritionSection' });
  const [nutritionData, setNutritionData] = useState<NutritionData>({
    calories: 1250,
    protein: 85,
    carbs: 150,
    fat: 45,
    caloriesRemaining: 750,
  });
  const [meals, setMeals] = useState<MealData[]>([
    { meal: 'Breakfast', items: ['Oatmeal with berries', 'Greek yogurt'], calories: 350, time: '8:00 AM' },
    { meal: 'Lunch', items: ['Grilled chicken salad', 'Quinoa'], calories: 450, time: '12:30 PM' },
    { meal: 'Snack', items: ['Apple', 'Almonds'], calories: 180, time: '3:00 PM' },
  ]);

  useEffect(() => {
    logger.info('NutritionSection component mounted');
    logger.logPerformance('nutrition-data-load', Date.now(), 'ms');
    
    // Log initial nutrition data
    logger.info('Initial nutrition data loaded', {
      nutritionData,
      mealCount: meals.length,
      totalCalories: meals.reduce((sum, meal) => sum + meal.calories, 0),
    });
  }, []);

  const handleLogMeal = () => {
    const startTime = Date.now();
    
    logger.logUserAction('log-meal-clicked', {
      currentCalories: nutritionData.calories,
      caloriesRemaining: nutritionData.caloriesRemaining,
      timestamp: new Date().toISOString(),
    });

    // Simulate meal logging action
    logger.info('Meal logging modal would open here');
    
    logger.logPerformance('log-meal-action', Date.now() - startTime, 'ms');
  };

  const handleEditMeal = (mealIndex: number) => {
    const meal = meals[mealIndex];
    const startTime = Date.now();
    
    logger.logUserAction('edit-meal-clicked', {
      mealName: meal.meal,
      mealCalories: meal.calories,
      mealTime: meal.time,
      mealIndex,
    });

    // Simulate edit action
    logger.info('Meal edit modal would open here', { meal });
    
    logger.logPerformance('edit-meal-action', Date.now() - startTime, 'ms');
  };

  const getNutritionStatus = (current: number, goal: number, type: string) => {
    const percentage = (current / goal) * 100;
    let status = 'on-track';
    
    if (percentage < 80) status = 'low';
    else if (percentage > 120) status = 'high';
    
    logger.debug('Nutrition status calculated', {
      type,
      current,
      goal,
      percentage: Math.round(percentage),
      status,
    });
    
    return status;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Nutrition Tracking</h2>
        <Button variant="primary" onClick={handleLogMeal}>
          <span className="mr-2">➕</span>
          Log Meal
        </Button>
      </div>

      {/* Daily Summary */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Nutrition</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{nutritionData.calories.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Calories</div>
            <Badge variant="info" size="sm" className="mt-1">{nutritionData.caloriesRemaining} remaining</Badge>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{nutritionData.protein}g</div>
            <div className="text-sm text-gray-500">Protein</div>
            <Badge variant="success" size="sm" className="mt-1">On track</Badge>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{nutritionData.carbs}g</div>
            <div className="text-sm text-gray-500">Carbs</div>
            <Badge variant="warning" size="sm" className="mt-1">Moderate</Badge>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{nutritionData.fat}g</div>
            <div className="text-sm text-gray-500">Fat</div>
            <Badge variant="default" size="sm" className="mt-1">Good</Badge>
          </div>
        </div>
      </Card>

      {/* Recent Meals */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Meals</h3>
        <div className="space-y-4">
          {meals.map((meal, index) => (
            <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">{meal.meal}</div>
                <div className="text-sm text-gray-500">{meal.items.join(', ')}</div>
                <div className="text-xs text-gray-400">{meal.time}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">{meal.calories} cal</div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-1"
                  onClick={() => handleEditMeal(index)}
                >
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default NutritionSection;
