// Error logging
export * from './errorLogger';

// Date and time utilities
export const dateUtils = {
  /**
   * Format a date to YYYY-MM-DD format
   */
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  },

  /**
   * Get the start of the day for a given date
   */
  startOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  },

  /**
   * Get the end of the day for a given date
   */
  endOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
  },

  /**
   * Add days to a date
   */
  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },

  /**
   * Check if two dates are on the same day
   */
  isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  },

  /**
   * Get the difference in days between two dates
   */
  daysDifference(date1: Date, date2: Date): number {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  },
};

// String utilities
export const stringUtils = {
  /**
   * Capitalize the first letter of a string
   */
  capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  /**
   * Convert a string to kebab-case
   */
  toKebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  },

  /**
   * Convert a string to camelCase
   */
  toCamelCase(str: string): string {
    return str
      .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
      .replace(/^[A-Z]/, (char) => char.toLowerCase());
  },

  /**
   * Truncate a string to a specified length
   */
  truncate(str: string, length: number, suffix = '...'): string {
    if (str.length <= length) return str;
    return str.slice(0, length - suffix.length) + suffix;
  },

  /**
   * Generate a random string of specified length
   */
  randomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },
};

// Number utilities
export const numberUtils = {
  /**
   * Round a number to specified decimal places
   */
  round(num: number, decimals: number = 2): number {
    return Math.round((num + Number.EPSILON) * Math.pow(10, decimals)) / Math.pow(10, decimals);
  },

  /**
   * Clamp a number between min and max values
   */
  clamp(num: number, min: number, max: number): number {
    return Math.min(Math.max(num, min), max);
  },

  /**
   * Check if a value is a valid number
   */
  isValidNumber(value: any): value is number {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
  },

  /**
   * Format a number as a percentage
   */
  toPercentage(value: number, decimals: number = 1): string {
    return `${this.round(value * 100, decimals)}%`;
  },

  /**
   * Generate a random number between min and max (inclusive)
   */
  randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
};

// Validation utilities
export const validationUtils = {
  /**
   * Validate an email address
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate a phone number (basic validation)
   */
  isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  },

  /**
   * Check if a string is not empty or just whitespace
   */
  isNotEmpty(value: string | null | undefined): boolean {
    return value != null && value.trim().length > 0;
  },

  /**
   * Validate a password (at least 8 characters, contains letters and numbers)
   */
  isValidPassword(password: string): boolean {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  },

  /**
   * Check if a value is within a range
   */
  isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  },
};

// Fitness-specific utilities
export const fitnessUtils = {
  /**
   * Calculate BMI (Body Mass Index)
   */
  calculateBMI(weightKg: number, heightCm: number): number {
    const heightM = heightCm / 100;
    return numberUtils.round(weightKg / (heightM * heightM));
  },

  /**
   * Get BMI category
   */
  getBMICategory(bmi: number): string {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  },

  /**
   * Calculate calories burned based on activity
   */
  calculateCaloriesBurned(
    activityMET: number,
    weightKg: number,
    durationMinutes: number
  ): number {
    // METs × weight in kg × time in hours
    const hours = durationMinutes / 60;
    return numberUtils.round(activityMET * weightKg * hours);
  },

  /**
   * Convert pounds to kilograms
   */
  poundsToKg(pounds: number): number {
    return numberUtils.round(pounds * 0.453592);
  },

  /**
   * Convert kilograms to pounds
   */
  kgToPounds(kg: number): number {
    return numberUtils.round(kg * 2.20462);
  },

  /**
   * Convert feet/inches to centimeters
   */
  feetInchesToCm(feet: number, inches: number): number {
    return numberUtils.round((feet * 12 + inches) * 2.54);
  },

  /**
   * Convert centimeters to feet and inches
   */
  cmToFeetInches(cm: number): { feet: number; inches: number } {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = numberUtils.round(totalInches % 12);
    return { feet, inches };
  },
};

// Storage utilities (for localStorage/sessionStorage)
export const storageUtils = {
  /**
   * Set an item in localStorage with JSON serialization
   */
  setLocal<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  },

  /**
   * Get an item from localStorage with JSON parsing
   */
  getLocal<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return null;
    }
  },

  /**
   * Remove an item from localStorage
   */
  removeLocal(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
    }
  },

  /**
   * Clear all localStorage items
   */
  clearLocal(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  },

  /**
   * Set an item in sessionStorage with JSON serialization
   */
  setSession<T>(key: string, value: T): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Failed to save to sessionStorage:', error);
    }
  },

  /**
   * Get an item from sessionStorage with JSON parsing
   */
  getSession<T>(key: string): T | null {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn('Failed to read from sessionStorage:', error);
      return null;
    }
  },
};

// Export all utilities as default
export default {
  dateUtils,
  stringUtils,
  numberUtils,
  validationUtils,
  fitnessUtils,
  storageUtils,
};
