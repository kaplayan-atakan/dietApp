import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import {
  ApiResponse,
  PaginatedResponse,
  User,
  RegisterRequest,
  AuthResponse,
  BasicInfoFormData,
  EatingHabitsFormData,
  ActivityLevelFormData,
  GoalsFormData,
  NutritionPlan,
  WorkoutPlan,
  FoodTracking,
  WorkoutTracking,
  DashboardData,
  AIRecommendation,
  PushNotificationRequest,
  BulkNotificationRequest,
  NotificationToken,
} from '@ai-fitness/shared-types';

export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export class ApiClient {
  private client: AxiosInstance;
  private authToken?: string;

  constructor(config: ApiClientConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    this.setupInterceptors();
  }
  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }
        return config;
      },
      (error) => {
        this.logApiError(error, 'Request interceptor');
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        this.logApiError(error, 'Response interceptor');
        if (error.response?.status === 401) {
          this.clearAuth();
        }
        return Promise.reject(error);
      }
    );
  }

  private logApiError(error: AxiosError, source: string) {
    try {
      // Try to get error logger, but don't fail if it's not available
      const { getErrorLogger } = require('@ai-fitness/utils');
      const logger = getErrorLogger();
      
      const endpoint = error.config?.url || 'unknown';
      const method = error.config?.method?.toUpperCase() || 'unknown';
      
      logger.error(`API Error: ${method} ${endpoint}`, {
        component: 'ApiClient',
        action: 'ApiCall',
        errorDetails: error.message,
        stackTrace: error.stack,
        context: {
          endpoint,
          method,
          status: error.response?.status,
          statusText: error.response?.statusText,
          source,
          responseData: error.response?.data,
          requestData: error.config?.data
        }
      });
    } catch (logError) {
      // Fallback to console if error logger is not available
      console.error('API Error:', error);
    }
  }

  setAuthToken(token: string) {
    this.authToken = token;
  }

  clearAuth() {
    this.authToken = undefined;
  }
  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.request(config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any) {
    if (error.response?.data) {
      return new Error(error.response.data.message || 'API Error');
    }
    return error;
  }
  // Authentication endpoints
  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request({
      method: 'POST',
      url: '/auth/login',
      data: { email, password },
    });
  }
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return this.request({
      method: 'POST',
      url: '/auth/register',
      data: userData,
    });
  }
  async refreshToken(): Promise<{ token: string }> {
    return this.request({
      method: 'POST',
      url: '/auth/refresh',
    });
  }  async getProfile(): Promise<User> {
    return this.request({
      method: 'GET',
      url: '/api/auth/me',
    });
  }

  // Onboarding endpoints
  async saveBasicInfo(data: BasicInfoFormData): Promise<{ userId: string }> {
    return this.request({
      method: 'POST',
      url: '/onboarding/basic-info',
      data,
    });
  }

  async saveEatingHabits(data: EatingHabitsFormData): Promise<void> {
    return this.request({
      method: 'POST',
      url: '/onboarding/eating-habits',
      data,
    });
  }

  async saveActivityLevel(data: ActivityLevelFormData): Promise<void> {
    return this.request({
      method: 'POST',
      url: '/onboarding/activity-level',
      data,
    });
  }

  async saveGoals(data: GoalsFormData): Promise<void> {
    return this.request({
      method: 'POST',
      url: '/onboarding/goals',
      data,
    });
  }

  async generatePlan(userId: string, deviceToken?: string): Promise<void> {
    return this.request({
      method: 'POST',
      url: '/onboarding/generate-plan',
      data: { userId, deviceToken },
    });
  }
  // User endpoints
  async updateProfile(data: Partial<User>): Promise<User> {
    return this.request({
      method: 'PUT',
      url: '/users/profile',
      data,
    });
  }

  // Dashboard endpoints
  async getDashboardData(): Promise<DashboardData> {
    return this.request({
      method: 'GET',
      url: '/dashboard',
    });
  }

  // Nutrition endpoints
  async getNutritionPlan(date?: string): Promise<NutritionPlan> {
    return this.request({
      method: 'GET',
      url: '/nutrition/plan',
      params: { date },
    });
  }

  async getNutritionHistory(): Promise<NutritionPlan[]> {
    return this.request({
      method: 'GET',
      url: '/nutrition/history',
    });
  }

  // Workout endpoints
  async getWorkoutPlan(date?: string): Promise<WorkoutPlan> {
    return this.request({
      method: 'GET',
      url: '/workouts/plan',
      params: { date },
    });
  }

  async getWorkoutHistory(): Promise<WorkoutPlan[]> {
    return this.request({
      method: 'GET',
      url: '/workouts/history',
    });
  }

  // Tracking endpoints
  async trackFood(data: Omit<FoodTracking, 'id' | 'userId' | 'createdAt'>): Promise<FoodTracking> {
    return this.request({
      method: 'POST',
      url: '/tracking/food',
      data,
    });
  }

  async getFoodTracking(date: string): Promise<FoodTracking[]> {
    return this.request({
      method: 'GET',
      url: '/tracking/food',
      params: { date },
    });
  }

  async trackWorkout(
    data: Omit<WorkoutTracking, 'id' | 'userId' | 'completedAt'>
  ): Promise<WorkoutTracking> {
    return this.request({
      method: 'POST',
      url: '/tracking/workout',
      data,
    });
  }

  async getWorkoutTracking(date: string): Promise<WorkoutTracking[]> {
    return this.request({
      method: 'GET',
      url: '/tracking/workout',
      params: { date },
    });
  }

  // AI Recommendations
  async getRecommendations(): Promise<AIRecommendation[]> {
    return this.request({
      method: 'GET',
      url: '/ai/recommendations',
    });
  }

  async markRecommendationAsRead(id: string): Promise<void> {
    return this.request({
      method: 'PUT',
      url: `/ai/recommendations/${id}/read`,
    });
  }

  // Notification endpoints
  async registerNotificationToken(data: {
    token: string;
    platform: string;
    appVersion: string;
  }): Promise<void> {
    return this.request({
      method: 'POST',
      url: '/notifications/register-token',
      data,
    });
  }

  async sendNotification(data: PushNotificationRequest): Promise<void> {
    return this.request({
      method: 'POST',
      url: '/notifications/send',
      data,
    });
  }

  async sendBulkNotifications(data: BulkNotificationRequest): Promise<void> {
    return this.request({
      method: 'POST',
      url: '/notifications/send-bulk',
      data,
    });
  }

  async getNotificationTokens(): Promise<NotificationToken[]> {
    return this.request({
      method: 'GET',
      url: '/notifications/tokens',
    });
  }
}

// Create a default instance
export const createApiClient = (config: ApiClientConfig) => new ApiClient(config);

// Export default configuration helper
export const getDefaultConfig = (): ApiClientConfig => ({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
});

export default ApiClient;
