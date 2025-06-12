/**
 * Example component showing how to use error logging in web-app
 */
'use client';

import React, { useState, useEffect } from 'react';
import { getErrorLogger } from '@ai-fitness/utils';

export default function TestErrorLogging() {
  const [testResult, setTestResult] = useState<string>('');
  const [logger, setLogger] = useState<any>(null);
  
  useEffect(() => {
    try {
      const loggerInstance = getErrorLogger();
      setLogger(loggerInstance);
    } catch (error) {
      console.error('Error logger not initialized:', error);
    }
  }, []);

  const handleInfoLog = () => {
    if (!logger) return;
    logger.info('User clicked info test button', {
      component: 'TestErrorLogging',
      action: 'InfoButtonClick',
      context: {
        buttonType: 'info',
        timestamp: new Date().toISOString()
      }
    });
    setTestResult('Info log sent successfully!');
  };

  const handleWarningLog = () => {
    logger.warn('User triggered warning test', {
      component: 'TestErrorLogging',
      action: 'WarningButtonClick',
      context: {
        buttonType: 'warning',
        userAction: 'test'
      }
    });
    setTestResult('Warning log sent successfully!');
  };

  const handleErrorLog = () => {
    logger.error('User triggered error test', {
      component: 'TestErrorLogging',
      action: 'ErrorButtonClick',
      errorDetails: 'This is a simulated error for testing purposes',
      stackTrace: 'Error: Simulated error\n    at handleErrorLog (TestErrorLogging.tsx:45:12)',
      context: {
        buttonType: 'error',
        severity: 'high'
      }
    });
    setTestResult('Error log sent successfully!');
  };

  const handleApiErrorLog = () => {
    // Simulate an API error
    const fakeApiError = {
      message: 'Network request failed',
      status: 500,
      response: { error: 'Internal server error' }
    };
    
    logger.logApiError(fakeApiError, '/api/test-endpoint', 'POST');
    setTestResult('API error log sent successfully!');
  };

  const handlePerformanceLog = () => {
    // Simulate a slow operation
    const duration = Math.floor(Math.random() * 5000) + 1000; // 1-6 seconds
    
    logger.logPerformance('DataProcessing', duration, 'TestErrorLogging');
    setTestResult(`Performance log sent! Duration: ${duration}ms`);
  };

  const handleUserActionLog = () => {
    logger.logUserAction('ButtonClick', 'TestErrorLogging', {
      buttonName: 'UserActionTest',
      userRole: 'developer',
      feature: 'error-logging-test'
    });
    setTestResult('User action log sent successfully!');
  };

  const triggerJavaScriptError = () => {
    // This will trigger the global error handler
    throw new Error('Intentional JavaScript error for testing global error handling');
  };

  const triggerPromiseRejection = () => {
    // This will trigger the unhandled promise rejection handler
    Promise.reject(new Error('Intentional promise rejection for testing'));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Error Logging Test Panel</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={handleInfoLog}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium"
        >
          Test Info Log
        </button>
        
        <button
          onClick={handleWarningLog}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md font-medium"
        >
          Test Warning Log
        </button>
        
        <button
          onClick={handleErrorLog}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium"
        >
          Test Error Log
        </button>
        
        <button
          onClick={handleApiErrorLog}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md font-medium"
        >
          Test API Error
        </button>
        
        <button
          onClick={handlePerformanceLog}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium"
        >
          Test Performance Log
        </button>
        
        <button
          onClick={handleUserActionLog}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md font-medium"
        >
          Test User Action
        </button>
      </div>

      <div className="border-t pt-4 mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Global Error Handler Tests</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={triggerJavaScriptError}
            className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-md font-medium"
          >
            🚨 Trigger JS Error
          </button>
          
          <button
            onClick={triggerPromiseRejection}
            className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-md font-medium"
          >
            🚨 Trigger Promise Rejection
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          ⚠️ These buttons will trigger actual errors for testing global error handling
        </p>
      </div>

      {testResult && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <p className="text-green-800 font-medium">✅ {testResult}</p>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Instructions</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Click the buttons above to send different types of logs to the admin API</li>
          <li>• Check the admin panel at <code className="bg-gray-200 px-1 rounded">http://localhost:3002/admin</code> to see the logs</li>
          <li>• The error logger automatically batches logs and sends them every few seconds</li>
          <li>• All errors are also logged to the browser console in development mode</li>
        </ul>
      </div>
    </div>
  );
}
