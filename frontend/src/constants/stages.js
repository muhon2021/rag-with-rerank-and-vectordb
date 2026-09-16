import {
  TITLE_STEP,
  FAQ_SCREEN_1,
  FAQ_SCREEN_2,
  FAQ_SCREEN_3,
  ARCHITECTURE_MATRIX_STEP,
  THANK_YOU_STEP,
} from './workshopSlides.js';

export const STAGES = [
  {
    id: 'basic',
    title: 'Basic RAG',
    description: 'Fixed chunks, vector search only',
    technologies: [
      'Load markdown policies from /data',
      'Fixed 500-character chunks, no overlap',
      'OpenAI text-embedding-3-small (1536-d)',
      'Pinecone namespace "basic", cosine search',
      'Retrieve top 5 chunks only',
      'GPT answers from context only',
      'React → Express → Pinecone + OpenAI',
    ],
    dataFlow: [
      { step: 'User asks a question' },
      { step: 'Embed the question' },
      { step: 'Vector search in Pinecone' },
      { step: 'Take top 5 matching chunks' },
      { step: 'Send chunks as context to GPT' },
      { step: 'Return grounded answer' },
    ],
    pros: [
      'Fastest way to ship internal Q&A',
      'Small moving parts — easy to debug',
      'Works when wording matches the docs',
      'Good teaching baseline for RAG',
      'Low cost per query',
    ],
    cons: [
      'Chunks can cut tables and sections',
      'Misses exact IDs (POLICY-SEC-2025, MFA codes)',
      'No keyword or rerank safety net',
      'Only 5 chunks — noise goes to the LLM',
      'Quality tied to chunk boundaries',
    ],
    talkPoint: 'Baseline: same LLM, simplest retrieval.',
  },
  {
    id: 'chunked',
    title: 'Better Chunking',
    description: 'Split docs by headings and paragraphs, not fixed character cuts',
    technologies: [
      'Same files as Basic — different way to split them',
      'Cuts on headings (# / ##) and paragraphs',
      'About 400 characters per chunk, with a small overlap between neighbors',
      'Each chunk remembers its section title and source file',
      'When you ask a question: same steps as Basic (embed → top 5 → GPT)',
      'Stored in Pinecone under namespace "chunked" (separate from "basic")',
      'Change chunk rules? Run npm run ingest again',
    ],
    dataFlow: [
      { step: 'When indexing: split each doc by section' },
      { step: 'Turn chunks into vectors and save in Pinecone' },
      { step: 'User asks a question' },
      { step: 'Same as Basic: embed question and search' },
      { step: 'Take the 5 best-matching section-sized chunks' },
      { step: 'GPT answers using that context' },
    ],
    pros: [
      'Usually much better answers, with little extra work per question',
      'Tables and policy sections are less likely to be cut in half',
      'Overlapping chunks help so important lines are not lost at edges',
      'You can see which section a chunk came from in debug mode',
      'Chat flow stays the same — only how docs were split changed',
      'Easy to try: re-ingest with better chunks, keep Basic for comparison',
    ],
    cons: [
      'Still searches by meaning only — not exact word match',
      'Rare IDs or exact codes can still be missed (use Hybrid for that)',
      'More chunks to embed — ingest takes longer and costs a bit more',
      'After you change chunk settings, you must run ingest again',
      'Does not automatically combine several files into one answer',
    ],
    talkPoint: 'We only changed how documents are cut — not how search works.',
  },
  {
    id: 'hybrid',
    title: 'Hybrid Search',
    description: 'Vector + keyword fusion',
    technologies: [
      'Semantic: Pinecone top 10 (hybrid ns)',
      'Keyword: BM25-style in-memory index',
      'RRF merges both ranked lists',
      'Boost on exact policy / control IDs',
      'Limit chunks per source file',
      'Final top 5 to GPT',
      'Keyword cache rebuilt on ingest',
    ],
    dataFlow: [
      { step: 'User asks a question' },
      { step: 'Embed for semantic search' },
      { step: 'Tokenize for keyword search' },
      { step: 'Merge lists with RRF + boosts' },
      { step: 'Pick best top 5 chunks' },
      { step: 'GPT synthesizes multi-doc answer' },
    ],
    pros: [
      'Strong on policy numbers and acronyms',
      'Handles paraphrase and exact IDs',
      'Can pull security + AWS docs together',
      'Tunable vector vs keyword weight',
      'Best demo for cross-document questions',
    ],
    cons: [
      'Second index to build and refresh',
      'In-memory keywords — not prod-ready as-is',
      'Two retrievals per question',
      'Needs tuning to avoid keyword dominance',
      'More moving parts to operate',
    ],
    talkPoint: 'When users search by ID and by meaning.',
  },
  {
    id: 'rerank',
    title: 'Reranked RAG',
    description: 'Retrieve 20, rerank to top 5',
    technologies: [
      'Wide recall: Pinecone top 20',
      'Rerank: overlap + vector score (or Cohere)',
      'Dedupe by source + heading',
      'Trim context before GPT',
      'Namespace "rerank"',
      'Same embeddings and chat model',
    ],
    dataFlow: [
      { step: 'User asks a question' },
      { step: 'Embed and search top 20' },
      { step: 'Score each chunk vs question' },
      { step: 'Drop duplicates, keep top 5' },
      { step: 'Build lean context block' },
      { step: 'GPT focused answer' },
    ],
    pros: [
      'Better precision from a noisy pool',
      'Fewer repeated sections in context',
      'Helps multi-part policy questions',
      'Works without changing chunking/hybrid',
      'Optional Cohere for production quality',
    ],
    cons: [
      'Extra latency after vector search',
      'Cannot fix recall outside top 20',
      'Optional API adds cost',
      'K (20) vs final 5 needs tuning',
      'Reranker quality affects outcomes',
    ],
    talkPoint: 'Pick the best 5 of 20 for this question.',
  },
];

