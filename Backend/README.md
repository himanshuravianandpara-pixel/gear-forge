# GameValut Backend Server

A Node.js backend server for the GameValut gaming marketplace, built with Express.js and Firebase.

## Features

- **uploadItem API**: Handles Valorant account uploads with skin screenshots
- **Local File Storage**: Stores images in local uploads folder with multer
- **Firebase Integration**: Stores data in Firestore database
- **File Upload**: Supports multiple image uploads with validation
- **Security**: Includes rate limiting, CORS, and security headers
- **Error Handling**: Comprehensive error handling and validation

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project with Firestore and Storage enabled
- Firebase service account key

## Setup Instructions

### 1. Install Dependencies

```bash
cd Backend
npm install
```

### 2. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Firestore Database (Storage not needed for this setup)
4. Go to Project Settings > Service Accounts
5. Generate a new private key (JSON file)
6. Copy the values to your `.env` file

### 3. Environment Variables

Copy `env.example` to `.env` and fill in your Firebase credentials:

```bash
cp env.example .env
```

Fill in the following variables:
- `FIREBASE_PROJECT_ID`: Your Firebase project ID
- `FIREBASE_PRIVATE_KEY`: Your service account private key
- `FIREBASE_CLIENT_EMAIL`: Your service account email
- Other Firebase configuration values from your JSON file

### 4. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on port 5000 (or the port specified in your `.env` file).

## API Endpoints

### POST /api/uploadItem

Uploads a new Valorant account item.

**Request Body (multipart/form-data):**
```json
{
  "title": "Premium Immortal Account",
  "description": "High-ranked account with rare skins",
  "level": "245",
  "price": "25415",
  "rank": "Immortal 2",
  "region": "NA",
  "selectedAgents": "[\"jett\", \"raze\", \"phoenix\"]",
  "skins": "[{\"id\":\"1\",\"name\":\"Phantom Elderflame\",\"screenshotName\":\"phantom.jpg\"}]",
  "screenshots": [File1, File2, ...]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item uploaded successfully",
  "data": {
    "id": "generated-document-id",
    "title": "Premium Immortal Account",
    "description": "High-ranked account with rare skins",
    "level": 245,
    "price": 25415,
    "rank": "Immortal 2",
    "region": "NA",
    "agents": ["jett", "raze", "phoenix"],
    "skins": [
      {
        "id": "1",
        "name": "Phantom Elderflame",
        "screenshotPath": "uploads/skins/skin-1703123456789-123456789.jpg",
        "originalName": "phantom.jpg",
        "uploadedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "status": "active"
  }
}
```

### GET /api/uploadItem

Retrieves all uploaded items (for testing purposes).

### GET /health

Health check endpoint.

## Data Structure

The server stores the following data structure in Firestore:

```json
{
  "title": "string",
  "description": "string", 
  "level": "number",
  "price": "number",
  "rank": "string",
  "region": "string",
  "agents": ["string"],
  "skins": [
    {
      "id": "string",
      "name": "string",
      "screenshotPath": "string",
      "originalName": "string",
      "uploadedAt": "timestamp"
    }
  ],
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "status": "string",
  "views": "number",
  "favorites": "number"
}
```

## File Upload

- **Supported formats**: PNG, JPG, JPEG
- **Maximum file size**: 5MB per file
- **Maximum files**: 10 files per upload
- **Storage**: Files are stored locally in `uploads/skins/` folder
- **Access**: Images are served via `/uploads/skins/filename` endpoint
- **Database**: Relative paths are stored in Firestore for easy access

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configurable cross-origin requests
- **Helmet**: Security headers
- **File Validation**: Type and size validation for uploads
- **Input Sanitization**: Basic input cleaning and validation

## Error Handling

The server includes comprehensive error handling for:
- Missing required fields
- File upload errors
- Firebase connection issues
- Invalid file types/sizes
- Rate limit exceeded

## Development

### Project Structure
```
Backend/
├── config/
│   └── firebase.js      # Firebase configuration
├── routes/
│   └── uploadItem.js    # Upload item API routes
├── server.js            # Main server file
├── package.json         # Dependencies
├── env.example          # Environment variables template
└── README.md           # This file
```

### Adding New Routes

1. Create a new route file in `routes/` folder
2. Import and use it in `server.js`
3. Follow the existing pattern for consistency

## Troubleshooting

### Common Issues

1. **Firebase connection failed**: Check your service account credentials in `.env`
2. **CORS errors**: Verify `CORS_ORIGIN` in your environment variables
3. **File upload fails**: Check file size and type restrictions
4. **Port already in use**: Change `PORT` in your `.env` file

### Logs

The server logs important information to the console:
- Server startup details
- API request logs
- Error details (in development mode)
- File upload status

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in your environment
2. Use a process manager like PM2
3. Set up proper logging
4. Configure environment-specific Firebase settings
5. Set up monitoring and health checks

## License

ISC License
