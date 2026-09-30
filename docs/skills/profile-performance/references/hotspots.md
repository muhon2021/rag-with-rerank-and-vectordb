# Performance hotspots

Use while inventorying a change. Fix only what the scoped path needs.

## Client (React)

| Check | Prefer |
|-------|--------|
| Heavy work in render | Move to event handler, worker, or memo **only if** profiling shows cost |
| List of hundreds+ rows | Pagination or virtualization when UX requires it |
| Derived data recalculated always | Compute once per input change; don’t add `useMemo` by default |
| Effect refetch loops | Stable deps; don’t recreate objects/functions that trigger fetch |
| Multiple sequential awaits for independent data | `Promise.all` when safe |

## RAG / external calls (this repo's main cost)

| Check | Prefer |
|-------|--------|
| Query embedded more than once per request | Embed once; pass the vector to each consumer |
| `compare-all` running the four stages sequentially | `Promise.all` over stages (they are independent) |
| Pinecone `topK` larger than what is sent to the LLM or reranker | Fetch only what the next step uses |
| Embedding texts one at a time during ingest | Batch (`embedTexts` already batches by 100) |
| Keyword index rebuilt per request in hybrid | Load from `backend/.cache/` once at startup |
| Large retrieved context sent to the LLM | Cap chunk count / length; tokens are latency and cost |
| Cohere rerank on every stage | Only the `rerank` stage |
| Re-fetching `/api/health` on every render or keystroke | Poll on an interval or fetch on mount |

## Server (Node module / API)

| Check | Prefer |
|-------|--------|
| Sync CPU (crypto, big JSON parse) on hot request | Async boundaries; avoid blocking the event loop for large work |
| Repeated identical reads in one request | Read once; pass through |
| Unbounded `while` / full table scans | Cap, filter, index-friendly filters |
| Chatty multi-round trips | Batch or single round trip |

## Payloads & logging

| Check | Prefer |
|-------|--------|
| Returning blobs/base64 in list views | Metadata list + detail fetch |
| `console.log` of full responses in hot paths | Remove or sample; never log secrets |
| Huge component trees for simple views | Flatten; avoid unnecessary wrappers |

## Measurement tips

```js
const t0 = performance.now();
// …work…
const ms = performance.now() - t0;
```

- Browser: React Profiler + Network waterfalls  
- Node: time public module methods in a focused script/test with mocks for IO when measuring CPU only; for IO, measure real query shape/count instead of fake ms  
- Always state environment (dev vs prod build) when quoting numbers  

## Anti-patterns (do not “optimize” into these)

- New caching layer for a one-off read  
- `useMemo`/`useCallback` everywhere “just in case”  
- Premature workers/WASM for simple string work  
- Breaking readability for &lt;1% estimated gain with no evidence  
