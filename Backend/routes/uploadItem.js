const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { admin, db } = require('../config/database');
const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
const skinsDir = path.join(uploadsDir, 'skins');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(skinsDir)) {
  fs.mkdirSync(skinsDir, { recursive: true });
}

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, skinsDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `skin-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// POST /api/uploadItem
router.post('/', upload.array('screenshots', 10), async (req, res) => {
  try {
    const {
      title,
      description,
      level,
      price,
      rank,
      region,
      selectedAgents,
      skins
    } = req.body;

    // Validate required fields
    if (!title || !description || !level || !price || !rank || !region) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Parse arrays from form data
    const agents = selectedAgents ? JSON.parse(selectedAgents) : [];
    const skinsData = skins ? JSON.parse(skins) : [];
    const uploadedFiles = req.files || [];

    // Process uploaded skin screenshots
    const uploadedSkins = [];
    for (let i = 0; i < skinsData.length; i++) {
      const skin = skinsData[i];
      const file = uploadedFiles.find(f => f.originalname === skin.screenshotName);
      
      if (file) {
        try {
          // Create relative path for database storage
          const relativePath = `uploads/skins/${file.filename}`;
          
          uploadedSkins.push({
            id: skin.id,
            name: skin.name,
            screenshotPath: relativePath,
            originalName: file.originalname,
            uploadedAt: new Date()
          });
        } catch (uploadError) {
          console.error('Error processing skin screenshot:', uploadError);
          // Continue with other skins even if one fails
          uploadedSkins.push({
            id: skin.id,
            name: skin.name,
            screenshotPath: null,
            error: 'Failed to process screenshot'
          });
        }
      } else {
        // No file uploaded for this skin
        uploadedSkins.push({
          id: skin.id,
          name: skin.name,
          screenshotPath: null
        });
      }
    }

    // Create item document for Firestore
    const itemData = {
      title: title.trim(),
      description: description.trim(),
      level: parseInt(level),
      price: parseFloat(price),
      rank: rank.trim(),
      region: region.trim(),
      agents: agents,
      skins: uploadedSkins,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'active',
      views: 0,
      favorites: 0
    };

    // Save to Firestore
    const docRef = await db.collection('items').add(itemData);
    
    console.log(docRef)

    // Get the created document
    const createdItem = await docRef.get();
    
    console.log(createdItem)


    res.status(201).json({
      success: true,
      message: 'Item uploaded successfully',
      data: {
        id: docRef.id,
        ...createdItem.data()
      }
    });

  } catch (error) {
    console.error('Error uploading item:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// GET /api/uploadItem - Get all items (for testing)
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('items').orderBy('createdAt', 'desc').get();
    const items = [];
    
    snapshot.forEach(doc => {
      items.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/uploadItem/images/:filename - Serve uploaded images
router.get('/images/:filename', (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(skinsDir, filename);
  
  // Check if file exists
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).json({
      success: false,
      message: 'Image not found'
    });
  }
});

module.exports = router;
