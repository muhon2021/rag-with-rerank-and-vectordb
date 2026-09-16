import { embedQuery } from '../services/embeddingService.js';
import { buildContext, generateAnswer } from '../services/llmService.js';

export async function answerWithContext(chunks, question, extraDebug = {}) {
  const finalContext = buildContext(chunks);
  const { answer, promptSent, tokenUsage } = await generateAnswer({
    context: finalContext,
    question,
  });

  return {
    answer,
    debug: {
      retrievedChunks: chunks.map((c) => ({
        id: c.id,
        text: c.text,
        source: c.source,
        heading: c.heading,
        chunkIndex: c.chunkIndex,
      })),
      similarityScores: chunks.map((c) => ({
        id: c.id,
        score: c.score ?? 0,
        source: c.source,
      })),
      finalContext,
      promptSent,
      tokenUsage,
      ...extraDebug,
    },
  };
}

export async function embedQuestion(query) {
  return embedQuery(query);
}
