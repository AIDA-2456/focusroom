// BACKEND - Production-Ready server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import contentRoutes from './routes/content.js';
import sessionRoutes from './routes/session.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// PRODUCTION CORS - Allow your deployed frontend
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL, // Your deployed Vercel/Netlify URL
  'https://focusroom.vercel.app', // Update with your actual domain
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes(undefined)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check for deployment platforms
app.get('/', (req, res) => {
  res.json({ 
    status: 'healthy',
    service: 'FocusRoom API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'focused', 
    message: 'FocusRoom API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    services: {
      gemini: !!process.env.GEMINI_API_KEY,
      browserpod: !!process.env.BROWSERPOD_API_KEY
    }
  });
});

// API Routes
app.use('/api/content', contentRoutes);
app.use('/api/session', sessionRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    availableRoutes: [
      'GET /',
      'GET /api/health',
      'POST /api/content/process',
      'POST /api/content/simplify',
      'POST /api/session/encouragement'
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  res.status(err.status || 500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('🧠 FocusRoom Backend Started');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 Gemini API: ${process.env.GEMINI_API_KEY ? '✓ Connected' : '✗ Missing'}`);
  console.log(`🌐 BrowserPod: ${process.env.BROWSERPOD_API_KEY ? '✓ Connected' : '✗ Missing'}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
});

// Graceful shutdown
const shutdown = () => {
  console.log('Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export default app;
