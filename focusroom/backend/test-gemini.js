import geminiService from './services/gemini.js';
(async () => {
  try {
    const result = await geminiService.generateJSON("Say hello");
    console.log("Success:", result);
  } catch (e) {
    console.error("Caught Error:", e);
  }
})();
