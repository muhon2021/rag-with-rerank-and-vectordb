import { searchSimilar } from '../../services/pineconeService.js';
import { searchKeywords, reciprocalRankFusion } from '../../services/keywordIndex.js';
import { embedQuestion, answerWithContext } from '../shared.js';

const NAMESPACE = 'hybrid';
const VECTOR_K = 10;
const KEYWORD_K = 10;
const FINAL_K = 5;

function extractPolicyLikeTokens(query) {
  const matches = query.match(/\b[A-Z]{2,}(?:-[A-Z0-9]{2,})+\b/g);
  return matches ? [...new Set(matches)] : [];
}

function boostExactKeywordHits(query, keywordResults) {
  const exactTokens = extractPolicyLikeTokens(query);
  if (exactTokens.length === 0) return keywordResults;

  return keywordResults
    .map((item) => {
      const text = `${item.text} ${item.source} ${item.heading || ''}`.toUpperCase();
      const matchCount = exactTokens.reduce(
        (count, token) => (text.includes(token.toUpperCase()) ? count + 1 : count),
        0
      );
      if (matchCount === 0) return item;
      return {
        ...item,
        score: item.score + matchCount * 10,
        exactTokenMatches: matchCount,
      };
    })
    .sort((a, b) => b.score - a.score);
}

function selectDiverseResults(results, limit) {
  const sourceCounts = new Map();
  const selected = [];

  for (const item of results) {
    const source = item.source || 'unknown';
    const count = sourceCounts.get(source) || 0;
    if (count >= 2) continue;
    selected.push(item);
    sourceCounts.set(source, count + 1);
    if (selected.length >= limit) break;
  }

  if (selected.length < limit) {
    for (const item of results) {
      if (selected.includes(item)) continue;
      selected.push(item);
      if (selected.length >= limit) break;
    }
  }

  return selected;
}

export async function run(query) {
  const vector = await embedQuestion(query);
  const vectorResults = await searchSimilar(NAMESPACE, vector, VECTOR_K);
  const keywordResults = boostExactKeywordHits(query, searchKeywords(NAMESPACE, query, KEYWORD_K));

  const mergedRaw = reciprocalRankFusion(vectorResults, keywordResults, {
    topK: FINAL_K,
    vectorWeight: 0.9,
    keywordWeight: 1.5,
  });
  const merged = selectDiverseResults(mergedRaw, FINAL_K);

  return answerWithContext(merged, query, {
    stage: 'hybrid',
    namespace: NAMESPACE,
    keywordScores: keywordResults.map((c) => ({
      id: c.id,
      score: c.score,
      source: c.source,
    })),
    fusionUsed: true,
  });
}
