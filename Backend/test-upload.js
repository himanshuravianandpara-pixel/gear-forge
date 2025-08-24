const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testUpload() {
  try {
    console.log('🧪 Testing multer-based file upload...\n');

    // Create a test image file (1x1 pixel PNG)
    const testImagePath = path.join(__dirname, 'test-image.png');
    const testImageBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
      0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00,
      0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0xE2, 0x21, 0xBC, 0x33,
      0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);

    // Write test image to file
    fs.writeFileSync(testImagePath, testImageBuffer);
    console.log('✅ Created test image file');

    // Create form data
    const formData = new FormData();
    
    // Add form fields
    formData.append('title', 'Test Account');
    formData.append('description', 'Test description');
    formData.append('level', '100');
    formData.append('price', '1000');
    formData.append('rank', 'Silver');
    formData.append('region', 'NA');
    formData.append('selectedAgents', JSON.stringify(['jett', 'raze']));
    formData.append('skins', JSON.stringify([
      {
        id: '1',
        name: 'Test Skin',
        screenshotName: 'test-image.png'
      }
    ]));
    
    // Add test image file
    formData.append('screenshots', fs.createReadStream(testImagePath));

    // Test upload
    console.log('📤 Testing file upload...');
    const response = await axios.post(`${BASE_URL}/api/uploadItem`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    console.log('✅ Upload successful!');
    console.log('Response:', response.data);

    // Clean up test file
    fs.unlinkSync(testImagePath);
    console.log('✅ Cleaned up test image file');

    // Test image access
    if (response.data.data && response.data.data.skins && response.data.data.skins[0]) {
      const imagePath = response.data.data.skins[0].screenshotPath;
      const filename = imagePath.split('/').pop();
      
      console.log('🖼️  Testing image access...');
      const imageResponse = await axios.get(`${BASE_URL}/uploads/skins/${filename}`, {
        responseType: 'arraybuffer'
      });
      
      if (imageResponse.status === 200) {
        console.log('✅ Image access successful!');
        console.log('Image size:', imageResponse.data.length, 'bytes');
      } else {
        console.log('❌ Image access failed');
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run test
testUpload();
