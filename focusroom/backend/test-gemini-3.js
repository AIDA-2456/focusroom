import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
(async () => {
  try {
    const result = await model.generateContent("Give me a JSON with array of numbers 1 to 5");
    const response = await result.response;
    console.log("Success:", response.text());
  } catch (e) {
    console.error("Caught Error:", e);
  }
})();
