import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { AuthNavigator } from './navigation/AuthNavigator';
import { AppNavigator } from './navigation/AppNavigator';
import { useAuth } from './hooks/useAuth';
import { theme } from './theme';

const Stack = createNativeStackNavigator();

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; // TODO: Add loading screen
  }

  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <NotificationProvider>
            <AppContent />
            <StatusBar style="auto" />
          </NotificationProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
