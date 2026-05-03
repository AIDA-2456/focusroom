import geminiService from '../services/gemini.js';

class ContentChunker {
  async chunk(text, options = {}) {
    const { 
      chunkSize = 'sentence',
      maxChunkLength = 200,
      simplificationLevel = 'none'
    } = options;

    // Validate input
    if (!text || text.trim().length === 0) {
      throw new Error('No content provided for chunking');
    }

    const prompt = `
You are helping an ADHD student focus by breaking content into micro-chunks.

CONTENT TO CHUNK:
${text.slice(0, 5000)} ${text.length > 5000 ? '...(content truncated for processing)' : ''}

TASK:
Break this into ${chunkSize}-sized chunks optimized for ADHD focus. 

RULES:
- Each chunk should contain ONE main idea
- Keep chunks under ${maxChunkLength} characters
- Make each chunk self-contained (can be understood alone)
- Easy to read aloud in 30-60 seconds
- Maintain logical flow between chunks
${chunkSize === 'sentence' ? '- One or two sentences per chunk maximum' : ''}
${chunkSize === 'paragraph' ? '- One short paragraph per chunk' : ''}

Respond with JSON in this exact format:
{
  "chunks": [
    {
      "id": 1,
      "text": "First chunk text here",
      "type": "introduction|concept|example|definition|conclusion",
      "keywords": ["key", "terms"],
      "estimatedSeconds": 45
    }
  ],
  "metadata": {
    "totalChunks": 10,
    "estimatedMinutes": 8,
    "difficulty": "easy|medium|hard",
    "originalWordCount": 500
  }
}
`;

    try {
      console.log(`📝 Chunking content (${text.length} chars, mode: ${chunkSize})`);
      const result = await geminiService.generateJSON(prompt);
      
      // Validate result
      if (!result.chunks || !Array.isArray(result.chunks)) {
        console.warn('Invalid chunking result, using fallback');
        return this.fallbackChunk(text, chunkSize);
      }

      console.log(`✓ Created ${result.chunks.length} chunks`);
      return result;
      
    } catch (error) {
      console.error('Chunking error:', error.message);
      console.log('Using fallback chunking method');
      return this.fallbackChunk(text, chunkSize);
    }
  }

  fallbackChunk(text, chunkSize = 'sentence') {
    console.log('Using fallback chunking (simple sentence split)');
    
    // Simple sentence-based chunking as fallback
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    
    const chunks = sentences.map((sentence, i) => {
      const trimmed = sentence.trim();
      const words = trimmed.split(/\s+/);
      
      return {
        id: i + 1,
        text: trimmed,
        type: i === 0 ? 'introduction' : 
              i === sentences.length - 1 ? 'conclusion' : 'concept',
        keywords: words
          .filter(w => w.length > 5)
          .slice(0, 3)
          .map(w => w.toLowerCase().replace(/[^a-z]/g, '')),
        estimatedSeconds: Math.ceil(words.length / 3) // ~200 wpm reading speed
      };
    });

    return {
      chunks: chunks,
      metadata: {
        totalChunks: chunks.length,
        estimatedMinutes: Math.ceil(chunks.reduce((sum, c) => sum + c.estimatedSeconds, 0) / 60),
        difficulty: 'medium',
        originalWordCount: text.split(/\s+/).length,
        method: 'fallback'
      }
    };
  }

  // Combine very short chunks
  optimizeChunks(chunks, minLength = 50) {
    const optimized = [];
    let currentChunk = null;

    for (const chunk of chunks) {
      if (!currentChunk) {
        currentChunk = { ...chunk };
      } else if (chunk.text.length < minLength && currentChunk.text.length < minLength) {
        // Combine with previous chunk
        currentChunk.text += ' ' + chunk.text;
        currentChunk.keywords = [...new Set([...currentChunk.keywords, ...chunk.keywords])];
        currentChunk.estimatedSeconds += chunk.estimatedSeconds;
      } else {
        optimized.push(currentChunk);
        currentChunk = { ...chunk };
      }
    }

    if (currentChunk) {
      optimized.push(currentChunk);
    }

    return optimized;
  }
}

export default new ContentChunker();
