import React, { useEffect, useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';
import Progress from './ui/Progress';
import useLogger from '../hooks/useLogger';
import withLogging from './withLogging';

interface Exercise {
  exercise: string;
  sets: string;
  reps: string;
  completed: boolean;
}

interface WorkoutData {
  name: string;
  duration: string;
  date: string;
  calories: number;
}

interface WeeklyProgress {
  workoutsCompleted: number;
  totalWorkouts: number;
  totalDuration: number;
  targetDuration: number;
}

const WorkoutsSection: React.FC = () => {
  const logger = useLogger({ componentName: 'WorkoutsSection' });
  const [exercises, setExercises] = useState<Exercise[]>([
    { exercise: 'Push-ups', sets: '3 sets', reps: '15 reps', completed: true },
    { exercise: 'Squats', sets: '3 sets', reps: '20 reps', completed: true },
    { exercise: 'Plank', sets: '3 sets', reps: '45 seconds', completed: false },
    { exercise: 'Burpees', sets: '2 sets', reps: '10 reps', completed: false },
  ]);
  
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgress>({
    workoutsCompleted: 3,
    totalWorkouts: 5,
    totalDuration: 270,
    targetDuration: 360,
  });
  
  const [recentWorkouts] = useState<WorkoutData[]>([
    { name: 'Full Body HIIT', duration: '45 min', date: 'Today', calories: 320 },
    { name: 'Upper Body Strength', duration: '60 min', date: 'Yesterday', calories: 280 },
    { name: 'Cardio & Core', duration: '30 min', date: '2 days ago', calories: 210 },
  ]);

  useEffect(() => {
    logger.info('WorkoutsSection component mounted');
    logger.logPerformance('workout-data-load', Date.now(), 'ms');
    
    // Log initial workout data
    const completedExercises = exercises.filter(ex => ex.completed).length;
    logger.info('Initial workout data loaded', {
      totalExercises: exercises.length,
      completedExercises,
      completionRate: Math.round((completedExercises / exercises.length) * 100),
      weeklyProgress,
      recentWorkoutCount: recentWorkouts.length,
    });
  }, []);

  const handleStartWorkout = () => {
    const startTime = Date.now();
    
    logger.logUserAction('start-workout-clicked', {
      currentProgress: weeklyProgress,
      pendingExercises: exercises.filter(ex => !ex.completed).length,
      timestamp: new Date().toISOString(),
    });

    logger.info('Start workout modal would open here');
    logger.logPerformance('start-workout-action', Date.now() - startTime, 'ms');
  };

  const handleExerciseAction = (exerciseIndex: number, action: 'complete' | 'edit') => {
    const exercise = exercises[exerciseIndex];
    const startTime = Date.now();
    
    logger.logUserAction(`exercise-${action}-clicked`, {
      exerciseName: exercise.exercise,
      exerciseCompleted: exercise.completed,
      exerciseIndex,
      sets: exercise.sets,
      reps: exercise.reps,
    });

    if (action === 'complete') {
      const updatedExercises = [...exercises];
      updatedExercises[exerciseIndex].completed = true;
      setExercises(updatedExercises);
      
      const newCompletedCount = updatedExercises.filter(ex => ex.completed).length;
      logger.info('Exercise completed', {
        exerciseName: exercise.exercise,
        totalCompleted: newCompletedCount,
        totalExercises: exercises.length,
        completionRate: Math.round((newCompletedCount / exercises.length) * 100),
      });
    } else {
      logger.info('Exercise edit modal would open here', { exercise });
    }
    
    logger.logPerformance(`exercise-${action}-action`, Date.now() - startTime, 'ms');
  };

  const getProgressStatus = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    let status = 'on-track';
    
    if (percentage < 60) status = 'behind';
    else if (percentage >= 80) status = 'excellent';
    
    return { percentage: Math.round(percentage), status };
  };

  const workoutProgressStatus = getProgressStatus(weeklyProgress.workoutsCompleted, weeklyProgress.totalWorkouts);
  const durationProgressStatus = getProgressStatus(weeklyProgress.totalDuration, weeklyProgress.targetDuration);  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Workout Tracking</h2>
        <Button variant="primary" onClick={handleStartWorkout}>
          <span className="mr-2">🏋️</span>
          Start Workout
        </Button>
      </div>

      {/* Today's Workout */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Workout Plan</h3>
        <div className="space-y-4">
          {exercises.map((exercise, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-6 h-6 rounded-full ${exercise.completed ? 'bg-green-500' : 'bg-gray-300'} flex items-center justify-center`}>
                  {exercise.completed && <span className="text-white text-xs">✓</span>}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{exercise.exercise}</div>
                  <div className="text-sm text-gray-500">{exercise.sets} × {exercise.reps}</div>
                </div>
              </div>
              <Button 
                variant={exercise.completed ? "outline" : "primary"} 
                size="sm"
                onClick={() => handleExerciseAction(index, exercise.completed ? 'edit' : 'complete')}
              >
                {exercise.completed ? 'Edit' : 'Complete'}
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Weekly Progress */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Workouts Completed</span>
              <Badge variant="success" size="sm">{weeklyProgress.workoutsCompleted}/{weeklyProgress.totalWorkouts}</Badge>
            </div>
            <Progress value={weeklyProgress.workoutsCompleted} max={weeklyProgress.totalWorkouts} variant="success" showLabel />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Total Duration</span>
              <Badge variant="info" size="sm">{Math.round(weeklyProgress.totalDuration / 60)} hours</Badge>
            </div>
            <Progress value={weeklyProgress.totalDuration} max={weeklyProgress.targetDuration} variant="default" showLabel />
          </div>
        </div>
      </Card>

      {/* Recent Workouts */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Workouts</h3>
        <div className="space-y-3">
          {recentWorkouts.map((workout, index) => (
            <div key={index} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">{workout.name}</div>
                <div className="text-sm text-gray-500">{workout.duration} • {workout.date}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">{workout.calories} cal</div>
                <Badge variant="success" size="sm">Completed</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default WorkoutsSection;
