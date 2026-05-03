import geminiService from '../services/gemini.js';

class Simplifier {
  async simplify(text, level = 'moderate') {
    const levels = {
      light: {
        description: 'Simplify complex words but keep technical terms. High school reading level (Grade 9-12).',
        examples: 'Replace "utilize" with "use", but keep terms like "photosynthesis"'
      },
      moderate: {
        description: 'Replace jargon with everyday language. Middle school reading level (Grade 6-8).',
        examples: 'Replace "photosynthesis" with "how plants make food using sunlight"'
      },
      heavy: {
        description: 'Explain like I\'m 10 years old. Elementary school reading level (Grade 3-5).',
        examples: 'Use very simple words, short sentences (max 10 words), concrete examples'
      }
    };

    const selectedLevel = levels[level] || levels.moderate;

    const prompt = `
Rewrite this text for an ADHD student who struggles with dense academic language.

SIMPLIFICATION LEVEL: ${selectedLevel.description}
EXAMPLES: ${selectedLevel.examples}

ORIGINAL TEXT:
${text}

RULES:
1. Use active voice ("Scientists discovered..." not "It was discovered that...")
2. Break long sentences into short ones (max 15 words per sentence)
3. Replace complex words with simpler alternatives
4. Keep the SAME meaning and key facts - don't lose information
5. Use concrete examples when helpful
6. Add analogies if they clarify (e.g., "like a..." comparisons)
7. For lists, use bullet points

Respond with JSON in this exact format:
{
  "simplified": "Your rewritten text here",
  "changes": [
    {"from": "photosynthesis", "to": "how plants make food", "reason": "technical jargon"}
  ],
  "readingLevel": "Grade 6",
  "keyPoints": [
    "Main idea 1",
    "Main idea 2"
  ]
}
`;

    try {
      console.log(`📝 Simplifying text (level: ${level})`);
      const result = await geminiService.generateJSON(prompt);
      
      if (!result.simplified) {
        throw new Error('No simplified text returned');
      }

      console.log(`✓ Simplified successfully (${result.readingLevel})`);
      return result;
      
    } catch (error) {
      console.error('Simplification error:', error.message);
      
      // Fallback: return original with note
      return {
        simplified: text,
        changes: [],
        readingLevel: 'unknown',
        keyPoints: [],
        note: 'Simplification failed - showing original text'
      };
    }
  }

  async bulletize(text) {
    const prompt = `
Convert this text into clear, concise bullet points. 
Each bullet should be ONE complete thought in simple language.

TEXT:
${text}

RULES:
- Maximum 5-7 bullet points
- Each bullet is one sentence
- Simple, active language
- Focus on key takeaways

Respond with JSON:
{
  "bullets": [
    "First key point in simple language",
    "Second key point"
  ],
  "mainTakeaway": "The one sentence summary of everything"
}
`;

    try {
      console.log('📋 Converting to bullet points');
      const result = await geminiService.generateJSON(prompt);
      
      console.log(`✓ Created ${result.bullets?.length || 0} bullet points`);
      return result;
      
    } catch (error) {
      console.error('Bulletization error:', error.message);
      
      // Fallback: Split by sentences
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
      
      return {
        bullets: sentences.slice(0, 7).map(s => s.trim()),
        mainTakeaway: sentences[0]?.trim() || text.slice(0, 100)
      };
    }
  }

  async defineTerms(text) {
    const prompt = `
Identify complex or technical terms in this text and provide simple definitions.

TEXT:
${text}

For each technical term, provide:
1. The term
2. A simple, one-sentence definition
3. An everyday example or analogy

Respond with JSON:
{
  "terms": [
    {
      "term": "photosynthesis",
      "definition": "How plants make food using sunlight",
      "example": "Like a solar panel that makes food instead of electricity"
    }
  ]
}
`;

    try {
      console.log('📖 Defining technical terms');
      const result = await geminiService.generateJSON(prompt);
      
      console.log(`✓ Defined ${result.terms?.length || 0} terms`);
      return result;
      
    } catch (error) {
      console.error('Term definition error:', error.message);
      return { terms: [] };
    }
  }
}

export default new Simplifier();
