# File Upload Integration for Frontend

This document explains how the file upload integration works in the GameValut frontend.

## 🔥 What's New

The UploadItem page now:
1. **Uploads images directly to backend** using FormData
2. **Calls the backend API** with form data and files
3. **Shows upload progress** with a progress bar
4. **Handles errors gracefully** with toast notifications

## 📦 Dependencies

- No additional dependencies required
- Uses native FormData API for file uploads

## 🚀 Quick Setup

1. **No additional setup required** - uses native browser APIs

2. **Start the frontend:**
   ```bash
   npm run dev
   ```

3. **Make sure the backend is running** on port 5000

## 🔧 How It Works

### 1. Image Upload Flow
```
User selects images → Images uploaded directly to backend → Files stored locally → Paths saved in database
```

### 2. File Storage Structure
```
uploads/skins/
├── skin-1703123456789-123456789.jpg
├── skin-1703123456790-987654321.png
└── skin-1703123456791-456789123.jpg
```

### 3. API Call Flow
```
Frontend → Backend API (form data + files) → Local file storage + Database
```

## 📁 Files Modified/Created

- `src/services/api.ts` - Backend API service functions with file upload support
- `src/pages/UploadItem.tsx` - Updated with direct file upload integration

## 🎯 Features

- **Progress Tracking**: Shows upload progress for multiple images
- **Error Handling**: Toast notifications for success/error states
- **Loading States**: Disabled submit button during upload
- **Validation**: Form validation before upload
- **Memory Management**: Proper cleanup of file URLs

## 🔒 Security

- Images are uploaded directly to backend with multer validation
- Files are stored with unique names to prevent conflicts
- Backend validates all data and file types before saving
- Images are served through controlled endpoints

## 🐛 Troubleshooting

### Common Issues

1. **File upload fails**: Check if backend is running and multer is configured
2. **CORS errors**: Ensure backend is running and CORS is configured
3. **Upload size limit**: Check multer file size limits
4. **API calls fail**: Verify backend server is running on port 5000

### Debug Steps

1. Check browser console for errors
2. Verify FormData is properly constructed
3. Check network tab for failed requests
4. Ensure backend server is accessible
5. Check backend logs for multer errors

## 📱 Usage Example

1. Fill out the form with account details
2. Select agents and add skins with images
3. Click "Upload Account"
4. Watch progress bar as form processes
5. Images and data are sent to backend simultaneously
6. Success message and redirect to marketplace

## 🔄 Future Enhancements

- Image compression before upload
- Drag & drop image upload
- Image preview/editing
- Batch upload optimization
- Upload resume on failure
- Image thumbnail generation
- CDN integration for better performance
