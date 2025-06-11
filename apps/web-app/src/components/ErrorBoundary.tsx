import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Logger, LogLevel } from '../utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  private logger: Logger;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
    this.logger = new Logger({
      minLevel: LogLevel.INFO,
      enableConsole: true,
      enableLocalStorage: true,
      enableRemoteLogging: process.env.NODE_ENV === 'production',
      remoteEndpoint: process.env.NEXT_PUBLIC_LOG_ENDPOINT,
    });
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error with full context
    this.logger.fatal(
      'React Error Boundary caught an error',
      error,
      {
        errorInfo: {
          componentStack: errorInfo.componentStack,
          errorBoundary: this.constructor.name,
        },
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      },
      'ErrorBoundary',
      'componentDidCatch'
    );

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Log that the fallback UI is being rendered
      this.logger.warn(
        'Error boundary fallback UI rendered',
        {
          error: this.state.error?.message,
          stack: this.state.error?.stack,
        },
        'ErrorBoundary',
        'render'
      );

      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <svg
                    className="h-8 w-8 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Something went wrong
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    We're sorry, but an unexpected error occurred. Please refresh the page or try again later.
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
