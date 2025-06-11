import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Screens
import { DashboardScreen } from '../screens/DashboardScreen';
import { WorkoutScreen } from '../screens/WorkoutScreen';
import { NutritionScreen } from '../screens/NutritionScreen';
import { ProgressScreen } from '../screens/ProgressScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { WorkoutDetailScreen } from '../screens/WorkoutDetailScreen';
import { MealDetailScreen } from '../screens/MealDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function WorkoutStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="WorkoutMain" 
        component={WorkoutScreen} 
        options={{ title: 'Workouts' }}
      />
      <Stack.Screen 
        name="WorkoutDetail" 
        component={WorkoutDetailScreen}
        options={{ title: 'Workout Details' }}
      />
    </Stack.Navigator>
  );
}

function NutritionStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="NutritionMain" 
        component={NutritionScreen} 
        options={{ title: 'Nutrition' }}
      />
      <Stack.Screen 
        name="MealDetail" 
        component={MealDetailScreen}
        options={{ title: 'Meal Details' }}
      />
    </Stack.Navigator>
  );
}

export function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
              break;
            case 'Workouts':
              iconName = focused ? 'dumbbell' : 'dumbbell';
              break;
            case 'Nutrition':
              iconName = focused ? 'food-apple' : 'food-apple-outline';
              break;
            case 'Progress':
              iconName = focused ? 'chart-line' : 'chart-line-variant';
              break;
            case 'Profile':
              iconName = focused ? 'account' : 'account-outline';
              break;
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Workouts" component={WorkoutStack} />
      <Tab.Screen name="Nutrition" component={NutritionStack} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
