// Logger utility for frontend applications
// Provides structured logging with different levels and error tracking

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: Error;
  userId?: string;
  sessionId?: string;
  component?: string;
  action?: string;
}

export interface LoggerConfig {
  minLevel: LogLevel;
  enableConsole: boolean;
  enableLocalStorage: boolean;
  enableRemoteLogging: boolean;
  remoteEndpoint?: string;
  maxStorageEntries: number;
  includeSensitiveData: boolean;
}

export class Logger {
  private config: LoggerConfig;
  private sessionId: string;
  private storageKey = 'ai-fitness-logs';

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      minLevel: LogLevel.INFO,
      enableConsole: true,
      enableLocalStorage: true,
      enableRemoteLogging: false,
      maxStorageEntries: 1000,
      includeSensitiveData: false,
      ...config
    };
    
    this.sessionId = this.generateSessionId();
    this.initializeStorage();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeStorage(): void {
    if (this.config.enableLocalStorage && typeof window !== 'undefined') {
      try {
        const existingLogs = localStorage.getItem(this.storageKey);
        if (!existingLogs) {
          localStorage.setItem(this.storageKey, JSON.stringify([]));
        }
      } catch (error) {
        console.warn('Failed to initialize logger storage:', error);
      }
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.minLevel;
  }

  private sanitizeContext(context: Record<string, any>): Record<string, any> {
    if (this.config.includeSensitiveData) {
      return context;
    }

    const sensitiveKeys = ['password', 'token', 'authorization', 'secret', 'key'];
    const sanitized = { ...context };

    const sanitizeObject = (obj: any): any => {
      if (typeof obj !== 'object' || obj === null) return obj;
      
      if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
      }

      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
          result[key] = '[REDACTED]';
        } else if (typeof value === 'object') {
          result[key] = sanitizeObject(value);
        } else {
          result[key] = value;
        }
      }
      return result;
    };

    return sanitizeObject(sanitized);
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error,
    component?: string,
    action?: string
  ): LogEntry {
    const userId = this.getCurrentUserId();
    
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: context ? this.sanitizeContext(context) : undefined,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } as any : undefined,
      userId,
      sessionId: this.sessionId,
      component,
      action
    };
  }
  private getCurrentUserId(): string | undefined {
    try {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        if (token) {
          // Basic JWT decode (in production, use a proper JWT library)
          const payload = JSON.parse(atob(token.split('.')[1]));
          return payload.sub || payload.userId || payload.id;
        }
      }
    } catch (error) {
      // Ignore JWT decode errors
    }
    return undefined;
  }

  private writeToConsole(entry: LogEntry): void {
    if (!this.config.enableConsole) return;

    const levelNames = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'];
    const levelColors = [
      'color: #6B7280', // DEBUG - gray
      'color: #3B82F6', // INFO - blue
      'color: #F59E0B', // WARN - yellow
      'color: #EF4444', // ERROR - red
      'color: #DC2626'  // FATAL - dark red
    ];

    const logMethod = entry.level >= LogLevel.ERROR ? 'error' :
                     entry.level >= LogLevel.WARN ? 'warn' :
                     'log';    const prefix = `%c[${levelNames[entry.level]}] ${entry.timestamp}`;
    const args: any[] = [prefix, levelColors[entry.level], entry.message];

    if (entry.context) {
      args.push('\nContext:', entry.context);
    }

    if (entry.error) {
      args.push('\nError:', entry.error);
    }

    if (entry.component) {
      args.push(`\nComponent: ${entry.component}`);
    }

    if (entry.action) {
      args.push(`\nAction: ${entry.action}`);
    }

    console[logMethod](...args);
  }

  private writeToStorage(entry: LogEntry): void {
    if (!this.config.enableLocalStorage || typeof window === 'undefined') return;

    try {
      const logs = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      logs.push(entry);

      // Keep only the most recent entries
      if (logs.length > this.config.maxStorageEntries) {
        logs.splice(0, logs.length - this.config.maxStorageEntries);
      }

      localStorage.setItem(this.storageKey, JSON.stringify(logs));
    } catch (error) {
      console.warn('Failed to write log to storage:', error);
    }
  }

  private async writeToRemote(entry: LogEntry): Promise<void> {
    if (!this.config.enableRemoteLogging || !this.config.remoteEndpoint) return;

    try {
      await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry)
      });
    } catch (error) {
      console.warn('Failed to send log to remote endpoint:', error);
    }
  }

  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error,
    component?: string,
    action?: string
  ): void {
    if (!this.shouldLog(level)) return;

    const entry = this.createLogEntry(level, message, context, error, component, action);

    this.writeToConsole(entry);
    this.writeToStorage(entry);

    if (this.config.enableRemoteLogging) {
      this.writeToRemote(entry).catch(() => {
        // Remote logging failed, but don't interrupt the application
      });
    }
  }

  // Public logging methods
  debug(message: string, context?: Record<string, any>, component?: string, action?: string): void {
    this.log(LogLevel.DEBUG, message, context, undefined, component, action);
  }

  info(message: string, context?: Record<string, any>, component?: string, action?: string): void {
    this.log(LogLevel.INFO, message, context, undefined, component, action);
  }

  warn(message: string, context?: Record<string, any>, component?: string, action?: string): void {
    this.log(LogLevel.WARN, message, context, undefined, component, action);
  }

  error(message: string, error?: Error, context?: Record<string, any>, component?: string, action?: string): void {
    this.log(LogLevel.ERROR, message, context, error, component, action);
  }

  fatal(message: string, error?: Error, context?: Record<string, any>, component?: string, action?: string): void {
    this.log(LogLevel.FATAL, message, context, error, component, action);
  }

  // Utility methods
  getLogs(): LogEntry[] {
    if (typeof window === 'undefined') return [];
    
    try {
      return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    } catch (error) {
      console.warn('Failed to retrieve logs from storage:', error);
      return [];
    }
  }

  clearLogs(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify([]));
      } catch (error) {
        console.warn('Failed to clear logs from storage:', error);
      }
    }
  }

  setConfig(newConfig: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getSessionId(): string {
    return this.sessionId;
  }
}

// Create default logger instance
export const logger = new Logger({
  minLevel: process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO,
  enableRemoteLogging: process.env.NODE_ENV === 'production',
  remoteEndpoint: process.env.NEXT_PUBLIC_LOG_ENDPOINT
});

export default logger;
