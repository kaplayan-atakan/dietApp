const axios = require('axios');

async function testAuthFix() {
    console.log('Testing authentication fix...');
    
    try {
        // Test 1: Login with test credentials
        console.log('\n1. Testing login...');
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'test@example.com',
            password: 'password123'
        });
        
        if (loginResponse.data && loginResponse.data.token) {
            console.log('✅ Login successful - Token received');
            
            // Test 2: Use token to access /api/auth/me endpoint
            console.log('\n2. Testing /api/auth/me endpoint...');
            const meResponse = await axios.get('http://localhost:5000/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${loginResponse.data.token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('✅ /api/auth/me endpoint working - User data received:');
            console.log('   User ID:', meResponse.data.id);
            console.log('   Email:', meResponse.data.email);
            
        } else {
            console.log('❌ Login failed - No token received');
        }
        
    } catch (error) {
        if (error.response) {
            console.log(`❌ Error ${error.response.status}: ${error.response.data?.message || error.message}`);
            
            // If login fails with 401, try to register a test user first
            if (error.response.status === 401 && error.config.url.includes('login')) {
                console.log('\n🔄 Login failed, trying to register test user...');
                
                try {
                    await axios.post('http://localhost:5000/api/auth/register', {
                        email: 'test@example.com',
                        password: 'password123',
                        firstName: 'Test',
                        lastName: 'User'
                    });
                    console.log('✅ Test user registered successfully');
                    
                    // Retry login
                    console.log('🔄 Retrying login...');
                    const retryLoginResponse = await axios.post('http://localhost:5000/api/auth/login', {
                        email: 'test@example.com',
                        password: 'password123'
                    });
                    
                    if (retryLoginResponse.data && retryLoginResponse.data.token) {
                        console.log('✅ Login successful after registration');
                        
                        const meResponse = await axios.get('http://localhost:5000/api/auth/me', {
                            headers: {
                                'Authorization': `Bearer ${retryLoginResponse.data.token}`,
                                'Content-Type': 'application/json'
                            }
                        });
                        
                        console.log('✅ /api/auth/me endpoint working - User data received:');
                        console.log('   User ID:', meResponse.data.id);
                        console.log('   Email:', meResponse.data.email);
                    }
                    
                } catch (registerError) {
                    console.log('❌ Registration also failed:', registerError.response?.data?.message || registerError.message);
                }
            }
        } else {
            console.log('❌ Network error:', error.message);
        }
    }
    
    console.log('\n=== Test Complete ===');
}

testAuthFix();
