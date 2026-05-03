import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

class GeminiService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('⚠️  GEMINI_API_KEY not set - AI features will fail');
    }
    
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-flash-latest',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
      }
    });

    this.textModel = this.genAI.getGenerativeModel({ 
      model: 'gemini-flash-latest',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      }
    });
  }

  async generateText(prompt) {
    try {
      const result = await this.textModel.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini text API error:', error.message);
      throw new Error(`AI text processing failed: ${error.message}`);
    }
  }

  async generateContent(prompt) {
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error.message);
      throw new Error(`AI processing failed: ${error.message}`);
    }
  }

  async generateJSON(prompt) {
    try {
      const fullPrompt = `${prompt}\n\nIMPORTANT: Respond ONLY with valid JSON. No markdown, no code blocks, no explanation. Just pure JSON.`;
      
      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      let text = response.text();
      console.log('Raw text from Gemini:', text);
      
      // Clean up markdown code blocks if present
      text = text.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();
      
      // Parse and return
      return JSON.parse(text);
    } catch (error) {
      console.error('Gemini JSON error:', error.message);
      
      // If JSON parsing failed, try to extract JSON from the response
      if (error instanceof SyntaxError) {
        console.warn('JSON parsing failed, attempting to extract JSON...');
        // Could implement more robust JSON extraction here
      }
      
      throw new Error(`AI JSON parsing failed: ${error.message}`);
    }
  }

  async chat(messages) {
    try {
      const chat = this.model.startChat({
        history: messages.slice(0, -1).map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        }))
      });

      const lastMessage = messages[messages.length - 1];
      const result = await chat.sendMessage(lastMessage.content);
      const response = await result.response;
      
      return response.text();
    } catch (error) {
      console.error('Gemini chat error:', error.message);
      throw new Error(`AI chat failed: ${error.message}`);
    }
  }
}

export default new GeminiService();
