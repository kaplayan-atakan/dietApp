import React, { useEffect, useState } from 'react';
import Card from './ui/Card';
import Progress from './ui/Progress';
import Badge from './ui/Badge';
import useLogger from '../hooks/useLogger';
import withLogging from './withLogging';

interface OverallProgress {
  percentage: number;
  daysActive: number;
  targetDays: number;
  weightLost: number;
  weightGoal: number;
}

interface WeeklySummary {
  workouts: { completed: number; target: number };
  caloriesBurned: { amount: number; target: number };
  sleepQuality: { hours: number; target: number };
  waterIntake: { liters: number; target: number };
}

interface MonthlyMetrics {
  fitness: {
    avgWorkoutDuration: number;
    totalWorkouts: number;
    caloriesBurned: number;
    activeDays: number;
    totalDays: number;
  };
  body: {
    weightChange: number;
    bodyFatChange: number;
    muscleGain: number;
    bmi: number;
  };
}

const ProgressSection: React.FC = () => {
  const logger = useLogger({ componentName: 'ProgressSection' });
  
  const [overallProgress, setOverallProgress] = useState<OverallProgress>({
    percentage: 85,
    daysActive: 23,
    targetDays: 30,
    weightLost: 5.2,
    weightGoal: 10,
  });
  
  const [weeklySummary, setWeeklySummary] = useState<WeeklySummary>({
    workouts: { completed: 5, target: 5 },
    caloriesBurned: { amount: 2150, target: 2000 },
    sleepQuality: { hours: 7.5, target: 8 },
    waterIntake: { liters: 1.8, target: 2.5 },
  });
  
  const [monthlyMetrics, setMonthlyMetrics] = useState<MonthlyMetrics>({
    fitness: {
      avgWorkoutDuration: 48,
      totalWorkouts: 20,
      caloriesBurned: 8420,
      activeDays: 23,
      totalDays: 30,
    },
    body: {
      weightChange: -5.2,
      bodyFatChange: -2.1,
      muscleGain: 1.8,
      bmi: 22.4,
    },
  });

  useEffect(() => {
    const startTime = Date.now();
    logger.info('ProgressSection component mounted');
    
    // Log comprehensive progress analytics
    const progressAnalytics = {
      overallProgress: {
        ...overallProgress,
        weightProgressPercentage: Math.round((overallProgress.weightLost / overallProgress.weightGoal) * 100),
        activityStreakPercentage: Math.round((overallProgress.daysActive / overallProgress.targetDays) * 100),
      },
      weeklyPerformance: {
        workoutGoalAchieved: weeklySummary.workouts.completed >= weeklySummary.workouts.target,
        caloriesBurnedExceeded: weeklySummary.caloriesBurned.amount > weeklySummary.caloriesBurned.target,
        sleepQualityPercentage: Math.round((weeklySummary.sleepQuality.hours / weeklySummary.sleepQuality.target) * 100),
        hydrationPercentage: Math.round((weeklySummary.waterIntake.liters / weeklySummary.waterIntake.target) * 100),
      },
      monthlyTrends: {
        totalWorkoutTime: monthlyMetrics.fitness.totalWorkouts * monthlyMetrics.fitness.avgWorkoutDuration,
        activityConsistency: Math.round((monthlyMetrics.fitness.activeDays / monthlyMetrics.fitness.totalDays) * 100),
        bodyCompositionImprovement: monthlyMetrics.body.weightChange < 0 && monthlyMetrics.body.muscleGain > 0,
      },
    };
    
    logger.info('Progress data loaded and analyzed', progressAnalytics);
    logger.logPerformance('progress-analytics-calculation', Date.now() - startTime, 'ms');
  }, []);

  const getProgressStatus = (current: number, target: number, type: string) => {
    const percentage = (current / target) * 100;
    let status = 'on-track';
    let variant: 'success' | 'warning' | 'info' | 'default' = 'default';
    
    if (percentage >= 100) {
      status = 'goal-met';
      variant = 'success';
    } else if (percentage >= 80) {
      status = 'excellent';
      variant = 'success';
    } else if (percentage >= 60) {
      status = 'good';
      variant = 'info';
    } else {
      status = 'needs-work';
      variant = 'warning';
    }
    
    logger.debug('Progress status calculated', {
      type,
      current,
      target,
      percentage: Math.round(percentage),
      status,
      variant,
    });
    
    return { status, variant, percentage: Math.round(percentage) };
  };

  const handleProgressInteraction = (metricType: string, metricValue: any) => {
    const startTime = Date.now();
    
    logger.logUserAction('progress-metric-viewed', {
      metricType,
      metricValue,
      timestamp: new Date().toISOString(),
    });
    
    logger.info(`User viewed ${metricType} progress metric`, { metricValue });
    logger.logPerformance('progress-metric-interaction', Date.now() - startTime, 'ms');
  };  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Your Progress</h2>
        <p className="text-gray-600 mt-1">Track your fitness journey over time</p>
      </div>

      {/* Overall Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div 
            className="text-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
            onClick={() => handleProgressInteraction('overall-progress', overallProgress.percentage)}
          >
            <div className="text-3xl font-bold text-blue-600 mb-2">{overallProgress.percentage}%</div>
            <div className="text-sm text-gray-500 mb-3">Overall Progress</div>
            <Progress value={overallProgress.percentage} max={100} variant="default" showLabel={false} />
            <Badge variant="success" size="sm" className="mt-2">On Track</Badge>
          </div>
        </Card>
        
        <Card>
          <div 
            className="text-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
            onClick={() => handleProgressInteraction('days-active', { active: overallProgress.daysActive, target: overallProgress.targetDays })}
          >
            <div className="text-3xl font-bold text-green-600 mb-2">{overallProgress.daysActive}</div>
            <div className="text-sm text-gray-500 mb-3">Days Active</div>
            <Progress value={overallProgress.daysActive} max={overallProgress.targetDays} variant="success" showLabel={false} />
            <Badge variant="success" size="sm" className="mt-2">Great Streak!</Badge>
          </div>
        </Card>
        
        <Card>
          <div 
            className="text-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
            onClick={() => handleProgressInteraction('weight-loss', { lost: overallProgress.weightLost, goal: overallProgress.weightGoal })}
          >
            <div className="text-3xl font-bold text-purple-600 mb-2">{overallProgress.weightLost}kg</div>
            <div className="text-sm text-gray-500 mb-3">Weight Lost</div>
            <Progress value={overallProgress.weightLost} max={overallProgress.weightGoal} variant="default" showLabel={false} />
            <Badge variant="info" size="sm" className="mt-2">
              {Math.round((overallProgress.weightLost / overallProgress.weightGoal) * 100)}% to Goal
            </Badge>
          </div>
        </Card>
      </div>

      {/* Weekly Summary */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week's Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            className="cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
            onClick={() => handleProgressInteraction('weekly-workouts', weeklySummary.workouts)}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Workouts</span>
              <Badge variant="success" size="sm">Goal Met</Badge>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {weeklySummary.workouts.completed}/{weeklySummary.workouts.target}
            </div>
            <Progress value={weeklySummary.workouts.completed} max={weeklySummary.workouts.target} variant="success" />
          </div>
          
          <div 
            className="cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
            onClick={() => handleProgressInteraction('weekly-calories', weeklySummary.caloriesBurned)}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Calories Burned</span>
              <Badge variant="success" size="sm">Excellent</Badge>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{weeklySummary.caloriesBurned.amount.toLocaleString()}</div>
            <Progress value={weeklySummary.caloriesBurned.amount} max={weeklySummary.caloriesBurned.target} variant="success" />
          </div>
          
          <div 
            className="cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
            onClick={() => handleProgressInteraction('weekly-sleep', weeklySummary.sleepQuality)}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Sleep Quality</span>
              <Badge variant="success" size="sm">Good</Badge>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{weeklySummary.sleepQuality.hours}h</div>
            <Progress value={weeklySummary.sleepQuality.hours} max={weeklySummary.sleepQuality.target} variant="default" />
          </div>
          
          <div 
            className="cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
            onClick={() => handleProgressInteraction('weekly-water', weeklySummary.waterIntake)}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Water Intake</span>
              <Badge variant="warning" size="sm">Needs Work</Badge>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{weeklySummary.waterIntake.liters}L</div>
            <Progress value={weeklySummary.waterIntake.liters} max={weeklySummary.waterIntake.target} variant="warning" />
          </div>
        </div>
      </Card>

      {/* Monthly Trends */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-md font-medium text-gray-800 mb-3">Fitness Metrics</h4>
            <div className="space-y-4">
              <div 
                className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                onClick={() => handleProgressInteraction('monthly-workout-duration', monthlyMetrics.fitness.avgWorkoutDuration)}
              >
                <span className="text-sm text-gray-600">Average Workout Duration</span>
                <span className="font-semibold">{monthlyMetrics.fitness.avgWorkoutDuration} min</span>
              </div>
              <div 
                className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                onClick={() => handleProgressInteraction('monthly-total-workouts', monthlyMetrics.fitness.totalWorkouts)}
              >
                <span className="text-sm text-gray-600">Total Workouts</span>
                <span className="font-semibold">{monthlyMetrics.fitness.totalWorkouts}</span>
              </div>
              <div 
                className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                onClick={() => handleProgressInteraction('monthly-calories-burned', monthlyMetrics.fitness.caloriesBurned)}
              >
                <span className="text-sm text-gray-600">Calories Burned</span>
                <span className="font-semibold">{monthlyMetrics.fitness.caloriesBurned.toLocaleString()}</span>
              </div>
              <div 
                className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                onClick={() => handleProgressInteraction('monthly-active-days', { active: monthlyMetrics.fitness.activeDays, total: monthlyMetrics.fitness.totalDays })}
              >
                <span className="text-sm text-gray-600">Active Days</span>
                <span className="font-semibold">{monthlyMetrics.fitness.activeDays}/{monthlyMetrics.fitness.totalDays}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-medium text-gray-800 mb-3">Body Metrics</h4>
            <div className="space-y-4">
              <div 
                className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                onClick={() => handleProgressInteraction('monthly-weight-change', monthlyMetrics.body.weightChange)}
              >
                <span className="text-sm text-gray-600">Weight Change</span>
                <span className="font-semibold text-green-600">{monthlyMetrics.body.weightChange} kg</span>
              </div>
              <div 
                className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                onClick={() => handleProgressInteraction('monthly-body-fat', monthlyMetrics.body.bodyFatChange)}
              >
                <span className="text-sm text-gray-600">Body Fat %</span>
                <span className="font-semibold text-green-600">{monthlyMetrics.body.bodyFatChange}%</span>
              </div>
              <div 
                className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                onClick={() => handleProgressInteraction('monthly-muscle-gain', monthlyMetrics.body.muscleGain)}
              >
                <span className="text-sm text-gray-600">Muscle Mass</span>
                <span className="font-semibold text-blue-600">+{monthlyMetrics.body.muscleGain} kg</span>
              </div>
              <div 
                className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                onClick={() => handleProgressInteraction('monthly-bmi', monthlyMetrics.body.bmi)}
              >
                <span className="text-sm text-gray-600">BMI</span>
                <span className="font-semibold">{monthlyMetrics.body.bmi}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProgressSection;
