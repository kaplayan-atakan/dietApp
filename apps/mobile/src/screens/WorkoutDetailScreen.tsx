import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { apiClient } from '@dietapp/api-client';
import { Workout, Exercise } from '@dietapp/shared-types';
import { theme } from '../theme';

type WorkoutDetailScreenProps = {
  workoutId: string;
};

export const WorkoutDetailScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { workoutId } = route.params as WorkoutDetailScreenProps;
  
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadWorkoutDetails();
  }, [workoutId]);

  const loadWorkoutDetails = async () => {
    try {
      setLoading(true);
      const workoutData = await apiClient.workouts.getWorkout(workoutId);
      setWorkout(workoutData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load workout details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const startWorkout = () => {
    setIsWorkoutStarted(true);
    setCurrentExerciseIndex(0);
  };

  const completeExercise = (exerciseId: string) => {
    setCompletedExercises(prev => new Set([...prev, exerciseId]));
    
    if (workout && currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      completeWorkout();
    }
  };

  const completeWorkout = () => {
    Alert.alert(
      'Workout Complete!',
      'Congratulations on completing your workout!',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const goToPreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
    }
  };

  const goToNextExercise = () => {
    if (workout && currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    }
  };

  const renderExerciseCard = (exercise: Exercise, index: number) => {
    const isCompleted = completedExercises.has(exercise.id);
    const isCurrent = index === currentExerciseIndex && isWorkoutStarted;
    
    return (
      <View
        key={exercise.id}
        style={[
          styles.exerciseCard,
          isCurrent && styles.currentExerciseCard,
          isCompleted && styles.completedExerciseCard,
        ]}
      >
        <View style={styles.exerciseHeader}>
          <Text style={styles.exerciseNumber}>Exercise {index + 1}</Text>
          {isCompleted && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedBadgeText}>✓</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        <Text style={styles.exerciseDescription}>{exercise.description}</Text>
        
        {exercise.instructions && (
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Instructions:</Text>
            <Text style={styles.instructionsText}>{exercise.instructions}</Text>
          </View>
        )}
        
        <View style={styles.exerciseStats}>
          {exercise.sets && (
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Sets</Text>
              <Text style={styles.statValue}>{exercise.sets}</Text>
            </View>
          )}
          {exercise.reps && (
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Reps</Text>
              <Text style={styles.statValue}>{exercise.reps}</Text>
            </View>
          )}
          {exercise.weight && (
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Weight</Text>
              <Text style={styles.statValue}>{exercise.weight} lbs</Text>
            </View>
          )}
          {exercise.duration && (
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Duration</Text>
              <Text style={styles.statValue}>{exercise.duration}s</Text>
            </View>
          )}
          {exercise.restTime && (
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Rest</Text>
              <Text style={styles.statValue}>{exercise.restTime}s</Text>
            </View>
          )}
        </View>
        
        {isCurrent && isWorkoutStarted && (
          <TouchableOpacity
            style={styles.completeExerciseButton}
            onPress={() => completeExercise(exercise.id)}
          >
            <Text style={styles.completeExerciseButtonText}>
              Complete Exercise
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderWorkoutControls = () => {
    if (!isWorkoutStarted) {
      return (
        <View style={styles.controls}>
          <TouchableOpacity style={styles.startButton} onPress={startWorkout}>
            <Text style={styles.startButtonText}>Start Workout</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.controls}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Exercise {currentExerciseIndex + 1} of {workout?.exercises.length}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((currentExerciseIndex + 1) / (workout?.exercises.length || 1)) * 100}%`,
                },
              ]}
            />
          </View>
        </View>
        
        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={[
              styles.navButton,
              currentExerciseIndex === 0 && styles.disabledButton,
            ]}
            onPress={goToPreviousExercise}
            disabled={currentExerciseIndex === 0}
          >
            <Text style={[
              styles.navButtonText,
              currentExerciseIndex === 0 && styles.disabledButtonText,
            ]}>
              Previous
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.navButton,
              (!workout || currentExerciseIndex === workout.exercises.length - 1) && styles.disabledButton,
            ]}
            onPress={goToNextExercise}
            disabled={!workout || currentExerciseIndex === workout.exercises.length - 1}
          >
            <Text style={[
              styles.navButtonText,
              (!workout || currentExerciseIndex === workout.exercises.length - 1) && styles.disabledButtonText,
            ]}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>Loading workout...</Text>
      </View>
    );
  }

  if (!workout) {
    return (
      <View style={styles.error}>
        <Text>Workout not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{workout.name}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.workoutInfo}>
          <Text style={styles.workoutDescription}>{workout.description}</Text>
          <View style={styles.workoutMeta}>
            <Text style={styles.metaText}>
              {workout.exercises.length} exercises
            </Text>
            <Text style={styles.metaText}>
              ~{workout.estimatedDuration} minutes
            </Text>
            <Text style={styles.metaText}>
              {workout.difficulty} difficulty
            </Text>
          </View>
        </View>

        <View style={styles.exercisesList}>
          {workout.exercises.map((exercise, index) => 
            renderExerciseCard(exercise, index)
          )}
        </View>
      </ScrollView>

      {renderWorkoutControls()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    marginRight: theme.spacing.md,
  },
  backButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    flex: 1,
  },
  content: {
    flex: 1,
  },
  workoutInfo: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    margin: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  workoutDescription: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    lineHeight: 22,
  },
  workoutMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  exercisesList: {
    padding: theme.spacing.md,
  },
  exerciseCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  currentExerciseCard: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
    backgroundColor: theme.colors.primaryLight || theme.colors.surface,
  },
  completedExerciseCard: {
    borderColor: theme.colors.success,
    backgroundColor: theme.colors.successLight || theme.colors.surface,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  exerciseNumber: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  completedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedBadgeText: {
    color: theme.colors.background,
    fontSize: 14,
    fontWeight: 'bold',
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  exerciseDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    lineHeight: 20,
  },
  instructionsContainer: {
    marginBottom: theme.spacing.md,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  instructionsText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  exerciseStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  completeExerciseButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  completeExerciseButtonText: {
    color: theme.colors.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
  controls: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  startButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  startButtonText: {
    color: theme.colors.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressContainer: {
    marginBottom: theme.spacing.md,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    marginHorizontal: theme.spacing.sm,
  },
  disabledButton: {
    borderColor: theme.colors.border,
  },
  navButtonText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  disabledButtonText: {
    color: theme.colors.textSecondary,
  },
});
