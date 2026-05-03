import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000
});

export const processContent = async (data) => {
  const response = await api.post('/content/process', data);
  return response.data;
};

export const simplifyText = async (text, level) => {
  const response = await api.post('/content/simplify', { text, level });
  return response.data;
};

export const getEncouragement = async (sessionData) => {
  const response = await api.post('/session/encouragement', sessionData);
  return response.data;
};

export const generateQuiz = async (text, numQuestions = 3) => {
  const response = await api.post('/content/quiz', { text, numQuestions });
  return response.data;
};

export const uploadPdf = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/content/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const chatWithTutor = async (chunkText, message, history = []) => {
  // Try to use Chrome's local window.ai if available (Privacy + Tech Sophistication)
  if (window.ai && window.ai.createTextSession) {
    try {
      const session = await window.ai.createTextSession();
      let prompt = `You are a highly encouraging, empathetic AI Tutor designed to help an ADHD student understand a specific chunk of study material. Chunk: "${chunkText}". `;
      if (history.length > 0) {
        prompt += `History: ${history.map(m => m.role + ': ' + m.text).join(' | ')}. `;
      }
      prompt += `Student asks: "${message}". Reply concisely and simply.`;
      
      const response = await session.prompt(prompt);
      return { success: true, data: { text: response } };
    } catch (e) {
      console.warn("window.ai failed, falling back to backend", e);
    }
  }

  // Fallback to backend Gemini
  const response = await api.post('/content/chat', { chunkText, message, history });
  return response.data;
};

export const exportSummary = async (chunksText) => {
  const response = await api.post('/content/summarize', { chunksText });
  return response.data;
};

export default api;
