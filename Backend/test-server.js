const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testServer() {
  try {
    console.log('🧪 Testing GameValut Backend Server...\n');

    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);

    // Test root endpoint
    console.log('\n2. Testing root endpoint...');
    const rootResponse = await axios.get(`${BASE_URL}/`);
    console.log('✅ Root endpoint passed:', rootResponse.data);

    // Test uploadItem GET endpoint
    console.log('\n3. Testing uploadItem GET endpoint...');
    const itemsResponse = await axios.get(`${BASE_URL}/api/uploadItem`);
    console.log('✅ Items retrieved:', itemsResponse.data.count, 'items');

    console.log('\n🎉 All tests passed! Server is running correctly.');
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Server is not running. Please start the server first with:');
      console.error('   npm run dev');
    } else {
      console.error('❌ Test failed:', error.message);
    }
  }
}

// Run tests
testServer();
