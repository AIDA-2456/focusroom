# 🧠 FocusRoom - Distraction-Free Learning for ADHD Students

## 🎯 What is FocusRoom?

FocusRoom is a web application that helps ADHD students focus by breaking content into micro-chunks and displaying them one at a time in a distraction-free environment. Built with React, Node.js, Gemini AI, and BrowserPod.

## ✨ Features

- 📝 **Content Input**: Paste text, enter URLs, or upload files
- 🔗 **BrowserPod Integration**: Convert any webpage to clean, distraction-free text
- ✂️ **AI Chunking**: Break content into focus-sized pieces using Gemini AI
- 🎯 **Hyperfocus Mode**: Black screen with ONE chunk at a time
- 🔊 **Text-to-Speech**: Read aloud with word highlighting
- ⏱️ **Pomodoro Timer**: Built-in 25min work / 5min break cycles
- 📊 **Progress Tracking**: Track chunks completed and time spent
- 🎨 **Beautiful UI**: Glassmorphism design optimized for ADHD

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Gemini API key (free from Google AI Studio)
- BrowserPod API key (from hackathon sponsors)

### Installation

1. **Clone/Download this project**

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd frontend
npm install
```

4. **Setup Environment Variables**

Create `backend/.env`:
```bash
GEMINI_API_KEY=your_gemini_key_here
BROWSERPOD_API_KEY=your_browserpod_key_here
BROWSERPOD_URL=https://api.browserpod.io
PORT=3001
NODE_ENV=development
```

5. **Start Backend Server**
```bash
cd backend
npm run dev
```

Backend will run on http://localhost:3001

6. **Start Frontend (in new terminal)**
```bash
cd frontend
npm run dev
```

Frontend will run on http://localhost:3000

7. **Open Browser**

Navigate to http://localhost:3000

## 📁 Project Structure

```
focusroom/
├── backend/
│   ├── server.js              # Express server
│   ├── agents/                # AI agents
│   ├── services/              # External APIs
│   └── routes/                # API endpoints
└── frontend/
    ├── src/
    │   ├── components/        # React components
    │   ├── hooks/             # Custom hooks
    │   ├── services/          # API calls
    │   └── styles/            # CSS files
    └── public/                # Static assets
```

## 🎨 Component Overview

### Core Components
- **Landing.jsx**: Hero page with CTA
- **ContentInput.jsx**: Text/URL/file input
- **PreviewSettings.jsx**: Configure session settings
- **HyperfocusMode.jsx**: Main focus interface ⭐
- **BreakScreen.jsx**: Pomodoro break timer
- **CompletionScreen.jsx**: Session summary

## 🔧 API Endpoints

### Content Processing
- `POST /api/content/process` - Process text/URL into chunks
- `POST /api/content/simplify` - Simplify text for ADHD

### Session Management
- `POST /api/session/encouragement` - Get motivational message
- `POST /api/session/check-break` - Check if break needed

## 🧪 Testing

1. **Test Backend API**
```bash
curl http://localhost:3001/api/health
```

Should return: `{"status":"focused"}`

2. **Test Content Processing**
```bash
curl -X POST http://localhost:3001/api/content/process \
  -H "Content-Type: application/json" \
  -d '{"text":"Your test content here"}'
```

## 🎯 Usage Tips

### For Students
1. Paste your lecture notes or textbook chapter
2. Choose simplification level (original/moderate/heavy)
3. Enable auto-read for auditory learning
4. Use keyboard shortcuts: ← → Space

### For Demo
1. Use the example neuroscience text
2. Show the before/after comparison
3. Demonstrate Hyperfocus Mode
4. Highlight BrowserPod URL conversion

## 🐛 Troubleshooting

### Backend won't start
- Check if port 3001 is available
- Verify GEMINI_API_KEY in .env
- Run `npm install` again

### Frontend won't start
- Check if port 3000 is available
- Clear node_modules and reinstall
- Check Vite config

### Text-to-Speech not working
- Check browser compatibility (Chrome/Edge work best)
- Enable audio permissions
- Try different voice in settings

### BrowserPod errors
- Verify API key is correct
- Check URL format (must include https://)
- Some sites may block scraping

## 🚢 Deployment

### Backend (Railway/Render)
1. Push to GitHub
2. Connect to Railway/Render
3. Add environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy `dist` folder
3. Set API URL in environment

## 📝 License

MIT License - Built for DevFest 2025 Hackathon

## 🙏 Credits

- Built with Gemini AI (Google)
- BrowserPod for web scraping
- Framer Motion for animations
- Inter font by Rasmus Andersson

## 💡 Future Features

- [ ] Flashcard generation from content
- [ ] Study analytics dashboard
- [ ] Team study sessions
- [ ] Mobile app (React Native)
- [ ] Chrome extension
- [ ] Integration with university LMS

## 📞 Support

For issues or questions:
- Create GitHub issue
- Contact: focusroom@example.com
- Discord: [link]

---

**Built with ❤️ for ADHD students by [Your Team Name]**
