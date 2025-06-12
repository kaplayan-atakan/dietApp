// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  height: number; // cm
  weight: number; // kg
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose_weight' | 'maintain_weight' | 'gain_weight' | 'build_muscle';
  healthConditions: string[];
  allergies: string[];
  dietaryPreferences: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  height: number; // cm
  weight: number; // kg
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
}

// Onboarding Types
export interface BasicInfoFormData {
  name: string;
  email: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  height: number;
  weight: number;
}

export interface EatingHabitsFormData {
  mealsPerDay: number;
  preferredMealTimes: string[];
  snackingHabits: string[];
  waterIntake: number;
  alcoholConsumption: 'none' | 'occasional' | 'moderate' | 'frequent';
}

export interface ActivityLevelFormData {
  exerciseFrequency: number;
  exerciseTypes: string[];
  dailySteps: number;
  activityLevel: User['activityLevel'];
}

export interface GoalsFormData {
  primaryGoal: User['goal'];
  targetWeight?: number;
  timeframe: '1_month' | '3_months' | '6_months' | '1_year';
  motivation: string[];
}

// Nutrition Types
export interface NutritionPlan {
  id: string;
  userId: string;
  weekStartDate: Date;
  meals: Meal[];
  totalCalories: number;
  macros: MacroNutrients;
  createdAt: Date;
  isActive: boolean;
}

export interface Meal {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  calories: number;
  macros: MacroNutrients;
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  image?: string;
}

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  calories: number;
  macros: MacroNutrients;
}

export interface MacroNutrients {
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  fiber: number; // grams
}

// Workout Types
export interface WorkoutPlan {
  id: string;
  userId: string;
  weekStartDate: Date;
  workouts: Workout[];
  totalDuration: number; // minutes per week
  createdAt: Date;
  isActive: boolean;
}

export interface Workout {
  id: string;
  dayOfWeek: number; // 0-6
  name: string;
  description: string;
  exercises: Exercise[];
  totalDuration: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'strength' | 'cardio' | 'flexibility' | 'mixed';
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  sets?: number;
  reps?: number;
  duration?: number; // seconds
  restTime: number; // seconds
  instructions: string[];
  targetMuscles: string[];
  equipment: string[];
  image?: string;
  video?: string;
}

// Tracking Types
export interface FoodTracking {
  id: string;
  userId: string;
  date: Date;
  mealType: Meal['type'];
  foodItem: string;
  quantity: number;
  unit: string;
  calories: number;
  macros: MacroNutrients;
  createdAt: Date;
}

export interface WorkoutTracking {
  id: string;
  userId: string;
  workoutId: string;
  date: Date;
  exercises: ExerciseTracking[];
  totalDuration: number;
  caloriesBurned: number;
  notes?: string;
  completedAt: Date;
}

export interface ExerciseTracking {
  exerciseId: string;
  setsCompleted: number;
  repsCompleted: number[];
  weights: number[];
  duration?: number;
  notes?: string;
}

// Notification Types
export interface PushNotificationRequest {
  deviceToken: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
  badge?: number;
}

export interface BulkNotificationRequest {
  tokens: string[];
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
}

export interface NotificationToken {
  id: string;
  userId: string;
  token: string;
  platform: 'ios' | 'android' | 'web';
  appVersion: string;
  createdAt: Date;
  lastUsedAt: Date;
  isActive: boolean;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// AI Processing Types
export interface AIProcessingRequest {
  userId: string;
  requestType: 'nutrition_plan' | 'workout_plan' | 'complete_plan' | 'recommendation';
  deviceToken?: string;
  priority: 'low' | 'normal' | 'high';
  requestedAt: Date;
  parameters?: Record<string, unknown>;
}

export interface AIRecommendation {
  id: string;
  userId: string;
  type: 'nutrition' | 'workout' | 'lifestyle' | 'motivation';
  title: string;
  description: string;
  actionItems: string[];
  priority: 'low' | 'medium' | 'high';
  expiresAt?: Date;
  createdAt: Date;
  isRead: boolean;
}

// Dashboard Types
export interface DashboardStats {
  totalCalories: number;
  targetCalories: number;
  macros: MacroNutrients;
  targetMacros: MacroNutrients;
  workoutsCompleted: number;
  workoutsPlanned: number;
  weightProgress: {
    current: number;
    target: number;
    change: number;
  };
  streak: number;
}

export interface DashboardData {
  user: User;
  stats: DashboardStats;
  todaysPlan: {
    meals: Meal[];
    workout?: Workout;
  };
  aiRecommendations: AIRecommendation[];
  progressData: {
    weight: Array<{ date: string; value: number }>;
    calories: Array<{ date: string; consumed: number; target: number }>;
  };
}

// Error Types
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ApiError {
  message: string;
  code: string;
  details?: unknown;
  validationErrors?: ValidationError[];
}
