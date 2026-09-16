# Database / storage

This project does **not** use Postgres or SQL.

## Stores

| Store | Role |
|-------|------|
| Pinecone index | Vector embeddings per stage namespace (`basic`, `chunked`, `hybrid`, `rerank`) |
| Local files `data/*.md` | Source corpus for ingest |
| Optional keyword cache | Hybrid stage keyword index (created/updated during ingest) |

## Index expectations

- Embedding model: `text-embedding-3-small` (1536 dims) unless `.env` overrides
- Metric: cosine
- Index name: from `PINECONE_INDEX_NAME` (default `rag-learning-lab`)

## Change guidance

- Schema-like changes = namespace names, embedding dimensions, or corpus layout
- Always re-run `npm run ingest` after corpus or chunking changes
- Document env var changes in `.env.example` and `docs/api/`
