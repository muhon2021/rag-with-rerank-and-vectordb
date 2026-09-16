import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { describeIndexStats, testConnection } from '../services/pineconeService.js';
import { getKeywordIndexStatus } from '../services/keywordIndex.js';
import { validateConfig } from '../config.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    let pineconeOk = false;
    let namespaces = { basic: 0, chunked: 0, hybrid: 0, rerank: 0 };

    try {
      validateConfig();
      await testConnection();
      namespaces = await describeIndexStats();
      pineconeOk = true;
    } catch {
      pineconeOk = false;
    }

    const keywordHybrid = getKeywordIndexStatus('hybrid');
    const totalVectors = Object.values(namespaces).reduce((a, b) => a + b, 0);

    res.json({
      status: pineconeOk && totalVectors > 0 ? 'ready' : totalVectors > 0 ? 'degraded' : 'empty',
      pinecone: pineconeOk,
      namespaces,
      keywordIndex: keywordHybrid,
      message:
        totalVectors === 0
          ? 'No data indexed. Run: npm run ingest (from project root or backend folder)'
          : 'System ready',
    });
  })
);

export default router;
