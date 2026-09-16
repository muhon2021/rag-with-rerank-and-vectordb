# RAG Learning Lab — project rules

## Stack

- Frontend: React + Vite (JS, not TypeScript unless a task requires it)
- Backend: Node.js ESM + Express
- Pinecone for vectors; OpenAI for embeddings and chat
- No user login in the current product

## Conventions

- Keep the **four RAG stages independent** (`basic`, `chunked`, `hybrid`, `rerank`) unless the task says otherwise
- Prefer small, focused diffs; match existing file style
- Put API routes under `backend/src/routes/` and shared logic under `backend/src/services/` or `backend/src/rag/`
- Frontend talks to the API via `frontend/src/api/client.js`
- Never commit secrets; use `.env` from `.env.example`

## Testing mindset

- After API changes, verify `/api/health` and a sample `/api/chat` call for the affected stage
- After ingest changes, document that `npm run ingest` must be re-run

## SCCR / PR safety

- Never commit directly to the project default branch from automation
- Prefer task-scoped files only; avoid drive-by refactors
