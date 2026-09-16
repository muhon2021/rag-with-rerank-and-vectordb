# Features

## Workshop chat by RAG stage

Users pick a stage (Basic → Chunked → Hybrid → Rerank) and ask questions against the policy corpus.

**Primary paths**

- UI: `frontend/src/components/ChatPanel.jsx`, `StageSelector.jsx`
- API: `backend/src/routes/chat.js`
- Pipelines: `backend/src/rag/*/pipeline.js`

## Compare-all view

Shows answers from multiple stages for the same question to highlight quality differences.

## Workshop flow / slides

Guided workshop UX and slides for live teaching (`WorkshopFlow`, slide components, `WORKSHOP.md`).

## Document ingest

Loads markdown from `data/`, chunks/embeds, and upserts into Pinecone namespaces.

**Command:** `npm run ingest`

## Demo corpus

Policy documents used for retrieval demos:

- `data/leave-policy.md`
- `data/employee-handbook.md`
- `data/security-policy.md`
- `data/aws-access-policy.md`
- `data/engineering-guidelines.md`

Curated questions: `demo-questions.md`.
