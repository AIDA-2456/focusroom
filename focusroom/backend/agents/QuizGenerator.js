import geminiService from '../services/gemini.js';

class QuizGenerator {
  async generateQuiz(text, numQuestions = 3) {
    if (!text || text.trim().length === 0) {
      throw new Error('No content provided for quiz generation');
    }

    const prompt = `
You are creating a short, encouraging multiple-choice quiz for an ADHD student who just finished reading some material.
The goal is to test retention but keep the pressure low and the dopamine high!

SOURCE TEXT:
${text.slice(0, 8000)} ${text.length > 8000 ? '...(content truncated)' : ''}

TASK:
Generate exactly ${numQuestions} multiple-choice questions based ONLY on the text above.

RULES:
- Questions should be clear and straightforward, not trick questions.
- Each question must have 4 options (A, B, C, D).
- Only ONE option should be correct.
- Provide a short, encouraging explanation for why the answer is correct (\`explanation\`).
- Provide an encouraging suggestion or hint for if they get it wrong (\`wrongExplanation\`).

Respond with JSON in this exact format:
{
  "questions": [
    {
      "id": 1,
      "question": "What is the main function of the prefrontal cortex?",
      "options": [
        "Regulating heart rate",
        "Executive function and impulse control",
        "Controlling breathing",
        "Processing visual information"
      ],
      "correctIndex": 1,
      "explanation": "Great job! The prefrontal cortex handles our complex planning and impulse control.",
      "wrongExplanation": "Not quite! Think about the 'executive' tasks like decision-making and planning."
    }
  ]
}
`;

    try {
      console.log(`📝 Generating quiz (${numQuestions} questions)`);
      const result = await geminiService.generateJSON(prompt);
      
      if (!result.questions || !Array.isArray(result.questions) || result.questions.length === 0) {
        throw new Error('Invalid quiz format returned by AI');
      }

      console.log(`✓ Generated quiz successfully`);
      return result.questions;
      
    } catch (error) {
      console.error('Quiz generation error:', error.message);
      
      // Fallback
      return [
        {
          id: 1,
          question: "Did you learn something new from this session?",
          options: ["Yes, a lot!", "A little bit", "Still processing it", "Need to review it again"],
          correctIndex: 0,
          explanation: "Every bit of learning counts! Awesome job focusing today.",
          wrongExplanation: "That's completely fine! Learning is a process. Awesome job focusing today."
        }
      ];
    }
  }
}

export default new QuizGenerator();
