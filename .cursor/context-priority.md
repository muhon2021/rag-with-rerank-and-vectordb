# Context priority — RAG Learning Lab

When generating or reviewing code, prefer sources in this order.

## 1. Highest priority

1. Task Spec / Context / Planning from SCCR (when provided)
2. `.cursor/rules/` — coding conventions
3. `architecture/` — system design and ADRs
4. `docs/features/` and `docs/api/` — behavior and endpoints
5. Existing code next to the change (same folder / pipeline)

## 2. Core code paths

| Area | Paths |
|------|--------|
| API entry | `backend/src/index.js`, `backend/src/routes/` |
| Config | `backend/src/config.js`, root `.env.example` |
| RAG stages | `backend/src/rag/basic/`, `chunked/`, `hybrid/`, `rerank/` |
| Services | `backend/src/services/` (embeddings, Pinecone, LLM, chunking) |
| Ingest | `backend/scripts/ingest.js` |
| UI | `frontend/src/App.jsx`, `frontend/src/components/`, `frontend/src/hooks/` |
| Demo data | `data/*.md` |

## 3. Lower priority

- Workshop slides / marketing copy in `WORKSHOP.md` unless the task is workshop UX
- Lockfiles (`package-lock.json`) — do not edit by hand

## 4. Do not invent

- Do not add auth/login unless the task asks for it
- Do not merge the four RAG pipelines into one shared pipeline unless explicitly requested
- Do not change Pinecone namespace names without updating ingest + docs
