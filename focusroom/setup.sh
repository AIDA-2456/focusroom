#!/bin/bash

# FocusRoom - Complete Setup Script
# Run this after downloading the project

echo "🧠 FocusRoom Setup Starting..."
echo ""

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current: $(node -v)"
    exit 1
fi

echo "✓ Node.js $(node -v) detected"
echo ""

# Setup Backend
echo "📦 Setting up backend..."
cd backend

if [ ! -f ".env" ]; then
    echo "Creating .env from template..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANT: Edit backend/.env and add your API keys:"
    echo "   - GEMINI_API_KEY (get from https://makersuite.google.com/app/apikey)"
    echo "   - BROWSERPOD_API_KEY (from hackathon sponsors)"
    echo ""
fi

echo "Installing backend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Backend npm install failed"
    exit 1
fi

echo "✓ Backend setup complete"
echo ""

# Setup Frontend
echo "📦 Setting up frontend..."
cd ../frontend

echo "Installing frontend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Frontend npm install failed"
    exit 1
fi

echo "✓ Frontend setup complete"
echo ""

# Done
cd ..
echo "✅ Setup Complete!"
echo ""
echo "🚀 Next steps:"
echo ""
echo "1. Add your API keys to backend/.env"
echo ""
echo "2. Start the backend (in one terminal):"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "3. Start the frontend (in another terminal):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "📖 See README.md for more details"
echo ""
