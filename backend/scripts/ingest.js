import { v4 as uuidv4 } from 'uuid';
import { validateConfig, config } from '../src/config.js';
import { loadDocuments } from '../src/services/documentLoader.js';
import {
  basicChunker,
  improvedChunker,
  chunkDocuments,
} from '../src/services/chunkingService.js';
import { embedTexts } from '../src/services/embeddingService.js';
import {
  ensureIndex,
  upsertChunks,
  NAMESPACES,
} from '../src/services/pineconeService.js';
import { buildKeywordIndex, saveKeywordIndex } from '../src/services/keywordIndex.js';

async function ingestNamespace(namespace, chunks) {
  console.log(`\n[${namespace}] Chunking complete: ${chunks.length} chunks`);

  const chunksWithIds = chunks.map((c) => ({ ...c, id: uuidv4() }));
  const texts = chunksWithIds.map((c) => c.text);

  console.log(`[${namespace}] Embedding ${texts.length} chunks...`);
  const vectors = await embedTexts(texts);

  const records = chunksWithIds.map((c, i) => ({
    ...c,
    vector: vectors[i],
  }));

  console.log(`[${namespace}] Upserting to Pinecone...`);
  await upsertChunks(namespace, records);

  if (namespace === 'hybrid') {
    buildKeywordIndex(namespace, chunksWithIds);
    await saveKeywordIndex(namespace);
    console.log(`[${namespace}] Keyword index built and cached`);
  }

  return records.length;
}

async function main() {
  console.log('RAG Learning Lab — Ingestion\n');
  validateConfig();

  await ensureIndex();
  const documents = await loadDocuments();
  console.log(`Loaded ${documents.length} documents from ${config.dataDir}`);

  const basicChunks = chunkDocuments(documents, (text) => basicChunker(text));
  const improvedChunks = chunkDocuments(documents, (text) => improvedChunker(text));

  const counts = {};
  counts.basic = await ingestNamespace('basic', basicChunks);
  counts.chunked = await ingestNamespace('chunked', improvedChunks);
  counts.hybrid = await ingestNamespace('hybrid', improvedChunks);
  counts.rerank = await ingestNamespace('rerank', improvedChunks);

  console.log('\nIngestion complete:');
  for (const ns of NAMESPACES) {
    console.log(`  ${ns}: ${counts[ns]} vectors`);
  }
}

main().catch((err) => {
  console.error('Ingestion failed:', err.message);
  process.exit(1);
});
