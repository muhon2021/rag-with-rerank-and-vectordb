import express from 'express';
import cors from 'cors';
import { config, validateConfig } from './config.js';
import { errorHandler, requestTimeout } from './middleware/errorHandler.js';
import chatRoutes from './routes/chat.js';
import healthRoutes from './routes/health.js';
import ingestRoutes from './routes/ingest.js';
import { testConnection, ensureIndex } from './services/pineconeService.js';
import { loadKeywordIndex } from './services/keywordIndex.js';
import OpenAI from 'openai';

const app = express();

app.use(
  cors({
    origin: [config.frontendUrl, 'http://localhost:5173'],
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use('/api', requestTimeout(120000));

app.use('/api/health', healthRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/ingest', ingestRoutes);

app.get('/api', (_req, res) => {
  res.json({ name: 'RAG Learning Lab API', version: '1.0.0' });
});

app.use(errorHandler);

async function startupChecks() {
  validateConfig();
  console.log('Validating OpenAI connection...');
  const openai = new OpenAI({ apiKey: config.openaiApiKey });
  await openai.models.list();
  console.log('OpenAI OK');

  console.log('Validating Pinecone connection...');
  await testConnection();
  console.log('Pinecone OK');
  await ensureIndex();

  const keywordLoaded = await loadKeywordIndex('hybrid');
  console.log(keywordLoaded ? 'Hybrid keyword index loaded from cache' : 'Hybrid keyword index not cached (run ingest)');
}

startupChecks()
  .then(() => {
    app.listen(config.port, () => {
      console.log(`\nRAG Learning Lab API running at http://localhost:${config.port}`);
      console.log('Run "npm run ingest" if you have not indexed documents yet.\n');
    });
  })
  .catch((err) => {
    console.error('\nStartup failed:', err.message);
    console.error('\nFix your .env file and try again.\n');
    process.exit(1);
  });
