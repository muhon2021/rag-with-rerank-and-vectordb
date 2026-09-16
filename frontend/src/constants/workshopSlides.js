export const WORKSHOP_NAME = 'From Basic RAG to Production Patterns';

export const FAQ_SCREEN_1 = {
  type: 'faq',
  id: 'faq-foundations',
  title: 'Foundations',
  description: '',
  questions: [
    {
      id: 'what-is-rag',
      label: 'What is RAG?',
      answer: [
        'RAG = Retrieval-Augmented Generation.',
        'Before the LLM answers, we search your documents, pull relevant chunks into the prompt, then generate.',
        'Offline: load docs → chunk → embed → store in a vector database.',
        'Online: question → embed → search → top chunks → GPT answer.',
        'The model does not “know” your policies from training — only what retrieval sends.',
      ],
    },
    {
      id: 'why-important',
      label: 'Why is mastering RAG important?',
      answer: [
        'LLMs alone: outdated knowledge, no private data, hallucination risk.',
        'RAG grounds answers in your content — policies, wikis, tickets, code.',
        'Update docs and re-index instead of retraining a model.',
        'Teams ship copilots faster; most failures are retrieval, not “dumb GPT.”',
        'You learn which lever to pull: chunking, search, or ranking.',
      ],
    },
  ],
};

export const FAQ_SCREEN_2 = {
  type: 'faq',
  id: 'faq-building-blocks',
  title: 'Building blocks',
  description: '',
  questions: [
    {
      id: 'types-rag',
      label: 'Types of RAG',
      answer: [
        'Basic / naive — chunk, embed, vector search.',
        'Ingest-focused — better chunking, same search.',
        'Hybrid — semantic + keyword fusion.',
        'Reranked — wide recall, rescore, top-K.',
        'Also in industry: agentic, graph, multi-query, conversational RAG.',
        'Production often combines chunking + hybrid + rerank.',
      ],
    },
    {
      id: 'vector-dbs',
      label: 'Vector databases',
      answer: [
        'Pinecone',
        'Weaviate Cloud',
        'Zilliz',
        'Qdrant',
        'Milvus',
        'pgvector',
      ],
    },
    {
      id: 'types-chunking',
      label: 'Types of chunking',
      answer: [
        'Fixed-size — every N characters (our Basic RAG: 500 chars, no overlap).',
        'Structure-aware — headings, paragraphs, sections (our Better Chunking demo).',
        'Overlap — shared text between chunks so borders do not lose sentences.',
        'Semantic chunking — split when meaning/topic shifts (embedding-based).',
        'Parent–child — small chunks for search, larger parent for LLM context.',
        'Document-level — whole file as one chunk (only for short docs).',
      ],
    },
  ],
};

export const FAQ_SCREEN_3 = {
  type: 'faq',
  id: 'faq-embeddings-and-failures',
  title: 'Embeddings & failure modes',
  description: '',
  questions: [
    {
      id: 'embeddings',
      label: 'Types of embeddings',
      answer: [
        'Dense text embeddings — OpenAI, Cohere, Voyage (semantic similarity).',
        'Same model for ingest and query — critical for good search.',
        'Dimensions matter — index must match (here: 1536-d).',
        'Sparse / lexical — BM25-style; often paired in hybrid RAG.',
        'Specialized: code embeddings, multimodal (text + image) for richer docs.',
        'This lab: OpenAI text-embedding-3-small.',
      ],
    },
    {
      id: 'when-wrong',
      label: 'When do RAG answers go wrong?',
      answer: [
        'Ingest — docs missing, stale, or not indexed.',
        'Chunking — tables split, sections cut in half.',
        'Search — wrong chunks retrieved (semantic miss or no keywords).',
        'Ranking — right doc in pool, wrong paragraph in top-K.',
        'Generation — good context but model ignores or hallucinates.',
        'Ask: which layer failed? That guides your next fix.',
      ],
    },
  ],
};

export const ARCHITECTURE_MATRIX_STEP = {
  type: 'matrix',
  id: 'architecture-matrix',
  title: 'Which RAG for which use case?',
  description: 'Quick picks by scenario',
  rows: [
    {
      scenario: 'Simple PDF chat',
      stack: 'Recursive chunking + semantic search + Basic RAG',
    },
    {
      scenario: 'Knowledge base',
      stack: 'Structure chunking + hybrid search + reranking',
    },
    {
      scenario: 'Customer support',
      stack: 'Parent–child + hybrid search + reranking',
    },
    {
      scenario: 'EMR / healthcare',
      stack: 'Parent–child + metadata filtering + hybrid search',
    },
    {
      scenario: 'Legal system',
      stack: 'Structure chunking + hybrid search + reranking',
    },
    {
      scenario: 'Code assistant',
      stack: 'Code chunking + code embeddings + hybrid search',
    },
    {
      scenario: 'Enterprise search',
      stack: 'Metadata filtering + hybrid search + reranking',
    },
    {
      scenario: 'AI agent',
      stack: 'Agentic RAG + hybrid search + reranking',
    },
    {
      scenario: 'Research assistant',
      stack: 'Semantic chunking + agentic RAG',
    },
    {
      scenario: 'Multimodal search',
      stack: 'Multimodal embeddings + multimodal RAG',
    },
  ],
};

export const THANK_YOU_STEP = {
  type: 'thanks',
  id: 'thank-you',
  title: 'Thank You',
  description: '',
};

export const TITLE_STEP = {
  type: 'title',
  id: 'title',
  title: 'Welcome',
  description: '',
  workshopName: WORKSHOP_NAME,
};
