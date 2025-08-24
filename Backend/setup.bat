@echo off
echo 🚀 Setting up GameValut Backend Server...
echo.

echo 📦 Installing dependencies...
npm install

echo.
echo 🔧 Setting up environment variables...
if not exist .env (
    copy env.example .env
    echo ✅ Created .env file from template
    echo ⚠️  Please edit .env file with your Firebase credentials
) else (
    echo ✅ .env file already exists
)

echo.
echo 📋 Next steps:
echo 1. Edit .env file with your Firebase credentials
echo 2. Start the server with: npm run dev
echo 3. Test the server with: node test-server.js
echo.
echo 🎯 For detailed setup instructions, see README.md
echo.
pause
