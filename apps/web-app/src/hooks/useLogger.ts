import { useCallback, useEffect, useRef } from 'react';
import { Logger, LogLevel, LogEntry } from '../utils/logger';

interface UseLoggerOptions {
  minLevel?: LogLevel;
  enableConsole?: boolean;
  enableLocalStorage?: boolean;
  enableRemoteLogging?: boolean;
  remoteEndpoint?: string;
  componentName?: string;
}

interface LoggerHook {
  logger: Logger;
  debug: (message: string, context?: Record<string, any>, action?: string) => void;
  info: (message: string, context?: Record<string, any>, action?: string) => void;
  warn: (message: string, context?: Record<string, any>, action?: string) => void;
  error: (message: string, error?: Error, context?: Record<string, any>, action?: string) => void;
  fatal: (message: string, error?: Error, context?: Record<string, any>, action?: string) => void;
  logEvent: (eventName: string, eventData?: Record<string, any>) => void;
  logUserAction: (action: string, details?: Record<string, any>) => void;
  logPerformance: (metric: string, value: number, unit?: string) => void;
  getLogs: () => LogEntry[];
  clearLogs: () => void;
}

const defaultOptions: UseLoggerOptions = {
  minLevel: LogLevel.INFO,
  enableConsole: true,
  enableLocalStorage: true,
  enableRemoteLogging: process.env.NODE_ENV === 'production',
  remoteEndpoint: process.env.NEXT_PUBLIC_LOG_ENDPOINT,
};

function useLogger(options: UseLoggerOptions = {}): LoggerHook {
  const opts = { ...defaultOptions, ...options };
  
  const loggerRef = useRef<Logger>();
  
  // Initialize logger
  if (!loggerRef.current) {
    loggerRef.current = new Logger({
      minLevel: opts.minLevel!,
      enableConsole: opts.enableConsole!,
      enableLocalStorage: opts.enableLocalStorage!,
      enableRemoteLogging: opts.enableRemoteLogging!,
      remoteEndpoint: opts.remoteEndpoint,
    });
  }

  const logger = loggerRef.current;

  // Convenience methods with component context
  const debug = useCallback((message: string, context?: Record<string, any>, action?: string) => {
    logger.debug(message, context, opts.componentName, action);
  }, [logger, opts.componentName]);

  const info = useCallback((message: string, context?: Record<string, any>, action?: string) => {
    logger.info(message, context, opts.componentName, action);
  }, [logger, opts.componentName]);

  const warn = useCallback((message: string, context?: Record<string, any>, action?: string) => {
    logger.warn(message, context, opts.componentName, action);
  }, [logger, opts.componentName]);

  const error = useCallback((message: string, errorObj?: Error, context?: Record<string, any>, action?: string) => {
    logger.error(message, errorObj, context, opts.componentName, action);
  }, [logger, opts.componentName]);

  const fatal = useCallback((message: string, errorObj?: Error, context?: Record<string, any>, action?: string) => {
    logger.fatal(message, errorObj, context, opts.componentName, action);
  }, [logger, opts.componentName]);

  // Specialized logging methods
  const logEvent = useCallback((eventName: string, eventData?: Record<string, any>) => {
    info(`Event: ${eventName}`, {
      eventName,
      eventData,
      timestamp: new Date().toISOString(),
    }, 'event');
  }, [info]);

  const logUserAction = useCallback((action: string, details?: Record<string, any>) => {
    info(`User action: ${action}`, {
      action,
      details,
      timestamp: new Date().toISOString(),
    }, 'user-action');
  }, [info]);

  const logPerformance = useCallback((metric: string, value: number, unit: string = 'ms') => {
    info(`Performance: ${metric}`, {
      metric,
      value,
      unit,
      timestamp: new Date().toISOString(),
    }, 'performance');
  }, [info]);

  const getLogs = useCallback(() => {
    return logger.getLogs();
  }, [logger]);

  const clearLogs = useCallback(() => {
    logger.clearLogs();
  }, [logger]);

  // Log component mount and unmount (optional)
  useEffect(() => {
    if (opts.componentName) {
      debug(`Hook initialized in ${opts.componentName}`, {}, 'hook-init');
      
      return () => {
        debug(`Hook cleanup in ${opts.componentName}`, {}, 'hook-cleanup');
      };
    }
  }, [debug, opts.componentName]);

  return {
    logger,
    debug,
    info,
    warn,
    error,
    fatal,
    logEvent,
    logUserAction,
    logPerformance,
    getLogs,
    clearLogs,
  };
}

export default useLogger;
