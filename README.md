# 🧠 FocusRoom — AI-Powered Distraction-Free Learning for ADHD Students

> **Built for the AI in the Box Hackathon** — A full-stack AI learning companion that transforms any content into focused, bite-sized study sessions designed around the ADHD brain.

---

## 📖 Table of Contents

- [What is FocusRoom?](#-what-is-focusroom)
- [Key Features](#-key-features)
- [How It Works](#-how-it-works)
- [AI Agents](#-ai-agents)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Reference](#-api-reference)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Future Roadmap](#-future-roadmap)
- [Credits](#-credits)

---

## 🎯 What is FocusRoom?

FocusRoom is a web application purpose-built for students with ADHD. Instead of staring at walls of dense text, FocusRoom takes any content — a pasted article, a URL, or an uploaded PDF — and intelligently breaks it into small, digestible **micro-chunks** displayed one at a time in a clean, distraction-free interface.

Powered by **Google Gemini AI** and **BrowserPod**, it doesn't just chunk content — it simplifies language, reads text aloud with word-highlighting, tracks focus decline in real time, generates quizzes for retention, and even runs a built-in AI tutor chat. The whole experience is designed to reduce cognitive overload and deliver learning in a way that actually works for ADHD brains.

---

## ✨ Key Features

### 📥 Flexible Content Input
- **Paste text** — lecture notes, articles, textbook chapters
- **Enter a URL** — BrowserPod extracts clean, ad-free text from any webpage
- **Upload a file** — PDF parsing extracts text automatically

### 🔪 AI-Powered Content Chunking
- Gemini AI breaks content into focus-sized micro-chunks (one idea per chunk)
- Each chunk is labelled by type: introduction, concept, definition, example, or conclusion
- Keywords and estimated reading time are generated per chunk
- A robust fallback chunker (sentence-split) runs when the API is unavailable

### ✏️ Text Simplification (3 levels)
- **Light** — replaces complex words, keeps technical terms (Grade 9–12)
- **Moderate** — replaces jargon with everyday language (Grade 6–8)
- **Heavy (Plain English)** — explains things like you're 10, short sentences, concrete analogies (Grade 3–5)
- **Adaptive**: if you score under 66% on the end-of-session quiz, Plain English is automatically suggested for your next session

### 🎯 Hyperfocus Mode
- Pure black screen, one chunk at a time — zero visual distractions
- Navigate with arrow keys or on-screen buttons
- Live progress bar and chunk counter
- AI-generated encouragement messages at milestones

### 🔊 Text-to-Speech with Word Highlighting
- Built-in browser TTS reads each chunk aloud
- Words are highlighted in sync as they're spoken
- Configurable voice and speed
- **Audio-only mode** for pure auditory learning

### ⏱️ Smart Pomodoro Timer
- Default 25-minute focus / 5-minute break cycles
- Fully configurable from settings
- Adaptive Pomodoro: analyses your session history to suggest optimal focus durations (10, 25, or 30 minutes) based on your personal focus pattern

### 🧠 Focus Decline Detection
- Tracks re-reads, pauses, skips, and time spent on individual chunks
- Calculates a real-time **Focus Score** (0–100)
- Proactively suggests a break when focus score drops below 50
- Provides actionable break activities (walk, water, 20-20-20 rule, music, etc.)

### 🤖 AI Tutor Chat
- In-session chat assistant anchored to the **current chunk**
- ADHD-friendly: concise answers, bullet points, plain English
- Full conversation history maintained within the session
- Graceful fallback messages when the API rate-limits

### 📝 End-of-Session Quiz
- Gemini generates 3 multiple-choice questions based on the material you just read
- Encouraging explanations for both correct and incorrect answers
- Quiz score feeds the adaptive difficulty engine

### 🔁 Spaced Repetition
- Keywords from every session are automatically saved to a local spaced-repetition review deck
- Flashcard-style review mode accessible from the landing page
- Uses a simple interval algorithm to surface terms that need revisiting

### 📄 Session Summary
- At completion, Gemini generates a one-page plain-text summary of everything you studied
- Downloadable as a `.txt` file
- Includes a title, high-level overview, and 3–5 key takeaways

### 🎨 UI & Accessibility
- Glassmorphism design system with a dark-mode-first aesthetic
- Animated 3D brain background (Spline)
- Cursor spotlight effect for focus reinforcement
- Light/dark theme switcher
- Framer Motion animations throughout

---

## 🔄 How It Works

The full user journey through the app:

```
Landing Page
    │
    ├─► Start Learning   → Content Input → Preview & Settings → Hyperfocus Mode
    │                                                               │
    │                                                       Pomodoro Break?
    │                                                               │
    │                                                         Quiz Screen
    │                                                               │
    │                                                      Completion + Summary
    │
    └─► Review Session  → Spaced Repetition Flashcards
```

Each stage is a separate React component managed by a central `stage` state in `App.jsx`. Transitions are animated with Framer Motion.

---

## 🤖 AI Agents

FocusRoom's backend is built around **five specialised Gemini AI agents**, each responsible for a distinct cognitive task:

### 1. `ContentChunker`
Breaks raw text into structured micro-chunks. Sends Gemini a detailed prompt specifying chunk size (sentence or paragraph), max length, and ADHD-specific rules (one idea per chunk, self-contained, readable in 30–60 seconds). Returns structured JSON with chunk type, keywords, and estimated duration. Falls back to regex sentence-splitting if the API fails.

### 2. `Simplifier`
Rewrites text at three reading levels using carefully engineered prompts. Also supports `bulletize()` (converts paragraphs to bullet points) and `defineTerms()` (identifies jargon and generates plain-English definitions). Returns structured JSON including a list of every word changed and why.

### 3. `FocusCoach`
A multi-purpose coaching agent that:
- Generates ≤12-word personalised encouragement messages based on real session stats
- Checks whether a Pomodoro break is due
- Detects focus decline by scoring user behaviour (re-reads, pauses, skips, dwell time)
- Recommends adaptive Pomodoro timings based on historical session data
- Generates contextual break activity suggestions

### 4. `QuizGenerator`
Creates 3 multiple-choice questions directly from the session's source text. Questions are designed to be low-pressure with dopamine-friendly encouraging feedback. Falls back to a generic reflection question if the API is unavailable.

### 5. `ChatAgent`
An in-session AI tutor anchored to the **current chunk**. Maintains full conversation history across turns. Responds concisely and supportively, using bullet points and emojis where helpful. Built for ADHD — no walls of text.

### 6. `Summarizer`
At the end of a session, generates a structured one-page plain-text summary: a catchy title, a 2–3 sentence overview, and 3–5 key takeaways. Formatted for clean `.txt` export.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite 5, Framer Motion, Axios |
| **Backend** | Node.js 18+, Express 4, ES Modules |
| **AI** | Google Gemini API (`@google/generative-ai`) |
| **Web Scraping** | BrowserPod (JavaScript-rendered page extraction) |
| **PDF Parsing** | `pdf-parse` |
| **File Uploads** | Multer |
| **3D Background** | Spline (`@splinetool/react-spline`) |
| **Animations** | Framer Motion |
| **Deployment** | Railway (backend), Vercel (frontend) |

---

## 📁 Project Structure

```
focusroom/
├── backend/
│   ├── agents/
│   │   ├── ChatAgent.js          # In-session AI tutor
│   │   ├── ContentChunker.js     # Breaks content into micro-chunks
│   │   ├── FocusCoach.js         # Encouragement, Pomodoro, focus detection
│   │   ├── QuizGenerator.js      # End-of-session quiz creation
│   │   ├── Simplifier.js         # Text simplification (3 levels)
│   │   └── Summarizer.js         # Session summary generator
│   ├── routes/
│   │   ├── content.js            # /api/content/* endpoints
│   │   └── session.js            # /api/session/* endpoints
│   ├── services/
│   │   ├── browserpod.js         # BrowserPod web scraping integration
│   │   └── gemini.js             # Gemini API wrapper
│   ├── server.js                 # Express server entry point
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── brain3d.png           # 3D brain asset
    ├── src/
    │   ├── components/
    │   │   ├── Landing.jsx           # Hero / landing page
    │   │   ├── ContentInput.jsx      # Text / URL / file input
    │   │   ├── PreviewSettings.jsx   # Session configuration
    │   │   ├── HyperfocusMode.jsx    # Core focus interface ⭐
    │   │   ├── BreakScreen.jsx       # Pomodoro break timer
    │   │   ├── QuizScreen.jsx        # End-of-session quiz
    │   │   ├── CompletionScreen.jsx  # Summary and stats
    │   │   ├── TutorChat.jsx         # AI tutor chat overlay
    │   │   ├── SpacedRepetition.jsx  # Flashcard review mode
    │   │   ├── BrainBackground.jsx   # Animated 3D background
    │   │   ├── CursorSpotlight.jsx   # Focus cursor effect
    │   │   ├── ThemeSwitcher.jsx     # Light/dark toggle
    │   │   ├── CountUp.jsx           # Animated number counter
    │   │   └── animations.css        # Framer Motion keyframes
    │   ├── hooks/                    # Custom React hooks
    │   ├── services/
    │   │   └── api.js                # Backend API client
    │   ├── styles/
    │   │   └── global.css            # Global CSS + design tokens
    │   ├── utils/
    │   │   └── spacedRepetition.js   # Local spaced repetition logic
    │   ├── App.jsx                   # Root component + stage routing
    │   └── main.jsx                  # React entry point
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** — [Download](https://nodejs.org)
- **Gemini API key** — Free from [Google AI Studio](https://makersuite.google.com/app/apikey)
- **BrowserPod API key** — From the hackathon sponsor

---

### 1. Clone the Repository

```bash
git clone https://github.com/AIDA-2456/focusroom.git
cd focusroom/focusroom
```

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
BROWSERPOD_API_KEY=your_browserpod_api_key_here
BROWSERPOD_URL=https://api.browserpod.io
PORT=3001
NODE_ENV=development
```

Start the backend server:

```bash
npm run dev        # development (with nodemon auto-reload)
# or
npm start          # production
```

The API will be running at **http://localhost:3001**

---

### 3. Set Up the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The app will be running at **http://localhost:3000**

---

### 4. Verify It's Working

```bash
# Check backend health
curl http://localhost:3001/api/health
# Expected: {"status":"focused"}

# Test content processing
curl -X POST http://localhost:3001/api/content/process \
  -H "Content-Type: application/json" \
  -d '{"text": "The mitochondria is the powerhouse of the cell."}'
```

---

### Keyboard Shortcuts (in Hyperfocus Mode)

| Key | Action |
|---|---|
| `→` / `Space` | Next chunk |
| `←` | Previous chunk |

---

## 🔌 API Reference

### Content

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/content/process` | Process text or a URL into chunks |
| `POST` | `/api/content/simplify` | Simplify text at a given level |

**POST `/api/content/process`**
```json
{
  "text": "Your content here",
  "url": "https://example.com/article",
  "simplify": "moderate",
  "chunkSize": "sentence"
}
```

### Session

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/session/encouragement` | Get an AI-generated motivational message |
| `POST` | `/api/session/check-break` | Check whether a Pomodoro break is due |

---

## 🌐 Deployment

### Backend → Railway

1. Push the repo to GitHub
2. Create a new project on [Railway](https://railway.app) and connect your repo
3. Set the **root directory** to `focusroom/backend`
4. Add your environment variables in the Railway dashboard
5. Railway will auto-detect Node.js and deploy

### Frontend → Vercel

1. Create a new project on [Vercel](https://vercel.com) and connect your repo
2. Set the **root directory** to `focusroom/frontend`
3. Set the build command to `npm run build` and output directory to `dist`
4. Add an environment variable: `VITE_API_URL=https://your-railway-app.up.railway.app`
5. Deploy

> A full step-by-step deployment guide is available in [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md)

---

## 🐛 Troubleshooting

**Backend won't start**
- Confirm `GEMINI_API_KEY` is set correctly in `.env`
- Check that port `3001` is not already in use
- Run `npm install` again to ensure all dependencies are present

**Frontend won't start**
- Check that port `3000` is free
- Delete `node_modules` and run `npm install` again
- Verify `vite.config.js` is present in the frontend directory

**Text-to-Speech not working**
- TTS works best in **Chrome** or **Edge**
- Ensure your browser has audio permissions enabled
- Try selecting a different voice in the session settings

**BrowserPod errors**
- Confirm `BROWSERPOD_API_KEY` is correct in `.env`
- URLs must include `https://` — bare domains won't work
- Some websites block scraping; try a different URL

**Gemini API errors / rate limits**
- All agents have graceful fallbacks — the app will keep working
- If chunking fails, a regex sentence-splitter takes over
- If the quiz fails, a reflection question is shown instead
- Free-tier Gemini keys have rate limits; wait a moment and retry

---

## 🛣️ Future Roadmap

- [ ] Flashcard generation from chunk keywords
- [ ] Detailed study analytics dashboard
- [ ] Collaborative study rooms
- [ ] Mobile app (React Native)
- [ ] Chrome extension for instant page focusing
- [ ] Integration with university LMS (Canvas, Moodle)
- [ ] User accounts and persistent session history

---

## 🙏 Credits

- **Google Gemini AI** — Core intelligence powering all AI agents
- **BrowserPod** — JavaScript-rendered web content extraction (hackathon sponsor)
- **Framer Motion** — Smooth, accessible animations
- **Spline** — 3D brain background asset
- **Inter** — Typography by Rasmus Andersson

---

## 📄 License

MIT License — Built with ❤️ for the **AI in the Box Hackathon** by Team AIDA.
