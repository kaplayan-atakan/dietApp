interface LogEntry {
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
  component?: string;
  action?: string;
  context?: any;
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  errorDetails?: string;
  stackTrace?: string;
  url?: string;
  userAgent?: string;
}

interface ErrorLoggerConfig {
  apiEndpoint: string;
  apiKey?: string;
  enabledEnvironments: string[];
  batchSize: number;
  flushInterval: number;
  enableConsoleLogging: boolean;
}

class ErrorLogger {
  private config: ErrorLoggerConfig;
  private logQueue: LogEntry[] = [];
  private flushTimeout?: NodeJS.Timeout;
  private sessionId: string;

  constructor(config: Partial<ErrorLoggerConfig> = {}) {
    this.config = {
      apiEndpoint: config.apiEndpoint || 'http://localhost:5266/api/logs',
      enabledEnvironments: config.enabledEnvironments || ['development', 'production'],
      batchSize: config.batchSize || 10,
      flushInterval: config.flushInterval || 5000,
      enableConsoleLogging: config.enableConsoleLogging ?? true,
      ...config
    };

    this.sessionId = this.generateSessionId();
    this.setupGlobalErrorHandlers();
    this.setupPeriodicFlush();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private shouldLog(): boolean {
    const env = process.env.NODE_ENV || 'development';
    return this.config.enabledEnvironments.includes(env);
  }

  private setupGlobalErrorHandlers(): void {
    // Unhandled errors
    window.addEventListener('error', (event) => {
      this.error('Unhandled JavaScript Error', {
        component: 'Global',
        action: 'UnhandledError',
        errorDetails: event.error?.message || event.message,
        stackTrace: event.error?.stack,
        url: event.filename,
        context: {
          lineno: event.lineno,
          colno: event.colno,
          filename: event.filename
        }
      });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.error('Unhandled Promise Rejection', {
        component: 'Global',
        action: 'UnhandledPromiseRejection',
        errorDetails: event.reason?.message || String(event.reason),
        stackTrace: event.reason?.stack,
        context: {
          reason: event.reason
        }
      });
    });

    // React error boundary support
    if (typeof window !== 'undefined') {
      (window as any).__errorLogger = this;
    }
  }

  private setupPeriodicFlush(): void {
    this.flushTimeout = setInterval(() => {
      this.flush();
    }, this.config.flushInterval);
  }

  private async sendToApi(logs: LogEntry[]): Promise<void> {
    if (!this.shouldLog()) return;

    try {      const response = await fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'X-API-Key': this.config.apiKey })
        },        body: JSON.stringify({
          Logs: logs.map(log => ({
            ...log,
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,
            ipAddress: '::1', // Will be set by server
            userAgent: navigator.userAgent,
            url: window.location.href,
            context: log.context ? JSON.stringify(log.context) : null // Convert context to string
          }))
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to send logs: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      if (this.config.enableConsoleLogging) {
        console.error('Failed to send logs to API:', error);
        console.log('Failed logs:', logs);
      }
    }
  }

  private log(entry: LogEntry): void {
    if (!this.shouldLog()) return;

    // Console logging for development
    if (this.config.enableConsoleLogging) {
      const logMethod = entry.level.toLowerCase() as 'info' | 'warn' | 'error' | 'debug';
      console[logMethod](`[${entry.level}] ${entry.component || 'Unknown'}: ${entry.message}`, entry);
    }

    // Add to queue
    this.logQueue.push(entry);

    // Auto-flush if queue is full
    if (this.logQueue.length >= this.config.batchSize) {
      this.flush();
    }
  }

  public info(message: string, options: Partial<LogEntry> = {}): void {
    this.log({
      level: 'INFO',
      message,
      ...options
    });
  }

  public warn(message: string, options: Partial<LogEntry> = {}): void {
    this.log({
      level: 'WARN',
      message,
      ...options
    });
  }

  public error(message: string, options: Partial<LogEntry> = {}): void {
    this.log({
      level: 'ERROR',
      message,
      ...options
    });
  }

  public debug(message: string, options: Partial<LogEntry> = {}): void {
    this.log({
      level: 'DEBUG',
      message,
      ...options
    });
  }

  public logApiError(error: any, endpoint: string, method: string = 'GET'): void {
    this.error(`API Error: ${method} ${endpoint}`, {
      component: 'API',
      action: 'ApiCall',
      errorDetails: error.message || String(error),
      stackTrace: error.stack,
      context: {
        endpoint,
        method,
        status: error.status || error.code,
        response: error.response
      }
    });
  }

  public logUserAction(action: string, component: string, context: any = {}): void {
    this.info(`User action: ${action}`, {
      component,
      action,
      context
    });
  }

  public logPerformance(action: string, duration: number, component: string): void {
    const level = duration > 3000 ? 'WARN' : 'INFO';
    this.log({
      level,
      message: `Performance: ${action} took ${duration}ms`,
      component,
      action: 'Performance',
      context: { duration, action }
    });
  }

  public setUserId(userId: string): void {
    this.logQueue.forEach(log => {
      if (!log.userId) log.userId = userId;
    });
  }

  public flush(): void {
    if (this.logQueue.length === 0) return;

    const logsToSend = [...this.logQueue];
    this.logQueue = [];

    this.sendToApi(logsToSend);
  }

  public destroy(): void {
    this.flush();
    if (this.flushTimeout) {
      clearInterval(this.flushTimeout);
    }
  }
}

// Singleton instance
let errorLoggerInstance: ErrorLogger | null = null;

export const createErrorLogger = (config?: Partial<ErrorLoggerConfig>): ErrorLogger => {
  if (!errorLoggerInstance) {
    errorLoggerInstance = new ErrorLogger(config);
  }
  return errorLoggerInstance;
};

export const getErrorLogger = (): ErrorLogger => {
  if (!errorLoggerInstance) {
    throw new Error('ErrorLogger not initialized. Call createErrorLogger first.');
  }
  return errorLoggerInstance;
};

export { ErrorLogger };
export type { LogEntry, ErrorLoggerConfig };
