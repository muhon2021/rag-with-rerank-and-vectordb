import { searchSimilar } from '../../services/pineconeService.js';
import { embedQuestion, answerWithContext } from '../shared.js';

const NAMESPACE = 'chunked';
const TOP_K = 5;

export async function run(query) {
  const vector = await embedQuestion(query);
  const chunks = await searchSimilar(NAMESPACE, vector, TOP_K);
  return answerWithContext(chunks, query, { stage: 'chunked', namespace: NAMESPACE });
}
