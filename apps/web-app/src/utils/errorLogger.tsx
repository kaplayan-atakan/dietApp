"use client";

// filepath: c:\dietApp\apps\web-app\src\utils\errorLogger.tsx
import { createErrorLogger, getErrorLogger } from '@ai-fitness/utils';
import { useEffect } from 'react';

// Error logger configuration
const ERROR_LOGGER_CONFIG = {
  apiEndpoint: 'http://localhost:5266/api/logs',
  enabledEnvironments: ['development', 'production'],
  batchSize: 5,
  flushInterval: 3000,
  enableConsoleLogging: process.env.NODE_ENV === 'development'
};

// Initialize error logger
let isInitialized = false;

export const initializeErrorLogger = () => {
  if (!isInitialized) {
    createErrorLogger(ERROR_LOGGER_CONFIG);
    isInitialized = true;
  }
};

// Hook for error logging in React components
export const useErrorLogger = () => {
  useEffect(() => {
    initializeErrorLogger();
  }, []);

  // Initialize synchronously if not already done
  if (!isInitialized) {
    initializeErrorLogger();
  }

  return getErrorLogger();
};

// React Error Boundary component
import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to our logging system
    try {
      const logger = getErrorLogger();
      logger.error('React Component Error', {
        component: 'ErrorBoundary',
        action: 'ComponentError',
        errorDetails: error.message,
        stackTrace: error.stack,
        context: {
          componentStack: errorInfo.componentStack,
          errorBoundary: true
        }
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback;
      if (FallbackComponent) {
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Something went wrong</h3>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                An unexpected error occurred. Our team has been notified and will look into this issue.
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={this.resetError}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Try again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                Reload page
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4">
                <summary className="text-sm text-gray-500 cursor-pointer">Error details (development)</summary>
                <pre className="mt-2 text-xs text-gray-600 bg-gray-100 p-2 rounded overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
