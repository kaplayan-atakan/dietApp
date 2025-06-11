// Test script to verify logging functionality
const testLogging = async () => {
  console.log('Testing logging functionality...');
  
  // Test the admin-api endpoint directly
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
            message: 'Test log from script',
            component: 'TestScript',
            action: 'LoggingTest',
            timestamp: new Date().toISOString(),
            sessionId: 'test-session-123',
            ipAddress: '127.0.0.1',
            userAgent: 'TestScript/1.0',
            url: 'http://localhost:3001/test'
          },
          {
            level: 'ERROR',
            message: 'Test error log from script',
            component: 'TestScript',
            action: 'ErrorTest',
            errorDetails: 'This is a test error message',
            stackTrace: 'Error: Test error\n    at testLogging (test-logging.js:1:1)',
            timestamp: new Date().toISOString(),
            sessionId: 'test-session-123',
            ipAddress: '127.0.0.1',
            userAgent: 'TestScript/1.0',
            url: 'http://localhost:3001/test'
          }
        ]
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Logging test successful:', result);
      return true;
    } else {
      console.error('❌ Logging test failed:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return false;
    }
  } catch (error) {
    console.error('❌ Logging test error:', error);
    return false;
  }
};

// Run the test
testLogging().then(success => {
  if (success) {
    console.log('🎉 All logging tests passed!');
  } else {
    console.log('💥 Logging tests failed!');
  }
});
