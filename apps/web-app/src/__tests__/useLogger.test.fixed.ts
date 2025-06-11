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
  log: jest.spyOn(console, 'log').mockImplementation(),
  warn: jest.spyOn(console, 'warn').mockImplementation(),
  error: jest.spyOn(console, 'error').mockImplementation(),
};

// Mock fetch for remote logging
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;

describe('useLogger hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
    (global.fetch as jest.Mock).mockClear();
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
    
    it('should accept component name in options', () => {
      const { result } = renderHook(() => useLogger({ componentName: 'TestComponent' }));
      
      expect(result.current.logger).toBeDefined();
    });
  });

  describe('Logging methods', () => {
    it('should log debug messages', () => {
      const { result } = renderHook(() => useLogger());
      
      act(() => {
        result.current.debug('Test debug message', { data: 'test' }, 'test-action');
      });
      
      expect(consoleMock.log).toHaveBeenCalledWith(
        expect.stringContaining('[DEBUG]'),
        expect.any(String),
        'Test debug message',
        expect.stringContaining('Context:'),
        expect.objectContaining({ data: 'test' }),
        expect.stringContaining('Action:'),
        'test-action'
      );
    });

    it('should log info messages', () => {
      const { result } = renderHook(() => useLogger());
      
      act(() => {
        result.current.info('Test info message', { data: 'test' });
      });
      
      expect(consoleMock.log).toHaveBeenCalledWith(
        expect.stringContaining('[INFO]'),
        expect.any(String),
        'Test info message',
        expect.stringContaining('Context:'),
        expect.objectContaining({ data: 'test' })
      );
    });

    it('should log warning messages', () => {
      const { result } = renderHook(() => useLogger());
      
      act(() => {
        result.current.warn('Test warning message');
      });
      
      expect(consoleMock.warn).toHaveBeenCalledWith(
        expect.stringContaining('[WARN]'),
        expect.any(String),
        'Test warning message'
      );
    });

    it('should log error messages', () => {
      const { result } = renderHook(() => useLogger());
      const testError = new Error('Test error');
      
      act(() => {
        result.current.error('Test error message', testError, { context: 'test' });
      });
      
      expect(consoleMock.error).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
        expect.any(String),
        'Test error message',
        expect.stringContaining('Context:'),
        expect.objectContaining({ context: 'test' }),
        expect.stringContaining('Error:'),
        testError
      );
    });

    it('should log fatal messages', () => {
      const { result } = renderHook(() => useLogger());
      const testError = new Error('Fatal error');
      
      act(() => {
        result.current.fatal('Test fatal message', testError);
      });
      
      expect(consoleMock.error).toHaveBeenCalledWith(
        expect.stringContaining('[FATAL]'),
        expect.any(String),
        'Test fatal message',
        expect.stringContaining('Error:'),
        testError
      );
    });

    it('should include component name in logs when provided', () => {
      const { result } = renderHook(() => useLogger({ componentName: 'TestComponent' }));
      
      act(() => {
        result.current.info('Test message');
      });
      
      expect(consoleMock.log).toHaveBeenCalledWith(
        expect.stringContaining('[INFO]'),
        expect.any(String),
        'Test message',
        expect.stringContaining('Component:'),
        'TestComponent'
      );
    });
  });

  describe('Event logging', () => {
    it('should log events with context', () => {
      const { result } = renderHook(() => useLogger());
      
      act(() => {
        result.current.logEvent('user_click', {
          button: 'submit',
          form: 'login'
        });
      });
      
      expect(consoleMock.log).toHaveBeenCalledWith(
        expect.stringContaining('[INFO]'),
        expect.any(String),
        'Event: user_click',
        expect.stringContaining('Context:'),
        expect.objectContaining({
          eventName: 'user_click',
          eventData: {
            button: 'submit',
            form: 'login'
          }
        })
      );
    });
  });

  describe('Performance logging', () => {
    it('should log performance metrics', () => {
      const { result } = renderHook(() => useLogger());
      
      act(() => {
        result.current.logPerformance('page_load', 1500, 'ms');
      });
      
      expect(consoleMock.log).toHaveBeenCalledWith(
        expect.stringContaining('[INFO]'),
        expect.any(String),
        'Performance: page_load',
        expect.stringContaining('Context:'),
        expect.objectContaining({
          metric: 'page_load',
          value: 1500,
          unit: 'ms'
        })
      );
    });

    it('should log user actions', () => {
      const { result } = renderHook(() => useLogger());
      
      act(() => {
        result.current.logUserAction('button_click', { buttonId: 'submit-btn' });
      });
      
      expect(consoleMock.log).toHaveBeenCalledWith(
        expect.stringContaining('[INFO]'),
        expect.any(String),
        'User action: button_click',
        expect.stringContaining('Context:'),
        expect.objectContaining({
          action: 'button_click',
          details: { buttonId: 'submit-btn' }
        })
      );
    });
  });

  describe('Configuration options', () => {
    it('should respect log level configuration', () => {
      const { result } = renderHook(() => useLogger({ 
        componentName: 'TestComponent',
        minLevel: LogLevel.WARN 
      }));
      
      // Clear any previous calls
      consoleMock.log.mockClear();
      consoleMock.warn.mockClear();
      consoleMock.error.mockClear();
      
      act(() => {
        result.current.debug('Debug message');
        result.current.info('Info message');
        result.current.warn('Warning message');
      });
      
      // Should not have any debug/info logging calls
      expect(consoleMock.log).not.toHaveBeenCalled();
      // Only warning should be logged
      expect(consoleMock.warn).toHaveBeenCalledWith(
        expect.stringContaining('[WARN]'),
        expect.any(String),
        'Warning message',
        expect.stringContaining('Component:'),
        'TestComponent'
      );
    });

    it('should log all levels when minLevel is DEBUG', () => {
      const { result } = renderHook(() => useLogger({ 
        componentName: 'TestComponent',
        minLevel: LogLevel.DEBUG 
      }));
      
      consoleMock.log.mockClear();
      consoleMock.warn.mockClear();
      consoleMock.error.mockClear();
      
      act(() => {
        result.current.debug('Debug message');
        result.current.info('Info message');
        result.current.warn('Warning message');
        result.current.error('Error message', new Error('test'));
      });
      
      // All should be logged
      expect(consoleMock.log).toHaveBeenCalledTimes(2); // debug + info
      expect(consoleMock.warn).toHaveBeenCalledTimes(1);
      expect(consoleMock.error).toHaveBeenCalledTimes(1);
    });
  });

  describe('Remote logging', () => {
    it('should send logs to remote endpoint when enabled', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const { result } = renderHook(() => useLogger({
        enableRemoteLogging: true,
        remoteEndpoint: 'https://api.example.com/logs'
      }));
      
      await act(async () => {
        result.current.error('Test error for remote logging', new Error('Test'));
        // Wait a tick for the async operation
        await new Promise(resolve => setTimeout(resolve, 0));
      });
      
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/logs',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: expect.stringContaining('Test error for remote logging'),
        })
      );
    });
  });

  describe('Local storage', () => {
    it('should store logs in localStorage when enabled', () => {
      const { result } = renderHook(() => useLogger({
        enableLocalStorage: true
      }));
      
      act(() => {
        result.current.info('Test storage message', { test: true });
      });
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'ai-fitness-logs',
        expect.stringContaining('Test storage message')
      );
    });
  });

  describe('Logger instance access', () => {
    it('should provide access to getLogs method', () => {
      const { result } = renderHook(() => useLogger());
      
      expect(result.current.getLogs).toBeDefined();
      expect(typeof result.current.getLogs()).toBe('object');
    });

    it('should provide access to clearLogs method', () => {
      const { result } = renderHook(() => useLogger());
      
      expect(result.current.clearLogs).toBeDefined();
      expect(typeof result.current.clearLogs).toBe('function');
    });
  });
});
