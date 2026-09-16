import OpenAI from 'openai';
import { config } from '../config.js';
import { AppError } from '../middleware/errorHandler.js';
import { withRetry } from '../utils/retry.js';

let client;

function getClient() {
  if (!client) {
    client = new OpenAI({ apiKey: config.openaiApiKey });
  }
  return client;
}

const BATCH_SIZE = 100;

export async function embedTexts(texts) {
  if (!texts.length) return [];

  const openai = getClient();
  const allEmbeddings = [];

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    try {
      const response = await withRetry(() =>
        openai.embeddings.create({
          model: config.embeddingModel,
          input: batch,
        })
      );
      const sorted = response.data.sort((a, b) => a.index - b.index);
      allEmbeddings.push(...sorted.map((d) => d.embedding));
    } catch (err) {
      throw new AppError(
        err.message || 'Failed to generate embeddings',
        'OPENAI_ERROR',
        err.status || 502
      );
    }
  }

  return allEmbeddings;
}

export async function embedQuery(text) {
  const [embedding] = await embedTexts([text]);
  return embedding;
}
