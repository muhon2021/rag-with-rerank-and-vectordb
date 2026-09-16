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

const SYSTEM_PROMPT = `You are a helpful internal company knowledge assistant.
Answer ONLY using the provided context from company policy documents.
If the answer is not in the context, say "I don't have enough information in the knowledge base to answer that."
Always cite the source document filename(s) when answering.
Do not claim details from sections/documents that are not explicitly present in the provided context.
If a section name is uncertain, omit section naming instead of guessing.
Be concise and accurate.`;

const MAX_CHUNK_TEXT_CHARS = 1000;
const MAX_CONTEXT_CHARS = 6000;

export function buildContext(chunks) {
  const lines = [];

  for (let i = 0; i < chunks.length; i++) {
    const c = chunks[i];
    const chunkText = (c.text || '').slice(0, MAX_CHUNK_TEXT_CHARS);
    const line = `[Chunk ${i + 1}] Source: ${c.source}${c.heading ? ` | Section: ${c.heading}` : ''}\n${chunkText}`;
    const nextContext = [...lines, line].join('\n\n---\n\n');
    if (nextContext.length > MAX_CONTEXT_CHARS) break;
    lines.push(line);
  }

  return lines.join('\n\n---\n\n');
}

export async function generateAnswer({ context, question }) {
  const userContent = `Context:\n${context}\n\nQuestion: ${question}`;

  try {
    const response = await withRetry(() =>
      getClient().chat.completions.create({
        model: config.model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userContent },
        ],
        temperature: 0,
        max_tokens: 1024,
      })
    );

    const choice = response.choices[0];
    return {
      answer: choice.message?.content?.trim() || 'No response generated.',
      promptSent: `System:\n${SYSTEM_PROMPT}\n\nUser:\n${userContent}`,
      tokenUsage: response.usage
        ? {
            prompt: response.usage.prompt_tokens,
            completion: response.usage.completion_tokens,
            total: response.usage.total_tokens,
          }
        : null,
    };
  } catch (err) {
    throw new AppError(
      err.message || 'Failed to generate answer',
      'OPENAI_ERROR',
      err.status || 502
    );
  }
}
