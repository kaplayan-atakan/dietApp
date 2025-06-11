'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { initializeErrorLogger } from '../utils/errorLogger';
import { getErrorLogger } from '@ai-fitness/utils';

const ErrorLoggerContext = createContext<void>(undefined);

interface ErrorLoggerProviderProps {
  children: ReactNode;
}

export function ErrorLoggerProvider({ children }: ErrorLoggerProviderProps) {
  useEffect(() => {
    // Initialize error logger when app starts
    initializeErrorLogger();
    
    // Log app initialization
    try {
      const logger = getErrorLogger();
      logger.info('Web app initialized', {
        component: 'App',
        action: 'Initialize',
        context: {
          userAgent: navigator.userAgent,
          url: window.location.href,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Failed to log app initialization:', error);
    }
  }, []);

  return (
    <ErrorLoggerContext.Provider value={undefined}>
      {children}
    </ErrorLoggerContext.Provider>
  );
}

export function useErrorLoggerContext() {
  return useContext(ErrorLoggerContext);
}
