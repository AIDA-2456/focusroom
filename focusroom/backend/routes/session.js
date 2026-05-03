import express from 'express';
import focusCoach from '../agents/FocusCoach.js';

const router = express.Router();

/**
 * POST /api/session/encouragement
 * Get an encouraging message based on session progress
 */
router.post('/encouragement', async (req, res) => {
  try {
    const sessionData = req.body;

    const message = await focusCoach.generateEncouragement(sessionData);

    res.json({
      success: true,
      message
    });
    
  } catch (error) {
    console.error('Encouragement generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate encouragement',
      message: error.message
    });
  }
});

/**
 * POST /api/session/check-break
 * Check if a break is needed based on session time
 */
router.post('/check-break', async (req, res) => {
  try {
    const { sessionMinutes, pomodoroWork = 25 } = req.body;

    const breakStatus = focusCoach.checkBreakNeeded({ sessionMinutes, pomodoroWork });

    res.json({
      success: true,
      data: breakStatus
    });
    
  } catch (error) {
    console.error('Break check error:', error);
    res.status(500).json({ 
      error: 'Failed to check break status',
      message: error.message
    });
  }
});

/**
 * POST /api/session/focus-score
 * Calculate focus score based on user interaction patterns
 */
router.post('/focus-score', async (req, res) => {
  try {
    const interactionData = req.body;

    const focusAnalysis = focusCoach.detectFocusDecline(interactionData);

    res.json({
      success: true,
      data: focusAnalysis
    });
    
  } catch (error) {
    console.error('Focus score error:', error);
    res.status(500).json({ 
      error: 'Failed to calculate focus score',
      message: error.message
    });
  }
});

/**
 * POST /api/session/personalize-pomodoro
 * Get personalized Pomodoro settings based on user history
 */
router.post('/personalize-pomodoro', async (req, res) => {
  try {
    const { userHistory = [] } = req.body;

    const pomodoroSettings = focusCoach.personalizePomodoro(userHistory);

    res.json({
      success: true,
      data: pomodoroSettings
    });
    
  } catch (error) {
    console.error('Pomodoro personalization error:', error);
    res.status(500).json({ 
      error: 'Failed to personalize Pomodoro',
      message: error.message
    });
  }
});

/**
 * GET /api/session/break-activities
 * Get suggested break activities
 */
router.get('/break-activities', (req, res) => {
  try {
    const activities = focusCoach.generateBreakActivities();

    res.json({
      success: true,
      data: activities
    });
    
  } catch (error) {
    console.error('Break activities error:', error);
    res.status(500).json({ 
      error: 'Failed to get break activities',
      message: error.message
    });
  }
});

export default router;
