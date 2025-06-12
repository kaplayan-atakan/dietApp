import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    try {
      if (typeof window !== 'undefined') {
        // Import getErrorLogger dynamically to avoid SSR issues
        import('./errorLogger').then(({ getErrorLogger }) => {
          const logger = getErrorLogger();
          logger.error('React Error Boundary caught error', {
            component: 'ErrorBoundary',
            action: 'ComponentError',
            errorDetails: error.message,
            stackTrace: error.stack,
            context: {
              componentStack: errorInfo.componentStack,
              errorBoundary: true
            }
          });
        }).catch(logError => {
          console.error('Failed to log React error:', logError);
        });
      }
    } catch (logError) {
      console.error('Failed to log React error:', logError);
      console.error('Original error:', error);
    }
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} />;
      }
      
      return (
        <div style={{ padding: '20px', border: '1px solid red', margin: '10px' }}>
          <h2>Something went wrong.</h2>
          <p>{this.state.error.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}
