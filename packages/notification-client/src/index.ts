// Basic types for now - to be replaced with proper shared-types later
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

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

export interface NotificationClientConfig {
  apiUrl: string;
  apiKey?: string;
  timeout?: number;
}

export class NotificationClient {
  private config: NotificationClientConfig;

  constructor(config: NotificationClientConfig) {
    this.config = {
      timeout: 30000,
      ...config,
    };
  }

  /**
   * Send a push notification to a single user
   */
  async sendPushNotification(request: PushNotificationRequest): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.config.apiUrl}/notifications/push`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to send notification',
          data: undefined,
          timestamp: new Date().toISOString(),
        };
      }

      return {
        success: true,
        data: undefined,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        data: undefined,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Send bulk notifications to multiple users
   */
  async sendBulkNotifications(request: BulkNotificationRequest): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.config.apiUrl}/notifications/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to send bulk notifications',
          data: undefined,
          timestamp: new Date().toISOString(),
        };
      }

      return {
        success: true,
        data: undefined,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        data: undefined,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Register a notification token for a user
   */
  async registerToken(token: NotificationToken): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.config.apiUrl}/notifications/register-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
        },
        body: JSON.stringify(token),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to register token',
          data: undefined,
          timestamp: new Date().toISOString(),
        };
      }

      return {
        success: true,
        data: undefined,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        data: undefined,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Remove a notification token
   */
  async removeToken(userId: string, token: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.config.apiUrl}/notifications/remove-token`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
        },
        body: JSON.stringify({ userId, token }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to remove token',
          data: undefined,
          timestamp: new Date().toISOString(),
        };
      }

      return {
        success: true,
        data: undefined,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        data: undefined,
        timestamp: new Date().toISOString(),
      };
    }
  }
}

// Utility functions for notification handling
export const notificationUtils = {
  /**
   * Check if notifications are supported in the current environment
   */
  isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  },

  /**
   * Request notification permissions
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      throw new Error('Notifications are not supported in this environment');
    }

    return await Notification.requestPermission();
  },

  /**
   * Check current notification permission status
   */
  getPermissionStatus(): NotificationPermission {
    if (!this.isSupported()) {
      return 'denied';
    }

    return Notification.permission;
  },

  /**
   * Show a local notification (for web)
   */
  showLocalNotification(title: string, options?: NotificationOptions): Notification | null {
    if (!this.isSupported() || this.getPermissionStatus() !== 'granted') {
      return null;
    }

    return new Notification(title, options);
  },
};

export default NotificationClient;
