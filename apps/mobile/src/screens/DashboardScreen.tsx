import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, FAB, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApiClient } from '@ai-fitness-coach/api-client';
import { useAuth } from '../contexts/AuthContext';
import type { DashboardData } from '@ai-fitness-coach/shared-types';

const apiClient = new ApiClient(process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api');

export const DashboardScreen: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await apiClient.dashboard.getDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text variant="headlineMedium" style={styles.greeting}>
          Hello, {user?.firstName}! 👋
        </Text>

        {/* Today's Stats */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.cardTitle}>Today's Progress</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text variant="headlineSmall" style={styles.statNumber}>
                  {dashboardData?.todayStats?.caloriesConsumed || 0}
                </Text>
                <Text variant="bodySmall">Calories</Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="headlineSmall" style={styles.statNumber}>
                  {dashboardData?.todayStats?.workoutsCompleted || 0}
                </Text>
                <Text variant="bodySmall">Workouts</Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="headlineSmall" style={styles.statNumber}>
                  {dashboardData?.todayStats?.waterIntake || 0}L
                </Text>
                <Text variant="bodySmall">Water</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.cardTitle}>Quick Actions</Text>
            <View style={styles.chipContainer}>
              <Chip icon="food-apple" mode="outlined" style={styles.chip}>
                Log Meal
              </Chip>
              <Chip icon="dumbbell" mode="outlined" style={styles.chip}>
                Start Workout
              </Chip>
              <Chip icon="water" mode="outlined" style={styles.chip}>
                Add Water
              </Chip>
            </View>
          </Card.Content>
        </Card>

        {/* Recent Activities */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.cardTitle}>Recent Activities</Text>
            {dashboardData?.recentActivities?.map((activity, index) => (
              <View key={index} style={styles.activityItem}>
                <Text variant="bodyMedium">{activity.description}</Text>
                <Text variant="bodySmall" style={styles.activityTime}>
                  {new Date(activity.timestamp).toLocaleTimeString()}
                </Text>
              </View>
            ))}
          </Card.Content>
        </Card>
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {/* Navigate to quick add */}}
      />    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
  },
  greeting: {
    marginBottom: 24,
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: 'bold',
    color: '#6366f1',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  activityTime: {
    color: '#6b7280',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6366f1',
  },
});
