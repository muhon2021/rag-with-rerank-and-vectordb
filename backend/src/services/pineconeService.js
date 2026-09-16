import { Pinecone } from '@pinecone-database/pinecone';
import { config } from '../config.js';
import { AppError } from '../middleware/errorHandler.js';
import { withRetry } from '../utils/retry.js';

let pinecone;
let index;
let activeIndexName = config.pineconeIndexName;

const NAMESPACES = ['basic', 'chunked', 'hybrid', 'rerank'];

function getPinecone() {
  if (!pinecone) {
    pinecone = new Pinecone({ apiKey: config.pineconeApiKey });
  }
  return pinecone;
}

function getIndex() {
  if (!index) {
    index = getPinecone().index(activeIndexName);
  }
  return index;
}

async function createServerlessIndex(pc, indexName) {
  console.log(`Creating Pinecone index: ${indexName}`);
  await pc.createIndex({
    name: indexName,
    dimension: config.embeddingDimension,
    metric: 'cosine',
    spec: {
      serverless: {
        cloud: 'aws',
        region: 'us-east-1',
      },
    },
  });
  console.log('Waiting for index to be ready...');
  await new Promise((r) => setTimeout(r, 10000));
}

export async function ensureIndex() {
  const pc = getPinecone();
  const existing = await pc.listIndexes();
  const names = existing.indexes?.map((i) => i.name) || [];
  const primaryIndexName = config.pineconeIndexName;

  if (!names.includes(primaryIndexName)) {
    await createServerlessIndex(pc, primaryIndexName);
    activeIndexName = primaryIndexName;
    return;
  }

  const primaryStats = await pc.index(primaryIndexName).describeIndexStats();
  const currentDimension = primaryStats.dimension;
  if (!currentDimension || currentDimension === config.embeddingDimension) {
    activeIndexName = primaryIndexName;
    return;
  }

  const dimensionSpecificName = `${primaryIndexName}-${config.embeddingDimension}`;
  console.warn(
    `Index "${primaryIndexName}" has dimension ${currentDimension}, expected ${config.embeddingDimension}. ` +
      `Using "${dimensionSpecificName}" instead.`
  );

  if (!names.includes(dimensionSpecificName)) {
    await createServerlessIndex(pc, dimensionSpecificName);
  }
  activeIndexName = dimensionSpecificName;
  index = null;
}

export async function upsertChunks(namespace, chunksWithVectors) {
  const ns = getIndex().namespace(namespace);
  const batchSize = 100;

  for (let i = 0; i < chunksWithVectors.length; i += batchSize) {
    const batch = chunksWithVectors.slice(i, i + batchSize);
    const records = batch.map((item) => ({
      id: item.id,
      values: item.vector,
      metadata: {
        text: item.text.slice(0, 35000),
        source: item.source,
        heading: item.heading || '',
        chunkIndex: item.chunkIndex,
        documentId: item.documentId || '',
        documentTitle: item.documentTitle || '',
      },
    }));

    await withRetry(() => ns.upsert(records));
  }
}

export async function searchSimilar(namespace, vector, topK = 5) {
  try {
    const ns = getIndex().namespace(namespace);
    const result = await withRetry(() =>
      ns.query({
        vector,
        topK,
        includeMetadata: true,
      })
    );

    return (result.matches || []).map((match) => ({
      id: match.id,
      score: match.score ?? 0,
      text: match.metadata?.text || '',
      source: match.metadata?.source || '',
      heading: match.metadata?.heading || '',
      chunkIndex: match.metadata?.chunkIndex ?? 0,
      documentId: match.metadata?.documentId || '',
      documentTitle: match.metadata?.documentTitle || '',
    }));
  } catch (err) {
    throw new AppError(
      err.message || 'Vector search failed',
      'VECTOR_DB_ERROR',
      502
    );
  }
}

export async function getNamespaceStats() {
  const stats = {};
  for (const ns of NAMESPACES) {
    try {
      const result = await getIndex().namespace(ns).query({
        vector: new Array(config.embeddingDimension).fill(0),
        topK: 1,
        includeMetadata: false,
      });
      stats[ns] = result.matches?.length > 0 ? 'ready' : 'empty';
    } catch {
      stats[ns] = 'empty';
    }
  }
  return stats;
}

export async function describeIndexStats() {
  try {
    const stats = await getIndex().describeIndexStats();
    const namespaces = {};
    for (const ns of NAMESPACES) {
      namespaces[ns] = stats.namespaces?.[ns]?.recordCount ?? 0;
    }
    return namespaces;
  } catch (err) {
    return Object.fromEntries(NAMESPACES.map((ns) => [ns, 0]));
  }
}

export async function testConnection() {
  await getPinecone().listIndexes();
  return true;
}

export { NAMESPACES };
