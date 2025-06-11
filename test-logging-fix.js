// Test script to verify logging functionality after fixing context issue
const testLogging = async () => {
  console.log('Testing logging functionality with fixed context format...');
  
  // Test the admin-api endpoint directly with correct format
  try {
    const response = await fetch('http://localhost:5266/api/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Logs: [
          {
            level: 'INFO',
            message: 'Test log with string context',
            component: 'TestScript',
            action: 'LoggingTest',
            timestamp: new Date().toISOString(),
            sessionId: 'test-session-123',
            ipAddress: '127.0.0.1',
            userAgent: 'TestScript/1.0',
            url: 'http://localhost:3001/test',
            context: JSON.stringify({ // Context as string
              testData: 'value',
              number: 42,
              boolean: true
            })
          },
          {
            level: 'ERROR',
            message: 'Test error log with string context',
            component: 'TestScript',
            action: 'ErrorTest',
            timestamp: new Date().toISOString(),
            sessionId: 'test-session-123',
            ipAddress: '127.0.0.1',
            userAgent: 'TestScript/1.0',
            url: 'http://localhost:3001/test',
            errorDetails: 'This is a test error message',
            stackTrace: 'Error\n    at test (test.js:1:1)',
            context: JSON.stringify({ // Context as string
              errorCode: 'TEST_ERROR',
              details: 'Test error for logging system'
            })
          }
        ]
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Logging test successful:', result);
    } else {
      const error = await response.text();
      console.error('❌ Logging test failed:', response.status, response.statusText);
      console.error('Error details:', error);
    }
  } catch (error) {
    console.error('❌ Request failed:', error);
  }
};

// Run the test
testLogging();
