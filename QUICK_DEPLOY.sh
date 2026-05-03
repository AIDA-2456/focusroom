#!/bin/bash

# FocusRoom Quick Deploy Script
# Run this to prepare for deployment

echo "🧠 FocusRoom - Deployment Preparation"
echo "======================================"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - FocusRoom v1.0"
    git branch -M main
    echo "✅ Git initialized!"
else
    echo "✅ Git already initialized"
fi

echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Create GitHub repository:"
echo "   https://github.com/new"
echo ""
echo "2. Push to GitHub:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/focusroom.git"
echo "   git push -u origin main"
echo ""
echo "3. Deploy Backend to Railway:"
echo "   https://railway.app"
echo "   - New Project → Deploy from GitHub"
echo "   - Root Directory: backend"
echo "   - Add environment variables (see DEPLOYMENT_GUIDE.md)"
echo ""
echo "4. Deploy Frontend to Vercel:"
echo "   https://vercel.com"
echo "   - New Project → Import from GitHub"
echo "   - Root Directory: frontend"
echo "   - Framework: Vite"
echo "   - Add VITE_API_URL variable"
echo ""
echo "📖 Full guide: DEPLOYMENT_GUIDE.md"
echo ""
echo "🚀 Ready to deploy!"
