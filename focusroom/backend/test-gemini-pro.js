import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
(async () => {
  try {
    const result = await model.generateContent("Say hello");
    const response = await result.response;
    console.log("Success:", response.text());
  } catch (e) {
    console.error("Caught Error:", e);
  }
})();
