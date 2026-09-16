# Architecture overview — RAG Learning Lab

## Purpose

Workshop / demo app that runs **four independent RAG pipelines** side-by-side so learners can compare retrieval quality:

1. **Basic** — simple retrieval
2. **Chunked** — improved chunking
3. **Hybrid** — vector + keyword
4. **Rerank** — retrieval + reranking

## High-level diagram

```text
Browser (Vite React)
    │  HTTP
    ▼
Express API (:3001)
    ├── /api/health
    ├── /api/chat     → stage-specific RAG pipeline → OpenAI
    └── /api/ingest   → load /data/*.md → embed → Pinecone
            │
            ▼
     Pinecone index (4 namespaces)
```

## Components

| Component | Location | Responsibility |
|-----------|----------|----------------|
| Frontend UI | `frontend/` | Chat, stage selector, workshop flow, compare view |
| API server | `backend/src/index.js` | HTTP, CORS, routes |
| Chat | `backend/src/routes/chat.js` | Stage routing into RAG pipelines |
| Ingest | `backend/scripts/ingest.js` + ingest route | Index markdown policies into Pinecone |
| Pipelines | `backend/src/rag/{basic,chunked,hybrid,rerank}/` | Stage implementations |
| Embeddings / LLM | `backend/src/services/` | OpenAI + Pinecone helpers |
| Corpus | `data/` | Policy markdown used for retrieval demos |

## Design principles

- Stages stay **independent** for teaching clarity
- Shared helpers live in `backend/src/rag/shared.js` and `backend/src/services/`
- UI has no auth; suitable for local workshop demos

## Related ADRs

- [ADR-001: Four independent RAG pipelines](./adr-001-four-pipelines.md)
