import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiClient } from '@ai-fitness/api-client';
import type { User, LoginRequest, RegisterRequest } from '@ai-fitness/shared-types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const apiClient = new ApiClient({ 
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api' 
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        apiClient.setAuthToken(token);
        // Validate token by fetching user profile
        const userProfile = await apiClient.getProfile();
        setUser(userProfile);
      }
    } catch (error) {
      console.error('Failed to load stored auth:', error);
      await AsyncStorage.removeItem('auth_token');
    } finally {
      setIsLoading(false);
    }
  };
  const login = async (credentials: LoginRequest) => {
    try {
      const response = await apiClient.login(credentials.email, credentials.password);
      await AsyncStorage.setItem('auth_token', response.accessToken);
      apiClient.setAuthToken(response.accessToken);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {    try {
      await AsyncStorage.removeItem('auth_token');
      apiClient.clearAuth();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };  const register = async (userData: RegisterRequest) => {
    try {
      const response = await apiClient.register(userData);
      await AsyncStorage.setItem('auth_token', response.accessToken);
      apiClient.setAuthToken(response.accessToken);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
