// Test script to verify the login fix
const axios = require('axios');

// Simulate the fixed ApiClient behavior
class TestApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.client = axios.create({ baseURL });
  }

  async request(config) {
    try {
      // This is the FIXED version - returns response.data directly
      const response = await this.client.request(config);
      return response.data; // Fixed: was response.data.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'API Error');
    }
  }

  async login(email, password) {
    return this.request({
      method: 'POST',
      url: '/api/auth/login',
      data: { email, password },
    });
  }
}

async function testLogin() {
  console.log('🧪 Testing login fix...');
  
  const client = new TestApiClient('http://localhost:5000');
  
  try {
    const result = await client.login('testuser@test.com', 'Password123!');
    
    console.log('✅ Login successful!');
    console.log('📝 Response structure:', {
      hasAccessToken: !!result.accessToken,
      hasRefreshToken: !!result.refreshToken,
      accessTokenType: typeof result.accessToken,
      tokenPreview: result.accessToken ? result.accessToken.substring(0, 50) + '...' : 'none'
    });
    
    // Verify the fix - accessToken should be directly accessible
    if (result.accessToken && typeof result.accessToken === 'string') {
      console.log('🎉 FIX CONFIRMED: accessToken is directly accessible');
      console.log('✨ The original error "Cannot read properties of undefined (reading \'accessToken\')" should be resolved');
    } else {
      console.log('❌ FIX FAILED: accessToken is not accessible');
    }
    
  } catch (error) {
    console.log('❌ Login failed:', error.message);
  }
}

// Also test the old broken behavior for comparison
class BrokenApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.client = axios.create({ baseURL });
  }

  async request(config) {
    try {
      // This is the BROKEN version that was causing the error
      const response = await this.client.request(config);
      return response.data.data; // This would cause the error
    } catch (error) {
      throw new Error(error.response?.data?.message || 'API Error');
    }
  }

  async login(email, password) {
    return this.request({
      method: 'POST',
      url: '/api/auth/login',
      data: { email, password },
    });
  }
}

async function testBrokenBehavior() {
  console.log('\n🔴 Testing broken behavior (for comparison)...');
  
  const brokenClient = new BrokenApiClient('http://localhost:5000');
  
  try {
    const result = await brokenClient.login('testuser@test.com', 'Password123!');
    console.log('❌ This should not succeed with broken client');
  } catch (error) {
    console.log('✅ Expected error with broken client:', error.message);
    if (error.message.includes("Cannot read properties of undefined")) {
      console.log('📋 This confirms the original error we fixed');
    }
  }
}

async function runTests() {
  try {
    await testLogin();
    await testBrokenBehavior();
  } catch (error) {
    console.log('❌ Test error:', error.message);
  }
}

runTests();
