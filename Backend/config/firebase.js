const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin SDK
// For development/testing, you can use the client config with application default credentials
// But for production, you should use a service account key

let app;
try {
  // Try to initialize with service account credentials first
  if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    const serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID || "gamevault-96023",
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI || "https://accounts.google.com/o/oauth2/auth",
      token_uri: process.env.FIREBASE_TOKEN_URI || "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL || "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
    };

    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: `${process.env.FIREBASE_PROJECT_ID || "gamevault-96023"}.appspot.com`
    });
  } else {
    // Fallback: Initialize with default credentials (for development)
    // This will use your local Firebase CLI credentials or service account
    app = admin.initializeApp({
      projectId: "gamevault-96023",
      storageBucket: "gamevault-96023.appspot.com"
    });
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
  // Initialize with minimal config as fallback
  app = admin.initializeApp({
    projectId: "gamevault-96023",
    storageBucket: "gamevault-96023.appspot.com"
  });
}

// Get Firestore and Storage instances
const db = admin.firestore();
const storage = admin.storage();

module.exports = { admin, db, storage };