export const COMPARE_STEP = {
  id: 'compare',
  title: 'Compare All Pipelines',
  description: 'One question — four strategies side by side',
  technologies: [
    'POST /api/chat/compare-all',
    'Runs all four pipelines in parallel',
    'Same GPT model and temperature',
    'Each uses its own Pinecone namespace',
    'Per-column chunk and score metadata',
    'Use sample questions for clear gaps',
  ],
  dataFlow: [
    { step: 'Type one workshop question' },
    { step: 'Backend runs 4 retrievals' },
    { step: 'Four answers render side by side' },
    { step: 'Inspect chunks and scores' },
    { step: 'Explain why retrieval differed' },
  ],
  pros: [
    'Replaces a comparison slide',
    'Same LLM — only retrieval changes',
    'Makes hybrid/rerank investment tangible',
    'Audience sees IDs and multi-doc wins',
    'Strong way to close the session',
  ],
  cons: [
    '4× API usage per compare',
    'Slower than single-pipeline chat',
    'Easy questions look similar — pick hard ones',
    'Noisy UI if all four agree',
  ],
  talkPoint: 'Same brain — different retrieval.',
};

const BASIC_STAGE = STAGES.find((s) => s.id === 'basic');
const CHUNKED_STAGE = STAGES.find((s) => s.id === 'chunked');
const HYBRID_STAGE = STAGES.find((s) => s.id === 'hybrid');
const RERANK_STAGE = STAGES.find((s) => s.id === 'rerank');

export const WORKSHOP_STEPS = [
  TITLE_STEP,
  FAQ_SCREEN_1,
  { type: 'stage', ...BASIC_STAGE },
  FAQ_SCREEN_2,
  { type: 'stage', ...CHUNKED_STAGE },
  FAQ_SCREEN_3,
  { type: 'stage', ...HYBRID_STAGE },
  { type: 'stage', ...RERANK_STAGE },
  { type: 'compare', ...COMPARE_STEP },
  ARCHITECTURE_MATRIX_STEP,
  THANK_YOU_STEP,
];

export function getNextStepLabel(currentIndex) {
  if (currentIndex < 0 || currentIndex >= WORKSHOP_STEPS.length - 1) return null;
  const next = WORKSHOP_STEPS[currentIndex + 1];
  if (next.type === 'compare') return 'Compare all pipelines';
  if (next.type === 'matrix') return next.title;
  if (next.type === 'thanks') return 'Thank You';
  if (next.type === 'title') return 'Workshop title';
  if (next.type === 'faq') return next.title;
  if (next.type === 'stage') return next.title;
  return `Continue to ${next.title}`;
}

export const SAMPLE_QUESTIONS = [
  'Which documents mention SEC-CONTROL-MFA-A17, and what does each one say about MFA?',
  'I found POLICY-SEC-2024 in an old ticket. Is it still valid, and what control ID should we use now for AWS console MFA?',
  'In POLICY-SEC-2025, what are the password lockout rules after failed attempts, and how does that relate to AWS initial console login requirements?',
];
