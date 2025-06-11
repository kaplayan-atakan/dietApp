import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '@dietapp/api-client';
import { Workout, Exercise } from '@dietapp/shared-types';
import { theme } from '../theme';

export const WorkoutScreen: React.FC = () => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      if (user?.id) {
        const userWorkouts = await apiClient.workouts.getUserWorkouts(user.id);
        setWorkouts(userWorkouts);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load workouts');
    } finally {
      setLoading(false);
    }
  };

  const startWorkout = (workout: Workout) => {
    setActiveWorkout(workout);
  };

  const completeWorkout = async () => {
    if (!activeWorkout || !user?.id) return;

    try {
      await apiClient.workouts.logWorkout(user.id, {
        workoutId: activeWorkout.id,
        completedAt: new Date(),
        exercises: activeWorkout.exercises.map(exercise => ({
          exerciseId: exercise.id,
          sets: exercise.sets || 0,
          reps: exercise.reps || 0,
          weight: exercise.weight || 0,
          duration: exercise.duration || 0,
        })),
      });
      
      Alert.alert('Success', 'Workout completed!');
      setActiveWorkout(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to complete workout');
    }
  };

  const renderWorkoutItem = ({ item }: { item: Workout }) => (
    <TouchableOpacity
      style={styles.workoutCard}
      onPress={() => startWorkout(item)}
    >
      <Text style={styles.workoutName}>{item.name}</Text>
      <Text style={styles.workoutDescription}>{item.description}</Text>
      <View style={styles.workoutStats}>
        <Text style={styles.statText}>
          {item.exercises.length} exercises
        </Text>
        <Text style={styles.statText}>
          ~{item.estimatedDuration} min
        </Text>
        <Text style={styles.statText}>
          {item.difficulty} difficulty
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderExerciseItem = ({ item }: { item: Exercise }) => (
    <View style={styles.exerciseCard}>
      <Text style={styles.exerciseName}>{item.name}</Text>
      <Text style={styles.exerciseDescription}>{item.description}</Text>
      <View style={styles.exerciseStats}>
        {item.sets && <Text style={styles.statText}>{item.sets} sets</Text>}
        {item.reps && <Text style={styles.statText}>{item.reps} reps</Text>}
        {item.weight && <Text style={styles.statText}>{item.weight} lbs</Text>}
        {item.duration && <Text style={styles.statText}>{item.duration} sec</Text>}
      </View>
    </View>
  );

  if (activeWorkout) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{activeWorkout.name}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setActiveWorkout(null)}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.content}>
          <FlatList
            data={activeWorkout.exercises}
            renderItem={renderExerciseItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </ScrollView>
        
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.completeButton}
            onPress={completeWorkout}
          >
            <Text style={styles.completeButtonText}>Complete Workout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Workouts</Text>
      
      {loading ? (
        <View style={styles.loading}>
          <Text>Loading workouts...</Text>
        </View>
      ) : (
        <FlatList
          data={workouts}
          renderItem={renderWorkoutItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          refreshing={loading}
          onRefresh={loadWorkouts}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    margin: theme.spacing.lg,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: theme.colors.background,
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: theme.spacing.md,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  workoutCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  workoutDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  workoutStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exerciseCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  exerciseDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  exerciseStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  statText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  footer: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  completeButton: {
    backgroundColor: theme.colors.success,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  completeButtonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
