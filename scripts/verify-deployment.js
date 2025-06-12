#!/usr/bin/env node

const https = require('https');
const http = require('http');

// Configuration
const ENDPOINTS = {
  'Main API': 'https://dietapp-k2pl.onrender.com/api/swagger',
  'Admin API': 'https://ai-fitness-admin-api.onrender.com/',
  'Notification Service': 'https://ai-fitness-notifications.onrender.com/health',
  'Web App (Vercel)': 'https://ai-fitness-coach-web-app.vercel.app',
  'Landing Page (GitHub Pages)': 'https://kaplayan-atakan.github.io/dietApp',
};

const LOCAL_ENDPOINTS = {
  'Main API (Local)': 'http://localhost:5001/swagger',
  'Admin API (Local)': 'http://localhost:5002/',
  'Notification Service (Local)': 'http://localhost:5003/health',
};

function checkEndpoint(name, url) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https:') ? https : http;
    const startTime = Date.now();
    
    const req = protocol.get(url, (res) => {
      const responseTime = Date.now() - startTime;
      const status = res.statusCode;
      
      if (status >= 200 && status < 400) {
        console.log(`✅ ${name}: ${status} (${responseTime}ms)`);
        resolve({ name, status, responseTime, success: true });
      } else {
        console.log(`⚠️  ${name}: ${status} (${responseTime}ms)`);
        resolve({ name, status, responseTime, success: false });
      }
    });

    req.on('error', (error) => {
      const responseTime = Date.now() - startTime;
      console.log(`❌ ${name}: ${error.message} (${responseTime}ms)`);
      resolve({ name, error: error.message, responseTime, success: false });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      const responseTime = Date.now() - startTime;
      console.log(`⏱️  ${name}: Timeout (${responseTime}ms)`);
      resolve({ name, error: 'Timeout', responseTime, success: false });
    });
  });
}

async function verifyDeployment() {
  console.log('🚀 Starting Deployment Verification...\n');
  
  console.log('📊 Production Endpoints:');
  console.log('========================');
  const productionResults = [];
  for (const [name, url] of Object.entries(ENDPOINTS)) {
    const result = await checkEndpoint(name, url);
    productionResults.push(result);
  }
  
  console.log('\n🏠 Local Endpoints:');
  console.log('===================');
  const localResults = [];
  for (const [name, url] of Object.entries(LOCAL_ENDPOINTS)) {
    const result = await checkEndpoint(name, url);
    localResults.push(result);
  }
  
  console.log('\n📈 Summary:');
  console.log('===========');
  
  const allResults = [...productionResults, ...localResults];
  const successCount = allResults.filter(r => r.success).length;
  const totalCount = allResults.length;
  
  console.log(`✅ Successful: ${successCount}/${totalCount}`);
  console.log(`❌ Failed: ${totalCount - successCount}/${totalCount}`);
  
  if (successCount === totalCount) {
    console.log('\n🎉 All endpoints are responding correctly!');
  } else {
    console.log('\n⚠️  Some endpoints need attention.');
  }
  
  console.log('\n🔗 Quick Links:');
  console.log('===============');
  console.log('• Main API Swagger: https://dietapp-k2pl.onrender.com/api/swagger');
  console.log('• Admin Panel: https://ai-fitness-admin-api.onrender.com/');
  console.log('• Web App: https://ai-fitness-coach-web-app.vercel.app');
  console.log('• Landing Page: https://kaplayan-atakan.github.io/dietApp');
  
  console.log('\n📋 Next Steps:');
  console.log('==============');
  console.log('1. Update Vercel environment variables if needed');
  console.log('2. Test complete user flow on deployed applications');
  console.log('3. Set ALLOWED_ORIGINS environment variable in production');
  console.log('4. Monitor logs for any issues');
}

// Run verification
if (require.main === module) {
  verifyDeployment().catch(console.error);
}

module.exports = { verifyDeployment, checkEndpoint };
