import React from 'react';
import { render, cleanup } from '@testing-library/react';
import * as withLoggingModule from '../components/withLogging';
import { LogLevel } from '../utils/logger';

const withLogging = withLoggingModule.default;

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

// Test components
const TestComponent: React.FC<{ name: string; count?: number }> = ({ name, count = 0 }) => (
  <div data-testid="test-component">
    Hello {name}! Count: {count}
  </div>
);

const ErrorComponent: React.FC = () => {
  throw new Error('Test component error');
};

const ClassTestComponent = class extends React.Component<{ name: string }> {
  render() {
    return <div data-testid="class-component">Class component: {this.props.name}</div>;
  }
};

describe('withLogging HOC', () => {
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
  });

  afterEach(() => {
    // Restore original console
    Object.defineProperty(global, 'console', {
      value: originalConsole,
      writable: true
    });
    cleanup();
  });

  describe('Basic functionality', () => {
    it('should wrap functional components correctly', () => {
      const LoggedComponent = withLogging(TestComponent);
      
      const { getByTestId } = render(<LoggedComponent name="John" />);
      
      expect(getByTestId('test-component')).toBeInTheDocument();
      expect(getByTestId('test-component')).toHaveTextContent('Hello John! Count: 0');
    });

    it('should wrap class components correctly', () => {
      const LoggedComponent = withLogging(ClassTestComponent);
      
      const { getByTestId } = render(<LoggedComponent name="Jane" />);
      
      expect(getByTestId('class-component')).toBeInTheDocument();
      expect(getByTestId('class-component')).toHaveTextContent('Class component: Jane');
    });

    it('should preserve component props', () => {
      const LoggedComponent = withLogging(TestComponent);
      
      const { getByTestId } = render(<LoggedComponent name="Alice" count={5} />);
      
      expect(getByTestId('test-component')).toHaveTextContent('Hello Alice! Count: 5');
    });

    it('should set display name correctly', () => {
      const LoggedComponent = withLogging(TestComponent);
      
      expect(LoggedComponent.displayName).toBe('withLogging(TestComponent)');
    });    it('should handle unnamed components', () => {
      const AnonymousComponent = () => <div>Anonymous</div>;
      const LoggedComponent = withLogging(AnonymousComponent);
      
      expect(LoggedComponent.displayName).toBe('withLogging(AnonymousComponent)');
    });
  });

  describe('Logging options', () => {
    it('should log mount by default', () => {
      const LoggedComponent = withLogging(TestComponent);
      
      render(<LoggedComponent name="John" />);      // Check that console.log was called for mount
      expect(consoleMock.log).toHaveBeenCalledWith(
        expect.stringContaining('[TestComponent]'),
        expect.stringContaining('Component mounted')
      );
    });

    it('should log unmount by default', () => {
      const LoggedComponent = withLogging(TestComponent);
      
      const { unmount } = render(<LoggedComponent name="John" />);      unmount();
        // Check that console.log was called for unmount
      expect(consoleMock.log).toHaveBeenCalledWith(
        expect.stringContaining('[TestComponent]'),
        expect.stringContaining('Component unmounted')
      );
    });

    it('should not log mount when disabled', () => {
      const LoggedComponent = withLogging(TestComponent, { logMount: false });
      
      render(<LoggedComponent name="John" />);
        // Should not find mount log
      expect(consoleMock.log).not.toHaveBeenCalledWith(
        expect.stringContaining('[TestComponent]'),
        expect.stringContaining('Component mounted')
      );
    });

    it('should not log unmount when disabled', () => {
      const LoggedComponent = withLogging(TestComponent, { logUnmount: false });
      
      const { unmount } = render(<LoggedComponent name="John" />);
      unmount();
        // Should not find unmount log
      expect(consoleMock.log).not.toHaveBeenCalledWith(
        expect.stringContaining('[TestComponent]'),
        expect.stringContaining('Component unmounted')
      );
    });

    it('should log renders when enabled', () => {
      const LoggedComponent = withLogging(TestComponent, { logRenders: true });
      
      render(<LoggedComponent name="John" />);
        // Check that console.log was called for render
      expect(consoleMock.log).toHaveBeenCalledWith(
        expect.stringContaining('[TestComponent]'),
        expect.stringContaining('Component rendered')
      );
    });

    it('should not log renders by default', () => {
      const LoggedComponent = withLogging(TestComponent);
      
      render(<LoggedComponent name="John" />);
        // Should not find render log
      expect(consoleMock.log).not.toHaveBeenCalledWith(
        expect.stringContaining('[TestComponent]'),
        expect.stringContaining('Component rendered')
      );
    });

    it('should log props when enabled', () => {
      const LoggedComponent = withLogging(TestComponent, { 
        logMount: true, 
        logProps: true 
      });
      
      render(<LoggedComponent name="John" count={5} />);
        // Check that props are included in mount log
      expect(consoleMock.log).toHaveBeenCalledWith(
        expect.stringContaining('[TestComponent]'),
        expect.stringContaining('Component mounted'),
        expect.objectContaining({
          props: expect.objectContaining({
            name: 'John',
            count: 5
          })
        })
      );
    });

    it('should use custom component name', () => {
      const LoggedComponent = withLogging(TestComponent, { 
        componentName: 'CustomName' 
      });
      
      render(<LoggedComponent name="John" />);
        expect(consoleMock.log).toHaveBeenCalledWith(
        expect.stringContaining('[CustomName]'),
        expect.stringContaining('Component mounted')
      );
    });

    it('should respect log level setting', () => {
      const LoggedComponent = withLogging(TestComponent, { 
        logLevel: LogLevel.ERROR,
        logRenders: true 
      });
      
      render(<LoggedComponent name="John" />);
        // DEBUG level renders should not appear with ERROR log level
      expect(consoleMock.log).not.toHaveBeenCalledWith(
        expect.stringContaining('[TestComponent]'),
        expect.stringContaining('Component rendered')
      );
    });
  });

  describe('Error handling', () => {
    it('should log component render errors', () => {
      const LoggedErrorComponent = withLogging(ErrorComponent);
      
      // Suppress React error boundary warnings for this test
      const originalError = console.error;
      console.error = jest.fn();
      
      try {
        expect(() => {
          render(<LoggedErrorComponent />);
        }).toThrow('Test component error');
        
        // Check that error was logged
        expect(consoleMock.error).toHaveBeenCalledWith(
          expect.stringContaining('[ErrorComponent]'),
          expect.stringContaining('Component render error'),
          expect.objectContaining({
            error: expect.objectContaining({
              message: 'Test component error'
            })
          })
        );
      } finally {
        console.error = originalError;
      }
    });

    it('should include props in error logs when enabled', () => {
      const LoggedErrorComponent = withLogging(ErrorComponent, { logProps: true });
      
      // Suppress React error boundary warnings for this test
      const originalError = console.error;
      console.error = jest.fn();
      
      try {
        expect(() => {
          render(<LoggedErrorComponent />);
        }).toThrow('Test component error');
        
        // Check that props are included in error log
        expect(consoleMock.error).toHaveBeenCalledWith(
          expect.stringContaining('[ErrorComponent]'),
          expect.stringContaining('Component render error'),
          expect.objectContaining({
            props: expect.anything(),
            error: expect.objectContaining({
              message: 'Test component error'
            })
          })
        );
      } finally {
        console.error = originalError;
      }
    });

    it('should hide props in error logs when disabled', () => {
      const LoggedErrorComponent = withLogging(ErrorComponent, { logProps: false });
      
      // Suppress React error boundary warnings for this test
      const originalError = console.error;
      console.error = jest.fn();
      
      try {
        expect(() => {
          render(<LoggedErrorComponent />);
        }).toThrow('Test component error');
        
        // Check that props are hidden in error log
        expect(consoleMock.error).toHaveBeenCalledWith(
          expect.stringContaining('[ErrorComponent]'),
          expect.stringContaining('Component render error'),
          expect.objectContaining({
            props: '[props hidden]',
            error: expect.objectContaining({
              message: 'Test component error'
            })
          })
        );
      } finally {
        console.error = originalError;
      }
    });
  });

  describe('Performance tracking', () => {
    it('should track component lifetime on unmount', async () => {
      const LoggedComponent = withLogging(TestComponent);
      
      const { unmount } = render(<LoggedComponent name="John" />);
      
      // Wait a bit to ensure some lifetime
      await new Promise(resolve => setTimeout(resolve, 10));
      
      unmount();
        // Check that lifetime was tracked
      expect(consoleMock.log).toHaveBeenCalledWith(
        expect.stringContaining('[TestComponent]'),
        expect.stringContaining('Component unmounted'),
        expect.objectContaining({
          lifetime: expect.any(Number)
        })
      );
    });

    it('should track render count', () => {
      const LoggedComponent = withLogging(TestComponent, { logRenders: true });
      
      const { rerender } = render(<LoggedComponent name="John" />);
      rerender(<LoggedComponent name="Jane" />);
      rerender(<LoggedComponent name="Alice" />);
        // Check that render count increments
      expect(consoleMock.log).toHaveBeenCalledWith(
        expect.stringContaining('[TestComponent]'),
        expect.stringContaining('Component rendered'),
        expect.objectContaining({
          renderCount: 3
        })
      );
    });

    it('should include render count in unmount log', () => {
      const LoggedComponent = withLogging(TestComponent, { logRenders: true });
      
      const { rerender, unmount } = render(<LoggedComponent name="John" />);
      rerender(<LoggedComponent name="Jane" />);
      
      unmount();
        // Check that final render count is in unmount log
      expect(consoleMock.log).toHaveBeenCalledWith(
        expect.stringContaining('[TestComponent]'),
        expect.stringContaining('Component unmounted'),
        expect.objectContaining({
          renderCount: 2
        })
      );
    });
  });

  describe('Local storage integration', () => {
    it('should store logs in localStorage', () => {
      const LoggedComponent = withLogging(TestComponent);
      
      render(<LoggedComponent name="John" />);
        // Check that localStorage was called to store logs
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'ai-fitness-logs',
        expect.any(String)
      );
    });

    it('should include component context in stored logs', () => {
      const LoggedComponent = withLogging(TestComponent, { componentName: 'TestComp' });
      
      render(<LoggedComponent name="John" />);
      
      // Get the stored logs
      const setItemCalls = (mockLocalStorage.setItem as jest.Mock).mock.calls;
      const lastCall = setItemCalls[setItemCalls.length - 1];
      
      if (lastCall && lastCall[1]) {
        const storedLogs = JSON.parse(lastCall[1]);
        const mountLog = storedLogs.find((log: any) => 
          log.message === 'Component mounted' && log.component === 'TestComp'
        );
        
        expect(mountLog).toBeDefined();
        expect(mountLog.component).toBe('TestComp');
        expect(mountLog.action).toBe('mount');
      }
    });
  });
});
