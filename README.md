# RAG Learning Lab

A workshop demo app that runs **four independent RAG pipelines** side-by-side to teach RAG evolution: Basic → Better Chunking → Hybrid Search → Reranked.

- **Frontend:** React + Vite (dark UI, no login)
- **Backend:** Node.js + Express
- **Vector DB:** Pinecone (single index, 4 namespaces)
- **Embeddings & LLM:** OpenAI

## Prerequisites

- Node.js 20+
- [OpenAI API key](https://platform.openai.com/api-keys)
- [Pinecone API key](https://app.pinecone.io/)

## Configuration

1. Copy the example env file:

```bash
cp .env.example .env
```

2. Edit `.env` in the **project root**:

```env
OPENAI_API_KEY=sk-...
PINECONE_API_KEY=pcsk_...
PINECONE_INDEX_NAME=rag-learning-lab
MODEL=gpt-4o-mini
EMBEDDING_MODEL=text-embedding-3-small
PORT=3001
FRONTEND_URL=http://localhost:5173
```

Optional: `COHERE_API_KEY` for Cohere reranking in Stage 4.

### Pinecone setup

- The ingest script **creates a serverless index** automatically if it does not exist (AWS `us-east-1`, cosine, 1536 dimensions).
- Or create an index manually in the Pinecone console with **dimension 1536** and **cosine** metric, then set `PINECONE_INDEX_NAME` to match.

Namespaces used: `basic`, `chunked`, `hybrid`, `rerank`.

## Install & run

```bash
# From project root
npm install
npm run install:all

# Index documents (required once, or after editing /data)
npm run ingest

# Start backend + frontend
npm run dev
```

Or in two terminals:

```bash
cd backend && npm install && npm run ingest && npm run dev
cd frontend && npm install && npm run dev
```

- **UI:** http://localhost:5173  
- **API:** http://localhost:3001  

## Workshop “aha” questions

Your current query quality will often look similar across stages if the answer lives in one highly-matching section. To get a strong contrast, use the curated questions in [`demo-questions.md`](demo-questions.md).

Recommended Set A (best for live compare-all):

- Which policy mandates MFA for VPN/email/admin consoles, and what are the password rules it defines (min length and rotation period)?
- How do I request AWS access? Include the Jira template name, manager approval timeline, and when access is provisioned.
- Can contractors access production systems? If yes, list every exception condition; if not, what is the default outcome?
- In `POLICY-SEC-2025`, what are the password lockout rules after failed attempts, and how does that policy relate to the MFA requirement for initial AWS console login?

Optional Set B (use if you want an “anti-hallucination” moment):

- What is `POLICY-SEC-2024`?
- If I suspect a security incident, where do I report it, and how fast do I need to report?

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Backend + index status |
| POST | `/api/chat/basic` | Stage 1 |
| POST | `/api/chat/chunked` | Stage 2 |
| POST | `/api/chat/hybrid` | Stage 3 |
| POST | `/api/chat/rerank` | Stage 4 |
| POST | `/api/chat/compare-all` | All 4 stages in one request |

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Startup fails on env | Fill `OPENAI_API_KEY`, `PINECONE_API_KEY`, `PINECONE_INDEX_NAME` in `.env` |
| Index empty in UI | Run `npm run ingest` from project root |
| Hybrid search weak after ingest | Restart backend so keyword cache loads from `backend/.cache/` |
| OpenAI 429 | Wait and retry; check billing/limits |
| Pinecone dimension error | Index must be 1536 dimensions for `text-embedding-3-small` |

## Project structure

```
data/           # Sample company KB (markdown)
backend/        # Express API + RAG pipelines
frontend/       # React UI
```

## License

MIT — demo/educational use only. Knowledge base content is fictional.
