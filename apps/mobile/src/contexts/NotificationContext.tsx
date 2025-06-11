import React, { createContext, useContext, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { NotificationClient } from '@ai-fitness-coach/notification-client';

interface NotificationContextType {
  requestPermissions: () => Promise<boolean>;
  scheduleWorkoutReminder: (workoutId: string, time: Date) => Promise<void>;
  scheduleMealReminder: (mealId: string, time: Date) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const notificationClient = new NotificationClient(process.env.EXPO_PUBLIC_NOTIFICATION_URL || 'http://localhost:5001');

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Listen for notification responses
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      // Handle notification tap
    });

    return () => subscription.remove();
  }, []);

  const requestPermissions = async (): Promise<boolean> => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus === 'granted') {
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      await notificationClient.registerDevice(token);
    }
    
    return finalStatus === 'granted';
  };

  const scheduleWorkoutReminder = async (workoutId: string, time: Date) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Workout Reminder',
        body: 'Time for your scheduled workout!',
        data: { workoutId, type: 'workout' },
      },
      trigger: { date: time },
    });
  };

  const scheduleMealReminder = async (mealId: string, time: Date) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Meal Reminder',
        body: 'Time to log your meal!',
        data: { mealId, type: 'meal' },
      },
      trigger: { date: time },
    });
  };

  const value: NotificationContextType = {
    requestPermissions,
    scheduleWorkoutReminder,
    scheduleMealReminder
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
