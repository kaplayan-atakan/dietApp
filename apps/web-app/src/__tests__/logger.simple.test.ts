import { Logger } from '../utils/logger';

describe('Logger - Basic Tests', () => {
  let logger: Logger;
  let consoleSpy: {
    log: jest.SpyInstance;
    info: jest.SpyInstance;
    warn: jest.SpyInstance;
    error: jest.SpyInstance;
    debug: jest.SpyInstance;
  };

  beforeEach(() => {
    // Mock console methods
    consoleSpy = {
      log: jest.spyOn(console, 'log').mockImplementation(),
      info: jest.spyOn(console, 'info').mockImplementation(),
      warn: jest.spyOn(console, 'warn').mockImplementation(),
      error: jest.spyOn(console, 'error').mockImplementation(),
      debug: jest.spyOn(console, 'debug').mockImplementation(),
    };

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
        length: 0,
        key: jest.fn(),
      },
      writable: true,
    });

    // Mock fetch
    global.fetch = jest.fn();

    logger = new Logger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should create logger instance', () => {
    expect(logger).toBeInstanceOf(Logger);
  });

  test('should log info messages to console', () => {
    logger.info('Test message');
    expect(consoleSpy.log).toHaveBeenCalled();
  });

  test('should log with context data', () => {
    logger.info('Test message', { key: 'value' });
    expect(consoleSpy.log).toHaveBeenCalled();
  });
});
