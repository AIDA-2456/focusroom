import geminiService from '../services/gemini.js';

class FocusCoach {
  async generateEncouragement(sessionData) {
    const { 
      chunksCompleted = 0, 
      totalChunks = 1, 
      timeElapsed = 0,
      strugglingChunks = [],
      streak = 0
    } = sessionData;

    const percent = Math.round((chunksCompleted / totalChunks) * 100);
    const isStruggling = strugglingChunks.length > 0;

    const prompt = `
Generate ONE SHORT encouraging message for an ADHD student in a focus session.

SESSION DATA:
- Progress: ${chunksCompleted}/${totalChunks} chunks (${percent}%)
- Time elapsed: ${timeElapsed} minutes
- Struggling: ${isStruggling ? 'Yes, on ' + strugglingChunks.length + ' chunks' : 'No'}
- Study streak: ${streak} days

REQUIREMENTS:
- Maximum 12 words
- Be specific about their progress
- Energetic but not overwhelming
- Use appropriate emoji (🎯 ⭐ 💪 🔥 ✨)
- Acknowledge struggle if present, but stay positive
- Celebrate milestones (50%, 75%, 90%, completion)

EXAMPLES:
- "You're crushing it! ${percent}% done - almost there! 🎯"
- "Great focus! Pushed through that tough section! 💪"
- "Halfway there! Your brain is on fire today! 🔥"
- "${streak}-day streak! You're building serious study power! ⭐"

Respond with JUST the message text (no JSON, no quotes).
`;

    try {
      const message = await geminiService.generateContent(prompt);
      return message.trim().replace(/^["']|["']$/g, ''); // Remove quotes if present
    } catch (error) {
      console.error('Encouragement generation error:', error.message);
      
      // Fallback messages based on progress
      if (percent >= 100) return "Session complete! You did it! 🎉";
      if (percent >= 75) return `Almost there! ${percent}% done! 🎯`;
      if (percent >= 50) return `Halfway there! Keep going! 💪`;
      if (percent >= 25) return `Great start! ${percent}% complete! ⭐`;
      return `${percent}% complete - you're doing great! ✨`;
    }
  }

  checkBreakNeeded(sessionData) {
    const { sessionMinutes = 0, pomodoroWork = 25 } = sessionData;
    
    const shouldBreak = sessionMinutes >= pomodoroWork;
    
    return {
      shouldBreak,
      message: shouldBreak 
        ? "Time for a break! You've earned it 🎉" 
        : `${pomodoroWork - sessionMinutes} minutes until break`,
      duration: shouldBreak ? 5 : 0,
      reason: shouldBreak 
        ? 'Pomodoro timer complete' 
        : 'Still in work session'
    };
  }

  detectFocusDecline(interactionData) {
    const {
      rereadCount = 0,
      pauseCount = 0,
      skipCount = 0,
      timeOnCurrentChunk = 0,
      averageTimePerChunk = 60
    } = interactionData;

    let focusScore = 100;
    let issues = [];

    // Calculate focus decline
    if (rereadCount > 2) {
      focusScore -= 20;
      issues.push('Re-reading frequently');
    }
    
    if (pauseCount > 3) {
      focusScore -= 15;
      issues.push('Taking many pauses');
    }
    
    if (skipCount > 0) {
      focusScore -= 25;
      issues.push('Skipping content');
    }
    
    if (timeOnCurrentChunk > averageTimePerChunk * 2) {
      focusScore -= 30;
      issues.push('Stuck on current chunk');
    }

    const needsBreak = focusScore < 50;

    return {
      focusScore: Math.max(0, focusScore),
      needsBreak,
      issues,
      suggestion: needsBreak 
        ? "Take a quick 2-minute break. Walk around, get water, reset your brain! 🚶"
        : "You're staying focused! Keep up the good work! ✨",
      severity: focusScore < 30 ? 'high' : focusScore < 60 ? 'medium' : 'low'
    };
  }

  personalizePomodoro(userHistory = []) {
    // Analyze user's past sessions to find optimal focus duration
    if (userHistory.length === 0) {
      return this.getDefaultPomodoro();
    }

    const avgSuccessfulFocusTime = this.calculateAverageFocusTime(userHistory);
    
    // Adaptive Pomodoro based on ADHD needs
    if (avgSuccessfulFocusTime < 15) {
      return {
        workMinutes: 10,
        shortBreakMinutes: 3,
        longBreakMinutes: 15,
        sessionsBeforeLongBreak: 3,
        reason: "Shorter work periods match your focus pattern better",
        confidence: userHistory.length >= 5 ? 'high' : 'medium'
      };
    } else if (avgSuccessfulFocusTime > 30) {
      return {
        workMinutes: 30,
        shortBreakMinutes: 5,
        longBreakMinutes: 20,
        sessionsBeforeLongBreak: 3,
        reason: "You're able to sustain longer focus - let's use that strength!",
        confidence: userHistory.length >= 5 ? 'high' : 'medium'
      };
    }

    // Standard Pomodoro
    return {
      workMinutes: 25,
      shortBreakMinutes: 5,
      longBreakMinutes: 15,
      sessionsBeforeLongBreak: 4,
      reason: "Classic Pomodoro timing works well for your focus style",
      confidence: userHistory.length >= 5 ? 'high' : 'medium'
    };
  }

  getDefaultPomodoro() {
    return {
      workMinutes: 25,
      shortBreakMinutes: 5,
      longBreakMinutes: 15,
      sessionsBeforeLongBreak: 4,
      reason: "Starting with classic Pomodoro - we'll adapt to your style",
      confidence: 'default'
    };
  }

  calculateAverageFocusTime(history) {
    if (!Array.isArray(history) || history.length === 0) {
      return 20; // default
    }

    const validSessions = history.filter(s => s.focusMinutes && s.focusMinutes > 0);
    
    if (validSessions.length === 0) {
      return 20;
    }

    const totalMinutes = validSessions.reduce((sum, session) => sum + session.focusMinutes, 0);
    return Math.round(totalMinutes / validSessions.length);
  }

  generateBreakActivities() {
    const activities = [
      { 
        icon: '🚶', 
        activity: 'Take a walk', 
        duration: '5 min',
        why: 'Movement helps ADHD brains reset'
      },
      { 
        icon: '💧', 
        activity: 'Get water', 
        duration: '1 min',
        why: 'Hydration improves focus'
      },
      { 
        icon: '🧘', 
        activity: 'Stretch or do yoga poses', 
        duration: '5 min',
        why: 'Release physical tension'
      },
      { 
        icon: '👀', 
        activity: 'Look away from screen (20-20-20 rule)', 
        duration: '20 sec',
        why: 'Rest your eyes'
      },
      { 
        icon: '🎵', 
        activity: 'Listen to one song', 
        duration: '3-4 min',
        why: 'Music can boost mood and energy'
      },
      { 
        icon: '🍎', 
        activity: 'Healthy snack', 
        duration: '2 min',
        why: 'Brain fuel for better focus'
      }
    ];

    // Shuffle and return 3 random suggestions
    return activities
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
  }
}

export default new FocusCoach();
