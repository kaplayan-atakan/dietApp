'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface NotificationContextType {
  requestPermissions: () => Promise<boolean>;
  scheduleWorkoutReminder: (workoutId: string, time: Date) => Promise<void>;
  scheduleMealReminder: (mealId: string, time: Date) => Promise<void>;
  isSupported: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('Notification' in window && 'serviceWorker' in navigator);
  }, []);

  const requestPermissions = async (): Promise<boolean> => {
    if (!isSupported) return false;

    try {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
    }
    
    return false;
  };

  const scheduleWorkoutReminder = async (workoutId: string, time: Date): Promise<void> => {
    if (!isSupported) return;

    try {
      console.log('Mock: Scheduling workout reminder for', workoutId, 'at', time);
      // Mock implementation - in real app would use notification service
    } catch (error) {
      console.error('Error scheduling workout reminder:', error);
    }
  };

  const scheduleMealReminder = async (mealId: string, time: Date): Promise<void> => {
    if (!isSupported) return;

    try {
      console.log('Mock: Scheduling meal reminder for', mealId, 'at', time);
      // Mock implementation - in real app would use notification service
    } catch (error) {
      console.error('Error scheduling meal reminder:', error);
    }
  };

  const value: NotificationContextType = {
    requestPermissions,
    scheduleWorkoutReminder,
    scheduleMealReminder,
    isSupported
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
