import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

const prompt = `Give me a JSON with array of numbers 1 to 5. Just JSON.`;

(async () => {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log("Success:", response.text());
  } catch (e) {
    console.error("Caught Error:", e);
  }
})();
