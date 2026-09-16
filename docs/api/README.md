# API

Base URL (local): `http://localhost:3001`

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api` | Service name/version |
| GET | `/api/health` | Health / dependency checks |
| POST | `/api/chat` | Run a RAG stage and return an answer (+ debug when requested) |
| POST | `/api/ingest` | Trigger or support document ingest into Pinecone |

## Chat (typical)

Request body (conceptual):

```json
{
  "message": "user question",
  "stage": "basic | chunked | hybrid | rerank"
}
```

Response includes the model answer and may include retrieval debug fields for the workshop UI.

## Conventions

- JSON request/response
- CORS allows the Vite frontend (`FRONTEND_URL`, default `http://localhost:5173`)
- Long-running chat calls may use an extended timeout on `/api`

## Env used by API

See root `.env.example`: `OPENAI_API_KEY`, `PINECONE_API_KEY`, `PINECONE_INDEX_NAME`, `MODEL`, `EMBEDDING_MODEL`, `PORT`, `FRONTEND_URL`.
