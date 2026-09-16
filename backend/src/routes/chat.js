import { Router } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import * as basicPipeline from '../rag/basic/pipeline.js';
import * as chunkedPipeline from '../rag/chunked/pipeline.js';
import * as hybridPipeline from '../rag/hybrid/pipeline.js';
import * as rerankPipeline from '../rag/rerank/pipeline.js';

const router = Router();

const STAGES = {
  basic: basicPipeline,
  chunked: chunkedPipeline,
  hybrid: hybridPipeline,
  rerank: rerankPipeline,
};

function validateMessage(message) {
  if (!message || typeof message !== 'string') {
    throw new AppError('Message is required', 'VALIDATION_ERROR', 400);
  }
  const trimmed = message.trim();
  if (!trimmed) {
    throw new AppError('Message cannot be empty', 'VALIDATION_ERROR', 400);
  }
  if (trimmed.length > 2000) {
    throw new AppError('Message must be under 2000 characters', 'VALIDATION_ERROR', 400);
  }
  return trimmed;
}

async function runStage(stage, message) {
  const pipeline = STAGES[stage];
  if (!pipeline) {
    throw new AppError(`Unknown stage: ${stage}`, 'VALIDATION_ERROR', 400);
  }
  const result = await pipeline.run(message);
  return { stage, ...result };
}

for (const stage of Object.keys(STAGES)) {
  router.post(
    `/${stage}`,
    asyncHandler(async (req, res) => {
      const message = validateMessage(req.body?.message);
      const result = await runStage(stage, message);
      res.json(result);
    })
  );
}

router.post(
  '/compare-all',
  asyncHandler(async (req, res) => {
    const message = validateMessage(req.body?.message);
    const results = await Promise.all(
      Object.keys(STAGES).map((stage) =>
        runStage(stage, message).catch((err) => ({
          stage,
          error: err.message,
          code: err.code || 'PIPELINE_ERROR',
        }))
      )
    );
    res.json({ message, results });
  })
);

export default router;
