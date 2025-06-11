import { renderHook, act } from '@testing-library/react';
import useLogger from '../hooks/useLogger';
import { LogLevel } from '../utils/logger';

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock console methods - Logger uses log, warn, error
const consoleMock = {
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock fetch for remote logging
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;

describe('useLogger hook', () => {
  let originalConsole: Console;

  beforeEach(() => {
    // Setup console mock
    originalConsole = global.console;
    Object.defineProperty(global, 'console', {
      value: consoleMock,
      writable: true
    });

    jest.clearAllMocks();
    mockLocalStorage.clear();
    (global.fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    // Restore original console
    Object.defineProperty(global, 'console', {
      value: originalConsole,
      writable: true
    });
  });

  describe('Basic functionality', () => {
    it('should initialize logger with default options', () => {
      const { result } = renderHook(() => useLogger());
      
      expect(result.current.logger).toBeDefined();
      expect(typeof result.current.debug).toBe('function');
      expect(typeof result.current.info).toBe('function');
      expect(typeof result.current.warn).toBe('function');
      expect(typeof result.current.error).toBe('function');
      expect(typeof result.current.fatal).toBe('function');
      expect(typeof result.current.logEvent).toBe('function');
      expect(typeof result.current.logUserAction).toBe('function');
      expect(typeof result.current.logPerformance).toBe('function');
      expect(typeof result.current.getLogs).toBe('function');
      expect(typeof result.current.clearLogs).toBe('function');
    });
  });
  describe('Logging methods', () => {
    it('should log debug messages', () => {
      const { result } = renderHook(() => useLogger({ minLevel: LogLevel.DEBUG }));
        act(() => {
        result.current.debug('Test debug message');
      });
      
      expect(consoleMock.log).toHaveBeenCalled();
    });

    it('should log info messages', () => {
      const { result } = renderHook(() => useLogger({ minLevel: LogLevel.DEBUG }));
        act(() => {
        result.current.info('Test info message');
      });
      
      expect(consoleMock.log).toHaveBeenCalled();
    });

    it('should log warning messages', () => {
      const { result } = renderHook(() => useLogger({ minLevel: LogLevel.DEBUG }));
        act(() => {
        result.current.warn('Test warning message');
      });
      
      expect(consoleMock.warn).toHaveBeenCalled();
    });

    it('should log error messages', () => {
      const { result } = renderHook(() => useLogger({ minLevel: LogLevel.DEBUG }));
        act(() => {
        result.current.error('Test error message', new Error('Test'));
      });
      
      expect(consoleMock.error).toHaveBeenCalled();
    });
  });
  describe('Event logging', () => {
    it('should log events', () => {
      const { result } = renderHook(() => useLogger({ minLevel: LogLevel.DEBUG }));
        act(() => {
        result.current.logEvent('test_event');
      });
      
      expect(consoleMock.log).toHaveBeenCalled();
    });

    it('should log user actions', () => {
      const { result } = renderHook(() => useLogger({ minLevel: LogLevel.DEBUG }));
        act(() => {
        result.current.logUserAction('test_action');
      });
      
      expect(consoleMock.log).toHaveBeenCalled();
    });
  });

  describe('Performance logging', () => {
    it('should log performance metrics', () => {
      const { result } = renderHook(() => useLogger({ minLevel: LogLevel.DEBUG }));
        act(() => {
        result.current.logPerformance('test_metric', 100);
      });
      
      expect(consoleMock.log).toHaveBeenCalled();
    });
  });
});