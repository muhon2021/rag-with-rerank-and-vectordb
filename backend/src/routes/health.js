import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { describeIndexStats, testConnection, isIndexReadyForChat } from '../services/pineconeService.js';
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

    // New boolean field indicating whether ingest/index is ready to serve chat queries
    // This calls into the pinecone service health helper which will return false on errors
    const is_ingest_ready = await isIndexReadyForChat();

    res.json({
      status: pineconeOk && totalVectors > 0 ? 'ready' : totalVectors > 0 ? 'degraded' : 'empty',
      pinecone: pineconeOk,
      namespaces,
      keywordIndex: keywordHybrid,
      is_ingest_ready,
      message:
        totalVectors === 0
          ? 'No data indexed. Run: npm run ingest (from project root or backend folder)'
          : 'System ready',
    });
  })
);

export default router;
