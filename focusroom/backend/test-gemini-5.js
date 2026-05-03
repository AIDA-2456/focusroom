import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: 'gemini-2.5-flash',
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 2048,
    responseMimeType: "application/json"
  }
});

const prompt = `
You are helping an ADHD student focus by breaking content into micro-chunks.

CONTENT TO CHUNK:
Photosynthesis is the process by which plants make food. They use sunlight, water, and carbon dioxide to create oxygen and energy in the form of sugar. 

TASK:
Break this into sentence-sized chunks optimized for ADHD focus. 

RULES:
- Each chunk should contain ONE main idea
- Keep chunks under 200 characters
- Make each chunk self-contained (can be understood alone)
- Easy to read aloud in 30-60 seconds
- Maintain logical flow between chunks
- One or two sentences per chunk maximum

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

(async () => {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log("Success:", response.text());
  } catch (e) {
    console.error("Caught Error:", e);
  }
})();
