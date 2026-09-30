import express from 'express';
import { askArchiveAssistant } from '../services/aiService.js';

const router = express.Router();

// @route   POST /api/assistant/ask
// @desc    Ask Polar Archive RAG assistant with grounded citations & strict refusal
router.post('/ask', async (req, res) => {
  try {
    const { question, language = 'en' } = req.body;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid question.',
      });
    }

    const startTime = Date.now();
    const result = await askArchiveAssistant(question.trim(), language);
    const durationMs = Date.now() - startTime;

    res.json({
      success: true,
      durationMs,
      ...result,
    });
  } catch (err) {
    console.error('Assistant error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to process question: ' + err.message,
    });
  }
});

export default router;
