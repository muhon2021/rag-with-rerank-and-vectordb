const STOPWORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'must', 'shall', 'can', 'to', 'of', 'in',
  'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through',
  'during', 'before', 'after', 'above', 'below', 'between', 'under',
  'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where',
  'why', 'how', 'all', 'each', 'few', 'more', 'most', 'other', 'some',
  'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too',
  'very', 'just', 'and', 'but', 'if', 'or', 'because', 'until', 'while',
  'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am',
  'it', 'its', 'i', 'me', 'my', 'we', 'our', 'you', 'your', 'he', 'she',
  'they', 'them', 'their',
]);

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KEYWORD_CACHE_DIR = path.resolve(__dirname, '../../.cache');

const indexes = new Map();

function cachePath(namespace) {
  return path.join(KEYWORD_CACHE_DIR, `keyword-${namespace}.json`);
}

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

export function buildKeywordIndex(namespace, chunks) {
  const docFreq = new Map();
  const documents = chunks.map((chunk, docIdx) => {
    const tokens = tokenize(chunk.text);
    const unique = new Set(tokens);
    for (const term of unique) {
      docFreq.set(term, (docFreq.get(term) || 0) + 1);
    }
    return { ...chunk, docIdx, tokens, uniqueTokens: unique };
  });

  const index = {
    namespace,
    documents,
    docFreq,
    totalDocs: documents.length,
  };

  indexes.set(namespace, index);
  return index;
}

export async function saveKeywordIndex(namespace) {
  const index = indexes.get(namespace);
  if (!index) return;
  await fs.mkdir(KEYWORD_CACHE_DIR, { recursive: true });
  const serializable = {
    namespace: index.namespace,
    totalDocs: index.totalDocs,
    documents: index.documents.map((d) => ({
      id: d.id,
      text: d.text,
      source: d.source,
      heading: d.heading,
      chunkIndex: d.chunkIndex,
      documentId: d.documentId,
      documentTitle: d.documentTitle,
      tokens: d.tokens,
    })),
    docFreq: [...index.docFreq.entries()],
  };
  await fs.writeFile(cachePath(namespace), JSON.stringify(serializable));
}

export async function loadKeywordIndex(namespace) {
  try {
    const raw = await fs.readFile(cachePath(namespace), 'utf-8');
    const data = JSON.parse(raw);
    const docFreq = new Map(data.docFreq);
    const documents = data.documents.map((d) => ({
      ...d,
      uniqueTokens: new Set(d.tokens),
    }));
    indexes.set(namespace, {
      namespace: data.namespace,
      documents,
      docFreq,
      totalDocs: data.totalDocs,
    });
    return true;
  } catch {
    return false;
  }
}

export function searchKeywords(namespace, query, topK = 10) {
  const index = indexes.get(namespace);
  if (!index || index.totalDocs === 0) return [];

  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  const k1 = 1.5;
  const b = 0.75;
  const avgDocLen =
    index.documents.reduce((sum, d) => sum + d.tokens.length, 0) / index.totalDocs || 1;

  const scores = index.documents.map((doc) => {
    const docLen = doc.tokens.length;
    const termFreq = new Map();
    for (const t of doc.tokens) {
      termFreq.set(t, (termFreq.get(t) || 0) + 1);
    }

    let score = 0;
    for (const term of queryTokens) {
      const tf = termFreq.get(term) || 0;
      if (tf === 0) continue;
      const df = index.docFreq.get(term) || 0;
      const idf = Math.log((index.totalDocs - df + 0.5) / (df + 0.5) + 1);
      const tfNorm = (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * (docLen / avgDocLen)));
      score += idf * tfNorm;
    }

    return {
      id: doc.id,
      score,
      text: doc.text,
      source: doc.source,
      heading: doc.heading,
      chunkIndex: doc.chunkIndex,
      documentId: doc.documentId,
      documentTitle: doc.documentTitle,
    };
  });

  return scores
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

export function getKeywordIndexStatus(namespace) {
  const index = indexes.get(namespace);
  return { loaded: !!index, documentCount: index?.totalDocs ?? 0 };
}

export function reciprocalRankFusion(
  vectorResults,
  keywordResults,
  { k = 60, topK = 5, vectorWeight = 1, keywordWeight = 1 } = {}
) {
  const scores = new Map();

  const addResults = (results, weight = 1) => {
    results.forEach((item, rank) => {
      const key = item.id || `${item.source}-${item.chunkIndex}`;
      const rrf = weight * (1 / (k + rank + 1));
      const existing = scores.get(key) || { item, score: 0 };
      existing.score += rrf;
      existing.item = { ...existing.item, ...item };
      scores.set(key, existing);
    });
  };

  addResults(vectorResults, vectorWeight);
  addResults(keywordResults, keywordWeight);

  return [...scores.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(({ item, score }) => ({
      ...item,
      fusionScore: score,
      score: item.score ?? score,
    }));
}
