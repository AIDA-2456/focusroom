import geminiService from '../services/gemini.js';

class ChatAgent {
  async chat(chunkText, userMessage, conversationHistory = []) {
    // Build context from history
    let historyContext = "";
    if (conversationHistory.length > 0) {
      historyContext = "\nPREVIOUS MESSAGES:\n" + conversationHistory.map(m => `${m.role.toUpperCase()}: ${m.text}`).join("\n");
    }

    const prompt = `
You are a highly encouraging, empathetic AI Tutor designed to help an ADHD student understand a specific chunk of study material.

CURRENT STUDY CHUNK:
"${chunkText}"
${historyContext}

STUDENT MESSAGE:
"${userMessage}"

TASK:
Respond to the student's message.
1. Be extremely concise (ADHD friendly). No walls of text.
2. Use simple, plain English.
3. Be encouraging and supportive.
4. Directly answer their question or clarify the concept in the chunk.
5. Use bullet points or emojis if it helps readability.

Respond ONLY with your message to the student. Do not include any other formatting or JSON.
`;

    try {
      console.log(`💬 Chatting with AI Tutor`);
      const result = await geminiService.generateText(prompt);
      return { success: true, text: result };
    } catch (error) {
      console.error('Chat error:', error.message);
      
      const fallbackResponses = [
        "That's a great question! However, my AI brain is currently taking a quick break (API rate limit exceeded). Please try asking again in a minute!",
        "I'd love to help with that, but I'm currently overwhelmed with requests! Give me a minute to cool down and try again.",
        "You're doing great! Keep focusing on the current chunk. (My AI connection is currently rate-limited, so I can't give a specific answer right now!)"
      ];
      const randomFallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      
      return { success: true, text: randomFallback };
    }
  }
}

export default new ChatAgent();
