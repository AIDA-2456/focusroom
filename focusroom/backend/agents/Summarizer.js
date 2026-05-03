import geminiService from '../services/gemini.js';

class Summarizer {
  async summarize(chunksText) {
    const prompt = `
You are an expert educational summarizer.

I have a list of text chunks from a student's focus session. 
Please read through them and generate a concise, highly-structured "One-Page Summary" of what was learned.

CHUNKS:
${chunksText.slice(0, 50000)}

REQUIREMENTS:
1. Provide a catchy, descriptive Title.
2. Provide a 2-3 sentence high-level overview.
3. List 3-5 "Key Takeaways" as bullet points.
4. Keep it formatted nicely with line breaks (this will be saved as a .txt file).
5. Do NOT use markdown asterisks or hash symbols, just plain text formatting (e.g., ALL CAPS for headers, dashes for bullets).

Respond ONLY with the formatted text summary.
`;

    try {
      console.log(`📝 Summarizing session content`);
      const result = await geminiService.generateText(prompt);
      return { success: true, text: result };
    } catch (error) {
      console.error('Summarizer error:', error.message);
      return { success: false, error: 'Failed to generate summary.' };
    }
  }
}

export default new Summarizer();
