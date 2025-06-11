import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '@dietapp/api-client';
import { ProgressData, Goal } from '@dietapp/shared-types';
import { theme } from '../theme';

const { width } = Dimensions.get('window');

export const ProgressScreen: React.FC = () => {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    loadProgressData();
  }, [selectedPeriod]);

  const loadProgressData = async () => {
    try {
      setLoading(true);
      if (user?.id) {
        const progress = await apiClient.progress.getProgressData(user.id, selectedPeriod);
        setProgressData(progress);

        const userGoals = await apiClient.goals.getUserGoals(user.id);
        setGoals(userGoals);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  const renderMetricCard = (title: string, current: number, target: number, unit: string, color: string) => {
    const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;
    
    return (
      <View style={[styles.metricCard, { borderLeftColor: color }]}>
        <Text style={styles.metricTitle}>{title}</Text>
        <View style={styles.metricContent}>
          <Text style={styles.metricValue}>
            {current.toFixed(1)} {unit}
          </Text>
          <Text style={styles.metricTarget}>
            Target: {target.toFixed(1)} {unit}
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${percentage}%`, backgroundColor: color }
            ]} 
          />
        </View>
        <Text style={styles.progressPercentage}>{percentage.toFixed(0)}%</Text>
      </View>
    );
  };

  const renderGoalCard = (goal: Goal) => {
    const progress = goal.currentValue / goal.targetValue * 100;
    const isCompleted = goal.currentValue >= goal.targetValue;
    
    return (
      <View key={goal.id} style={[styles.goalCard, isCompleted && styles.completedGoal]}>
        <View style={styles.goalHeader}>
          <Text style={styles.goalTitle}>{goal.title}</Text>
          <Text style={[styles.goalStatus, isCompleted && styles.completedStatus]}>
            {isCompleted ? 'Completed' : 'In Progress'}
          </Text>
        </View>
        <Text style={styles.goalDescription}>{goal.description}</Text>
        
        <View style={styles.goalProgress}>
          <View style={styles.goalProgressBar}>
            <View 
              style={[
                styles.goalProgressFill, 
                { 
                  width: `${Math.min(progress, 100)}%`,
                  backgroundColor: isCompleted ? theme.colors.success : theme.colors.primary
                }
              ]} 
            />
          </View>
          <Text style={styles.goalProgressText}>
            {goal.currentValue} / {goal.targetValue} {goal.unit}
          </Text>
        </View>
        
        <Text style={styles.goalDeadline}>
          Target: {new Date(goal.targetDate).toLocaleDateString()}
        </Text>
      </View>
    );
  };

  const renderChart = () => {
    if (!progressData?.weightHistory || progressData.weightHistory.length === 0) {
      return (
        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartPlaceholderText}>No weight data available</Text>
        </View>
      );
    }

    // Simple chart representation (in a real app, you'd use a charting library)
    const maxWeight = Math.max(...progressData.weightHistory.map(d => d.weight));
    const minWeight = Math.min(...progressData.weightHistory.map(d => d.weight));
    const range = maxWeight - minWeight || 1;

    return (
      <View style={styles.chart}>
        <Text style={styles.chartTitle}>Weight Trend</Text>
        <View style={styles.chartContainer}>
          {progressData.weightHistory.map((data, index) => {
            const height = ((data.weight - minWeight) / range) * 100;
            return (
              <View key={index} style={styles.chartBar}>
                <View 
                  style={[
                    styles.chartBarFill, 
                    { height: `${height}%` }
                  ]} 
                />
                <Text style={styles.chartBarLabel}>
                  {data.weight.toFixed(1)}
                </Text>
              </View>
            );
          })}
        </View>
        <View style={styles.chartLabels}>
          <Text style={styles.chartLabel}>
            {progressData.weightHistory[0]?.date && 
             new Date(progressData.weightHistory[0].date).toLocaleDateString()}
          </Text>
          <Text style={styles.chartLabel}>
            {progressData.weightHistory[progressData.weightHistory.length - 1]?.date && 
             new Date(progressData.weightHistory[progressData.weightHistory.length - 1].date).toLocaleDateString()}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>Loading progress data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progress</Text>
      
      {/* Period Selector */}
      <View style={styles.periodSelector}>
        {(['week', 'month', 'year'] as const).map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.selectedPeriodButton
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text style={[
              styles.periodButtonText,
              selectedPeriod === period && styles.selectedPeriodButtonText
            ]}>
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {/* Key Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          {progressData && (
            <>
              {renderMetricCard(
                'Current Weight',
                progressData.currentWeight,
                progressData.targetWeight,
                'lbs',
                theme.colors.primary
              )}
              {renderMetricCard(
                'Body Fat %',
                progressData.bodyFatPercentage || 0,
                progressData.targetBodyFat || 15,
                '%',
                theme.colors.warning
              )}
              {renderMetricCard(
                'Muscle Mass',
                progressData.muscleMass || 0,
                progressData.targetMuscleMass || 150,
                'lbs',
                theme.colors.success
              )}
            </>
          )}
        </View>

        {/* Weight Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weight Trend</Text>
          {renderChart()}
        </View>

        {/* Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Goals</Text>
          {goals.length > 0 ? (
            goals.map(renderGoalCard)
          ) : (
            <View style={styles.noGoals}>
              <Text style={styles.noGoalsText}>No active goals</Text>
              <Text style={styles.noGoalsSubtext}>
                Set some goals to track your progress!
              </Text>
            </View>
          )}
        </View>

        {/* Activity Summary */}
        {progressData && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Activity Summary</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryValue}>
                  {progressData.workoutsCompleted || 0}
                </Text>
                <Text style={styles.summaryLabel}>Workouts</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryValue}>
                  {progressData.streakDays || 0}
                </Text>
                <Text style={styles.summaryLabel}>Day Streak</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryValue}>
                  {progressData.caloriesBurned || 0}
                </Text>
                <Text style={styles.summaryLabel}>Calories Burned</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    margin: theme.spacing.lg,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  periodSelector: {
    flexDirection: 'row',
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.xs,
  },
  periodButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
  },
  selectedPeriodButton: {
    backgroundColor: theme.colors.primary,
  },
  periodButtonText: {
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  selectedPeriodButtonText: {
    color: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  metricCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  metricTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  metricContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  metricTarget: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    marginBottom: theme.spacing.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  progressPercentage: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'right',
  },
  goalCard: {
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
  completedGoal: {
    borderColor: theme.colors.success,
    borderWidth: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    flex: 1,
  },
  goalStatus: {
    fontSize: 12,
    color: theme.colors.warning,
    fontWeight: '600',
  },
  completedStatus: {
    color: theme.colors.success,
  },
  goalDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  goalProgress: {
    marginBottom: theme.spacing.sm,
  },
  goalProgressBar: {
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    marginBottom: theme.spacing.xs,
    overflow: 'hidden',
  },
  goalProgressFill: {
    height: '100%',
  },
  goalProgressText: {
    fontSize: 12,
    color: theme.colors.text,
    textAlign: 'right',
  },
  goalDeadline: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  chart: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  chartContainer: {
    flexDirection: 'row',
    height: 120,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  chartBarFill: {
    width: '80%',
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
    minHeight: 4,
  },
  chartBarLabel: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chartLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  chartPlaceholder: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  chartPlaceholderText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  summaryLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  noGoals: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  noGoalsText: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  noGoalsSubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
