import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../components/ErrorBoundary';

// Mock the logger
jest.mock('../utils/logger', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    fatal: jest.fn(),
    warn: jest.fn(),
  })),
  LogLevel: {
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    FATAL: 4,
  },
}));

// Component that throws an error
const ThrowError = ({ shouldError }: { shouldError: boolean }) => {
  if (shouldError) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console.error for these tests since we expect errors
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldError={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('should render error UI when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldError={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/unexpected error occurred/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /refresh page/i })).toBeInTheDocument();
  });

  it('should render custom fallback UI when provided', () => {
    const CustomFallback = <div>Custom error message</div>;

    render(
      <ErrorBoundary fallback={CustomFallback}>
        <ThrowError shouldError={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('should call onError callback when error occurs', () => {
    const onError = jest.fn();

    render(
      <ErrorBoundary onError={onError}>
        <ThrowError shouldError={true} />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    );
  });

  it('should log fatal error when component crashes', () => {
    const { Logger } = require('../utils/logger');
    const mockLogger = new Logger();

    render(
      <ErrorBoundary>
        <ThrowError shouldError={true} />
      </ErrorBoundary>
    );

    expect(mockLogger.fatal).toHaveBeenCalledWith(
      'React Error Boundary caught an error',
      expect.any(Error),
      expect.objectContaining({
        errorInfo: expect.objectContaining({
          componentStack: expect.any(String),
          errorBoundary: 'ErrorBoundary',
        }),
        userAgent: expect.any(String),
        url: expect.any(String),
        timestamp: expect.any(String),
      }),
      'ErrorBoundary',
      'componentDidCatch'
    );
  });

  it('should log when fallback UI is rendered', () => {
    const { Logger } = require('../utils/logger');
    const mockLogger = new Logger();

    render(
      <ErrorBoundary>
        <ThrowError shouldError={true} />
      </ErrorBoundary>
    );

    expect(mockLogger.warn).toHaveBeenCalledWith(
      'Error boundary fallback UI rendered',
      expect.objectContaining({
        error: 'Test error',
        stack: expect.any(String),
      }),
      'ErrorBoundary',
      'render'
    );
  });
});
