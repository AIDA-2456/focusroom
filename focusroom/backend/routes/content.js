import express from 'express';
import multer from 'multer';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import contentChunker from '../agents/ContentChunker.js';
import simplifier from '../agents/Simplifier.js';
import quizGenerator from '../agents/QuizGenerator.js';
import chatAgent from '../agents/ChatAgent.js';
import summarizer from '../agents/Summarizer.js';
import browserPodService from '../services/browserpod.js';

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

/**
 * POST /api/content/upload
 * Handle PDF uploads and extract text
 */
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Please upload a valid PDF document' });
    }

    console.log(`📄 Processing PDF Upload: ${req.file.originalname} (${req.file.size} bytes)`);

    const data = await pdfParse(req.file.buffer);
    
    // Some PDFs have null characters or weird spacing, basic cleanup
    const cleanText = data.text.replace(/\u0000/g, '').replace(/\n{3,}/g, '\n\n').trim();

    res.json({
      success: true,
      data: {
        text: cleanText,
        metadata: {
          pages: data.numpages,
          info: data.info
        }
      }
    });
  } catch (error) {
    console.error('PDF extraction failed:', error);
    res.status(500).json({ 
      error: 'Failed to extract text from PDF',
      message: error.message
    });
  }
});

/**
 * POST /api/content/process
 * Process text or URL into focus-ready chunks
 */
router.post('/process', async (req, res) => {
  try {
    const { text, url, chunkSize = 'sentence', simplify = false } = req.body;

    let content = text;

    // If URL provided, extract content using BrowserPod
    if (url && !text) {
      console.log(`🌐 Processing URL: ${url}`);
      
      try {
        const extracted = await browserPodService.extractWebContent(url);
        
        if (!extracted || !extracted.content) {
          return res.status(400).json({ 
            error: 'Could not extract content from URL',
            message: 'The URL might be invalid or the content is not accessible'
          });
        }

        content = extracted.content;
        
        // Include metadata about extracted content
        res.locals.extractionMeta = {
          title: extracted.title,
          wordCount: extracted.wordCount,
          source: 'browserpod'
        };
        
      } catch (error) {
        console.error('BrowserPod extraction failed:', error.message);
        return res.status(500).json({ 
          error: 'Failed to extract content from URL',
          message: error.message
        });
      }
    }

    // Validate content
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ 
        error: 'No content provided',
        message: 'Please provide either text content or a valid URL'
      });
    }

    if (content.length > 50000) {
      console.warn(`Content is too large (${content.length} chars). Truncating to 50,000 characters.`);
      content = content.slice(0, 50000);
    }

    // Optionally simplify before chunking
    if (simplify) {
      console.log('📝 Simplifying content before chunking...');
      const simplified = await simplifier.simplify(content, simplify);
      content = simplified.simplified;
    }

    // Chunk the content
    const chunked = await contentChunker.chunk(content, { chunkSize });

    // Add extraction metadata if available
    if (res.locals.extractionMeta) {
      chunked.metadata.extraction = res.locals.extractionMeta;
    }

    res.json({
      success: true,
      data: chunked
    });

  } catch (error) {
    console.error('Content processing error:', error);
    res.status(500).json({ 
      error: 'Processing failed',
      message: error.message
    });
  }
});

/**
 * POST /api/content/simplify
 * Simplify a chunk of text to make it more ADHD-friendly
 */
router.post('/simplify', async (req, res) => {
  try {
    const { text, level = 'moderate' } = req.body;

    if (!text) {
      return res.status(400).json({ 
        error: 'No text provided',
        message: 'Please provide text to simplify'
      });
    }

    if (!['light', 'moderate', 'heavy'].includes(level)) {
      return res.status(400).json({ 
        error: 'Invalid simplification level',
        message: 'Level must be: light, moderate, or heavy'
      });
    }

    const simplified = await simplifier.simplify(text, level);

    res.json({
      success: true,
      data: simplified
    });

  } catch (error) {
    console.error('Simplification error:', error);
    res.status(500).json({ 
      error: 'Simplification failed',
      message: error.message
    });
  }
});

/**
 * POST /api/content/bulletize
 * Convert text into bullet points
 */
router.post('/bulletize', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ 
        error: 'No text provided'
      });
    }

    const bullets = await simplifier.bulletize(text);

    res.json({
      success: true,
      data: bullets
    });

  } catch (error) {
    console.error('Bulletize error:', error);
    res.status(500).json({ 
      error: 'Bulletization failed',
      message: error.message
    });
  }
});

/**
 * POST /api/content/define-terms
 * Extract and define technical terms
 */
router.post('/define-terms', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ 
        error: 'No text provided'
      });
    }

    const definitions = await simplifier.defineTerms(text);

    res.json({
      success: true,
      data: definitions
    });

  } catch (error) {
    console.error('Term definition error:', error);
    res.status(500).json({ 
      error: 'Term definition failed',
      message: error.message
    });
  }
});

/**
 * POST /api/content/quiz
 * Generate a knowledge check quiz based on text
 */
router.post('/quiz', async (req, res) => {
  try {
    const { text, numQuestions = 3 } = req.body;

    if (!text) {
      return res.status(400).json({ 
        error: 'No text provided',
        message: 'Please provide text to generate a quiz'
      });
    }

    const questions = await quizGenerator.generateQuiz(text, numQuestions);

    res.json({
      success: true,
      data: { questions }
    });

  } catch (error) {
    console.error('Quiz generation error:', error);
    res.status(500).json({ 
      error: 'Quiz generation failed',
      message: error.message
    });
  }
});

/**
 * POST /api/content/chat
 * AI Tutor chat for a specific chunk
 */
router.post('/chat', async (req, res) => {
  try {
    const { chunkText, message, history = [] } = req.body;

    if (!chunkText || !message) {
      return res.status(400).json({ 
        error: 'Missing parameters',
        message: 'Please provide both chunkText and message'
      });
    }

    const result = await chatAgent.chat(chunkText, message, history);

    if (!result.success) {
      throw new Error(result.error);
    }

    res.json({
      success: true,
      data: { text: result.text }
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Chat failed',
      message: error.message
    });
  }
});

/**
 * POST /api/content/summarize
 * Generate a 1-page summary of the session
 */
router.post('/summarize', async (req, res) => {
  try {
    const { chunksText } = req.body;

    if (!chunksText) {
      return res.status(400).json({ 
        error: 'Missing parameters',
        message: 'Please provide chunksText'
      });
    }

    const result = await summarizer.summarize(chunksText);

    if (!result.success) {
      throw new Error(result.error);
    }

    res.json({
      success: true,
      data: { text: result.text }
    });

  } catch (error) {
    console.error('Summarize error:', error);
    res.status(500).json({ 
      error: 'Summarize failed',
      message: error.message
    });
  }
});

export default router;
