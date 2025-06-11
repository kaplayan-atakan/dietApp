const axios = require('axios');

async function testLogging() {
    console.log('Testing error logging system...');
    
    try {
        // Send a test log to admin-api
        const testLogs = [{
            timestamp: new Date().toISOString(),
            level: 'INFO',
            message: 'Testing logging system after auth fix',
            component: 'AuthTest',
            action: 'SystemTest',
            userId: '',
            sessionId: 'test-session-' + Date.now(),
            ipAddress: '127.0.0.1',
            context: JSON.stringify({
                test: 'auth-fix-verification',
                timestamp: new Date().toISOString(),
                authEndpointFix: 'applied'
            }),
            stackTrace: ''
        }];
        
        const response = await axios.post('http://localhost:5266/api/logs', {
            Logs: testLogs
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Test log sent successfully');
        console.log('Response:', response.status, response.statusText);
        
        // Test error log
        const errorLogs = [{
            timestamp: new Date().toISOString(),
            level: 'ERROR',
            message: 'Testing error log - API endpoint fix verification',
            component: 'AuthTest',
            action: 'ErrorTest',
            userId: '',
            sessionId: 'test-session-' + Date.now(),
            ipAddress: '127.0.0.1',
            context: JSON.stringify({
                test: 'error-logging',
                previousIssue: 'auth/profile 404 error',
                fix: 'changed to /api/auth/me'
            }),
            stackTrace: 'Test stack trace for verification'
        }];
        
        const errorResponse = await axios.post('http://localhost:5266/api/logs', {
            Logs: errorLogs
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Test error log sent successfully');
        
    } catch (error) {
        console.log('❌ Logging test failed:', error.response?.status, error.response?.statusText);
        console.log('Error details:', error.response?.data || error.message);
    }
}

testLogging();
