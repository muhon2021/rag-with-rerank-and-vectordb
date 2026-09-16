import { searchSimilar } from '../../services/pineconeService.js';
import { rerank } from '../../services/reranker.js';
import { embedQuestion, answerWithContext } from '../shared.js';

const NAMESPACE = 'rerank';
const RETRIEVE_K = 20;
const FINAL_K = 5;

function dedupeBySourceAndHeading(chunks, limit) {
  const seen = new Set();
  const sourceCounts = new Map();
  const result = [];

  for (const chunk of chunks) {
    const key = `${chunk.source || 'unknown'}|${chunk.heading || 'no-heading'}`;
    if (seen.has(key)) continue;
    const source = chunk.source || 'unknown';
    const sourceCount = sourceCounts.get(source) || 0;
    if (sourceCount >= 3) continue;
    seen.add(key);
    result.push(chunk);
    sourceCounts.set(source, sourceCount + 1);
    if (result.length >= limit) break;
  }

  return result;
}

export async function run(query) {
  const vector = await embedQuestion(query);
  const candidates = await searchSimilar(NAMESPACE, vector, RETRIEVE_K);
  const rerankedRaw = await rerank(query, candidates);
  const reranked = dedupeBySourceAndHeading(rerankedRaw, FINAL_K);

  return answerWithContext(reranked, query, {
    stage: 'rerank',
    namespace: NAMESPACE,
    rerankScores: reranked.map((c) => ({
      id: c.id,
      vectorScore: c.score ?? 0,
      rerankScore: c.rerankScore ?? 0,
      source: c.source,
    })),
    candidatesRetrieved: candidates.length,
  });
}
