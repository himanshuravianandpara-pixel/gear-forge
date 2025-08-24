@echo off
echo 🔧 Creating .env file for GameVault Backend...
echo.

if exist .env (
    echo ⚠️  .env file already exists!
    echo Do you want to overwrite it? (y/n)
    set /p choice=
    if /i "%choice%"=="y" (
        echo ✅ Overwriting existing .env file...
    ) else (
        echo ❌ Aborted. Keeping existing .env file.
        pause
        exit /b
    )
)

echo # Firebase Configuration > .env
echo FIREBASE_PROJECT_ID=gamevault-96023 >> .env
echo FIREBASE_PRIVATE_KEY_ID= >> .env
echo FIREBASE_PRIVATE_KEY= >> .env
echo FIREBASE_CLIENT_EMAIL= >> .env
echo FIREBASE_CLIENT_ID= >> .env
echo FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth >> .env
echo FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token >> .env
echo FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs >> .env
echo FIREBASE_CLIENT_X509_CERT_URL= >> .env
echo. >> .env
echo # Server Configuration >> .env
echo PORT=5000 >> .env
echo NODE_ENV=development >> .env
echo. >> .env
echo # CORS Configuration >> .env
echo CORS_ORIGIN=http://localhost:3000 >> .env

echo ✅ .env file created successfully!
echo.
echo 📋 Next steps:
echo 1. Get your Firebase service account key from Firebase Console
echo 2. Fill in the missing values in .env file:
echo    - FIREBASE_PRIVATE_KEY_ID
echo    - FIREBASE_PRIVATE_KEY
echo    - FIREBASE_CLIENT_EMAIL
echo    - FIREBASE_CLIENT_ID
echo    - FIREBASE_CLIENT_X509_CERT_URL
echo 3. Start the server with: npm run dev
echo.
pause
