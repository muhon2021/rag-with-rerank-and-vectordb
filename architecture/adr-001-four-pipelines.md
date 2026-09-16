# ADR-001: Four independent RAG pipelines

## Status

Accepted

## Context

The product is a learning lab. Students need to see how retrieval quality changes as techniques are added (chunking, hybrid search, reranking). A single shared pipeline would hide those differences.

## Decision

Implement four separate pipelines under `backend/src/rag/`:

- `basic`
- `chunked`
- `hybrid`
- `rerank`

Each maps to its own Pinecone namespace with the same name. The chat API selects a pipeline by stage id from the frontend.

## Consequences

- Some duplicated glue code across stages (acceptable for teaching)
- Ingest must write into all namespaces (or the ones that apply)
- SCCR / feature work should usually touch one stage unless the task is cross-cutting
