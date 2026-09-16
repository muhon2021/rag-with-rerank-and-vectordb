# Cursor / Spec Engine context

This folder tells AI coding tools (and DCT Spec Engine / SCCR) how to work in the **RAG Learning Lab** repository.

## Contents

| Path | Purpose |
|------|---------|
| `context-priority.md` | Which files matter most when generating or reviewing code |
| `rules/` | Project conventions AI must follow |

## Project snapshot

- **Frontend:** React + Vite (`frontend/`)
- **Backend:** Node.js + Express (`backend/`)
- **Vector DB:** Pinecone (namespaces: `basic`, `chunked`, `hybrid`, `rerank`)
- **LLM / embeddings:** OpenAI

Keep docs under `.cursor/`, `architecture/`, and `docs/` up to date when you change structure or APIs.
