import express from 'express';
import { generateMcqs } from '../services/mcqService.js';

const router = express.Router();

const RAG_STAGES = ['basic', 'chunked', 'hybrid', 'rerank'];

router.post('/generate', async (req, res) => {
  try {
    const { stage } = req.body || {};
    if (!stage || !RAG_STAGES.includes(stage)) {
      return res.status(400).json({ error: `Invalid or missing stage. Must be one of: ${RAG_STAGES.join(', ')}`, code: 'BAD_STAGE' });
    }

    const mcqs = await generateMcqs(stage);
    return res.json({ mcqs });
  } catch (err) {
    const msg = err?.message || 'MCQ generation failed';
    if (/No content found/i.test(msg) || /too small to generate/i.test(msg)) {
      return res.status(404).json({ error: msg, code: 'NO_CONTENT' });
    }
    if (/Invalid stage/i.test(msg)) {
      return res.status(400).json({ error: msg, code: 'BAD_STAGE' });
    }
    if (/Failed to parse MCQ JSON/i.test(msg)) {
      return res.status(502).json({ error: msg, code: 'BAD_LLM_OUTPUT' });
    }
    return res.status(500).json({ error: msg, code: 'MCQ_ERROR' });
  }
});

export default router;
