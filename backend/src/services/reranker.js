import { config } from '../config.js';
import { withRetry } from '../utils/retry.js';

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

export function simpleRerank(query, chunks) {
  const queryTerms = new Set(tokenize(query));

  return chunks
    .map((chunk) => {
      const chunkTerms = tokenize(chunk.text);
      let overlap = 0;
      for (const term of chunkTerms) {
        if (queryTerms.has(term)) overlap++;
      }
      const overlapScore = queryTerms.size > 0 ? overlap / queryTerms.size : 0;
      const vectorScore = chunk.score ?? 0;
      const rerankScore = 0.6 * vectorScore + 0.4 * overlapScore;

      return { ...chunk, rerankScore, overlapScore };
    })
    .sort((a, b) => b.rerankScore - a.rerankScore);
}

export async function rerank(query, chunks) {
  if (config.cohereApiKey) {
    try {
      return await cohereRerank(query, chunks);
    } catch (err) {
      console.warn('Cohere rerank failed, falling back to simple rerank:', err.message);
    }
  }
  return simpleRerank(query, chunks);
}

async function cohereRerank(query, chunks) {
  const response = await withRetry(async () => {
    const res = await fetch('https://api.cohere.com/v1/rerank', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.cohereApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'rerank-english-v3.0',
        query,
        documents: chunks.map((c) => c.text),
        top_n: chunks.length,
      }),
    });
    if (!res.ok) {
      const err = new Error(`Cohere rerank failed: ${res.statusText}`);
      err.status = res.status;
      throw err;
    }
    return res.json();
  });

  const byIndex = new Map(response.results.map((r) => [r.index, r.relevance_score]));
  return chunks
    .map((chunk, i) => ({ ...chunk, rerankScore: byIndex.get(i) ?? 0 }))
    .sort((a, b) => b.rerankScore - a.rerankScore);
}
