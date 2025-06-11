import React from 'react';
import { render } from '@testing-library/react';
import withLogging from '../components/withLogging';

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

// Simple test component
const TestComponent: React.FC<{ name: string }> = ({ name }) => {
  return React.createElement('div', { 'data-testid': 'test-component' }, `Hello ${name}!`);
};

describe('withLogging HOC - Basic Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
  });

  it('should wrap components correctly', () => {
    const LoggedComponent = withLogging(TestComponent);
    
    const { getByTestId } = render(React.createElement(LoggedComponent, { name: 'John' }));
    
    expect(getByTestId('test-component')).toBeInTheDocument();
    expect(getByTestId('test-component')).toHaveTextContent('Hello John!');
  });

  it('should log mount by default', () => {
    const LoggedComponent = withLogging(TestComponent);
    
    render(React.createElement(LoggedComponent, { name: 'John' }));
      expect(consoleMock.log).toHaveBeenCalledWith(
      expect.stringContaining('[TestComponent]'),
      expect.stringContaining('Component mounted')
    );
  });

  it('should set display name correctly', () => {
    const LoggedComponent = withLogging(TestComponent);
    
    expect(LoggedComponent.displayName).toBe('withLogging(TestComponent)');
  });
});
