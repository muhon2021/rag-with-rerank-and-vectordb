# API

Base URL (local): `http://localhost:3001`

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api` | Service name/version |
| GET | `/api/health` | Health / dependency checks |
| POST | `/api/chat` | Run a RAG stage and return an answer (+ debug when requested) |
| POST | `/api/ingest` | Trigger or support document ingest into Pinecone |

### /api/health

The health endpoint performs lightweight dependency checks (Pinecone connectivity, namespace stats and any keyword index status). A new boolean field is included in the response:

- `is_ingest_ready` (boolean): true when the Pinecone index is reachable and contains indexed vectors for at least one workshop namespace (`basic`, `chunked`, `hybrid`, `rerank`). When false, the system should be considered not ready to serve chat queries (either because Pinecone is unreachable, the index is missing, or no vectors have been indexed).

Example response (conceptual):

```json
{
  "status": "ready",
  "pinecone": true,
  "namespaces": { "basic": 120, "chunked": 240, "hybrid": 180, "rerank": 180 },
  "keywordIndex": "ready",
  "is_ingest_ready": true,
  "message": "System ready"
}
```

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
