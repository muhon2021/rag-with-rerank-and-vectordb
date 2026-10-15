import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import { config } from '../config.js';

const RAG_STAGES = ['basic', 'chunked', 'hybrid', 'rerank'];

function assertValidStage(stage) {
  if (!RAG_STAGES.includes(stage)) {
    throw new Error(`Invalid stage: ${stage}. Must be one of ${RAG_STAGES.join(', ')}`);
  }
}

function sanitizeJsonOutput(text) {
  if (typeof text !== 'string') return '';
  // Remove code fences if present
  const cleaned = text.replace(/^```(json)?/gi, '').replace(/```$/gi, '').trim();
  return cleaned;
}

function coalesceText(meta) {
  if (!meta) return '';
  return (
    meta.text ||
    meta.content ||
    meta.pageContent ||
    meta.chunk ||
    meta.body ||
    meta.raw ||
    ''
  );
}

async function embedQuery(openai, query) {
  const model = config.embeddingModel || 'text-embedding-3-small';
  const res = await openai.embeddings.create({
    model,
    input: query,
  });
  const emb = res?.data?.[0]?.embedding;
  if (!emb) throw new Error('Failed to create embedding for MCQ retrieval');
  return emb;
}

async function retrieveStageContext(stage, topK = 8) {
  const openai = new OpenAI({ apiKey: config.openaiApiKey });
  const pinecone = new Pinecone({ apiKey: config.pineconeApiKey });
  const index = pinecone.index(config.pineconeIndexName);

  // Generic query meant to pull broad, representative chunks for quiz generation
  const query = 'key concepts, definitions, and facts suitable for generating quiz questions';
  const vector = await embedQuery(openai, query);

  // Newer Pinecone client supports namespace on the query object
  const result = await index.query({
    vector,
    topK,
    includeMetadata: true,
    namespace: stage,
  });

  const matches = result?.matches || [];
  if (!matches.length) {
    throw new Error(`No content found in Pinecone for stage "${stage}". Run ingest first.`);
  }

  const uniqueTexts = new Set();
  for (const m of matches) {
    const t = coalesceText(m.metadata);
    if (t && t.length > 0) uniqueTexts.add(t);
  }

  const combined = Array.from(uniqueTexts).join('\n\n');
  if (!combined || combined.trim().length < 50) {
    throw new Error('Retrieved content too small to generate MCQs');
  }
  return combined.slice(0, 12000); // keep prompt under reasonable token limits
}

function buildMcqPrompt(context) {
  return [
    {
      role: 'system',
      content:
        'You are an expert quiz generator. Create clear, unambiguous multiple-choice questions strictly from the provided context. Return only valid JSON, no commentary.'
    },
    {
      role: 'user',
      content: `Context for quiz questions:\n\n${context}\n\nTask: Generate exactly 3 multiple-choice questions (MCQs) based ONLY on the context above.\n- Each MCQ must have 1 question string, an array of 3-4 distinct choices, and a single correctAnswer string.\n- The correctAnswer must be EXACTLY one of the choices.\n- Choices should be plausible and not trivial.\n- Avoid ambiguity.\n- Output MUST be JSON only, in this exact array format: \n[\n  {\n    \"question\": \"...\",\n    \"choices\": [\"...\", \"...\", \"...\"],\n    \"correctAnswer\": \"...\"\n  },\n  { ... },\n  { ... }\n]`
    }
  ];
}

function validateMcqs(mcqs) {
  if (!Array.isArray(mcqs) || mcqs.length !== 3) {
    throw new Error('MCQ generation failed: expected an array of exactly 3 items');
  }
  for (let i = 0; i < mcqs.length; i++) {
    const q = mcqs[i];
    if (!q || typeof q !== 'object') throw new Error(`MCQ[${i}] invalid type`);
    if (typeof q.question !== 'string' || q.question.trim().length < 5) {
      throw new Error(`MCQ[${i}] has invalid question`);
    }
    if (!Array.isArray(q.choices) || q.choices.length < 3 || q.choices.length > 5) {
      throw new Error(`MCQ[${i}] must have 3-5 choices`);
    }
    if (typeof q.correctAnswer !== 'string') {
      throw new Error(`MCQ[${i}] missing correctAnswer string`);
    }
    if (!q.choices.includes(q.correctAnswer)) {
      throw new Error(`MCQ[${i}] correctAnswer not in choices`);
    }
  }
}

export async function generateMcqs(stage) {
  assertValidStage(stage);
  const context = await retrieveStageContext(stage, 8);

  const openai = new OpenAI({ apiKey: config.openaiApiKey });
  const messages = buildMcqPrompt(context);

  const model = config.model || 'gpt-4o-mini';
  const completion = await openai.chat.completions.create({
    model,
    messages,
    temperature: 0.3,
    max_tokens: 900,
  });

  const raw = completion?.choices?.[0]?.message?.content || '';
  const cleaned = sanitizeJsonOutput(raw);

  let parsed;
  try {
    // Try direct parse first
    parsed = JSON.parse(cleaned);
  } catch {
    // Fallback: extract first JSON array block
    const match = cleaned.match(/\[[\s\S]*\]/);
    if (!match) throw new Error('Failed to parse MCQ JSON from model output');
    parsed = JSON.parse(match[0]);
  }

  validateMcqs(parsed);
  return parsed;
}
