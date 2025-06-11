import { Logger, LogLevel, LogEntry, LoggerConfig } from '../utils/logger';

// Mock localStorage
const localStorageMock = (() => {
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
    })
  };
})();

// Mock fetch
global.fetch = jest.fn();

// Mock console methods
const consoleMock = {
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

describe('Logger', () => {
  let logger: Logger;
  let originalLocalStorage: Storage;
  let originalConsole: Console;

  beforeEach(() => {
    // Setup mocks
    originalLocalStorage = global.localStorage;
    originalConsole = global.console;
    
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
    
    Object.defineProperty(global, 'console', {
      value: consoleMock,
      writable: true
    });

    // Reset mocks
    jest.clearAllMocks();
    localStorageMock.clear();

    // Create logger instance
    logger = new Logger({
      minLevel: LogLevel.DEBUG,
      enableConsole: true,
      enableLocalStorage: true,
      enableRemoteLogging: false,
      maxStorageEntries: 10
    });
  });

  afterEach(() => {
    // Restore original objects
    Object.defineProperty(global, 'localStorage', {
      value: originalLocalStorage,
      writable: true
    });
    
    Object.defineProperty(global, 'console', {
      value: originalConsole,
      writable: true
    });
  });

  describe('initialization', () => {
    it('should generate a unique session ID', () => {
      const logger1 = new Logger();
      const logger2 = new Logger();
      
      expect(logger1.getSessionId()).not.toBe(logger2.getSessionId());
      expect(logger1.getSessionId()).toMatch(/^session_\d+_[a-z0-9]+$/);
    });

    it('should initialize localStorage with empty array', () => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'ai-fitness-logs',
        JSON.stringify([])
      );
    });
  });

  describe('logging levels', () => {
    it('should log debug messages when min level is DEBUG', () => {
      logger.debug('Debug message', { data: 'test' }, 'TestComponent', 'testAction');
      
      expect(consoleMock.log).toHaveBeenCalled();
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it('should not log debug messages when min level is INFO', () => {
      const infoLogger = new Logger({ minLevel: LogLevel.INFO });
      
      infoLogger.debug('Debug message');
      
      expect(consoleMock.log).not.toHaveBeenCalled();
    });

    it('should log info messages', () => {
      logger.info('Info message', { userId: '123' });
      
      expect(consoleMock.log).toHaveBeenCalled();
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it('should log warning messages', () => {
      logger.warn('Warning message', { warning: 'test' });
      
      expect(consoleMock.warn).toHaveBeenCalled();
    });

    it('should log error messages', () => {
      const error = new Error('Test error');
      logger.error('Error message', error, { errorData: 'test' });
      
      expect(consoleMock.error).toHaveBeenCalled();
    });

    it('should log fatal messages', () => {
      const error = new Error('Fatal error');
      logger.fatal('Fatal message', error, { fatalData: 'test' });
      
      expect(consoleMock.error).toHaveBeenCalled();
    });
  });

  describe('context sanitization', () => {
    it('should redact sensitive data by default', () => {
      logger.info('Login attempt', {
        username: 'user@example.com',
        password: 'secret123',
        token: 'jwt-token',
        normalData: 'normal'
      });

      const logs = logger.getLogs();
      const logEntry = logs[logs.length - 1];
      
      expect(logEntry.context?.password).toBe('[REDACTED]');
      expect(logEntry.context?.token).toBe('[REDACTED]');
      expect(logEntry.context?.normalData).toBe('normal');
      expect(logEntry.context?.username).toBe('user@example.com');
    });

    it('should include sensitive data when configured', () => {
      const sensitiveLogger = new Logger({ includeSensitiveData: true });
      
      sensitiveLogger.info('Login attempt', {
        password: 'secret123',
        token: 'jwt-token'
      });

      const logs = sensitiveLogger.getLogs();
      const logEntry = logs[logs.length - 1];
      
      expect(logEntry.context?.password).toBe('secret123');
      expect(logEntry.context?.token).toBe('jwt-token');
    });

    it('should sanitize nested objects', () => {
      logger.info('API request', {
        user: {
          id: '123',
          password: 'secret',
          profile: {
            authorization: 'bearer-token'
          }
        }
      });

      const logs = logger.getLogs();
      const logEntry = logs[logs.length - 1];
      
      expect(logEntry.context?.user.password).toBe('[REDACTED]');
      expect(logEntry.context?.user.profile.authorization).toBe('[REDACTED]');
      expect(logEntry.context?.user.id).toBe('123');
    });
  });

  describe('storage management', () => {
    it('should store logs in localStorage', () => {
      logger.info('Test message');
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'ai-fitness-logs',
        expect.stringContaining('Test message')
      );
    });

    it('should limit stored log entries', () => {
      // Add more logs than the limit
      for (let i = 0; i < 15; i++) {
        logger.info(`Message ${i}`);
      }

      const logs = logger.getLogs();
      expect(logs.length).toBe(10); // maxStorageEntries
      expect(logs[0].message).toBe('Message 5'); // First 5 should be removed
    });

    it('should retrieve logs from storage', () => {
      logger.info('Message 1');
      logger.error('Error message', new Error('Test error'));
      
      const logs = logger.getLogs();
      
      expect(logs).toHaveLength(2);
      expect(logs[0].message).toBe('Message 1');
      expect(logs[1].message).toBe('Error message');
      expect(logs[1].error).toBeDefined();
    });

    it('should clear logs from storage', () => {
      logger.info('Message to clear');
      expect(logger.getLogs()).toHaveLength(1);
      
      logger.clearLogs();
      expect(logger.getLogs()).toHaveLength(0);
    });
  });

  describe('remote logging', () => {
    beforeEach(() => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200
      });
    });

    it('should send logs to remote endpoint when enabled', async () => {
      const remoteLogger = new Logger({
        enableRemoteLogging: true,
        remoteEndpoint: 'https://api.example.com/logs'
      });

      remoteLogger.error('Remote error', new Error('Test'));

      // Wait for async remote logging
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/logs',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('Remote error')
        })
      );
    });

    it('should not send logs when remote logging is disabled', () => {
      logger.error('Local only error');
      
      expect(global.fetch).not.toHaveBeenCalled();
    });    it('should handle remote logging failures gracefully', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
      
      const remoteLogger = new Logger({
        enableRemoteLogging: true,
        remoteEndpoint: 'https://api.example.com/logs'
      });

      // Log an error that will trigger remote logging
      remoteLogger.error('Error that fails to send');

      // Wait for the async remote logging to complete
      await new Promise(resolve => setTimeout(resolve, 10));

      // The error should not throw the application
      expect(global.fetch).toHaveBeenCalled();
      
      // Since the remote logging failure is caught internally and doesn't log to console,
      // we just verify that the method doesn't throw
      expect(() => {
        remoteLogger.error('Another error');
      }).not.toThrow();
    });
  });

  describe('log entry structure', () => {
    it('should create properly structured log entries', () => {
      const testError = new Error('Test error');
      logger.error('Test message', testError, { contextData: 'test' }, 'TestComponent', 'testAction');

      const logs = logger.getLogs();
      const entry = logs[logs.length - 1];

      expect(entry).toMatchObject({
        level: LogLevel.ERROR,
        message: 'Test message',
        context: { contextData: 'test' },
        component: 'TestComponent',
        action: 'testAction',
        sessionId: logger.getSessionId()
      });

      expect(entry.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      expect(entry.error).toMatchObject({
        name: 'Error',
        message: 'Test error',
        stack: expect.any(String)
      });
    });
  });

  describe('configuration updates', () => {
    it('should update configuration dynamically', () => {
      logger.setConfig({ minLevel: LogLevel.ERROR });
      
      logger.info('This should not log');
      logger.error('This should log');

      expect(consoleMock.log).not.toHaveBeenCalled();
      expect(consoleMock.error).toHaveBeenCalled();
    });
  });
  describe('user ID extraction', () => {
    beforeEach(() => {
      // Mock localStorage.getItem for token
      localStorageMock.getItem.mockImplementation((key: string) => {
        if (key === 'auth_token') {
          // JWT with payload: { sub: 'user123' }
          return 'header.eyJzdWIiOiJ1c2VyMTIzIn0.signature';
        }
        return null;
      });
    });    it('should extract user ID from JWT token', () => {
      // Create a proper base64-encoded JWT payload using Buffer (available in Node.js)
      const payload = { sub: 'user123' };
      const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');
      const mockToken = `header.${encodedPayload}.signature`;
      
      // Create an in-memory storage for this test
      const mockStorage: { [key: string]: string } = {
        'auth_token': mockToken,
        'ai-fitness-logs': '[]'
      };
      
      // Reset all mocks completely
      jest.clearAllMocks();
      localStorageMock.getItem.mockImplementation((key: string) => {
        return mockStorage[key] || null;
      });
      
      localStorageMock.setItem.mockImplementation((key: string, value: string) => {
        mockStorage[key] = value;
      });

      // Create new logger instance to pick up the mocked token
      const testLogger = new Logger({
        minLevel: LogLevel.DEBUG,
        enableConsole: true,
        enableLocalStorage: true,
      });

      testLogger.info('User action');
      
      const logs = testLogger.getLogs();
      expect(logs.length).toBeGreaterThan(0);
      
      const entry = logs[logs.length - 1];
      expect(entry).toBeDefined();
      expect(entry.userId).toBe('user123');
      expect(entry.message).toBe('User action');
    });
  });
});
