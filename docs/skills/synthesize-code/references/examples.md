# Synthesize Code — examples

## Overbuilt hook

**Goal:** list items for a page.

**Candidate:** `useItems` with cache layer, analytics, retries, and three unused helpers.

| Decision | Unit | Why |
|----------|------|-----|
| KEEP | fetch + loading + error | Required for the UI |
| REJECT | analytics | `scope` / not requested |
| REJECT | unused helpers | `speculative` |
| CLEAN | retries | Keep one simple retry or drop if unused |

## Read-only asked, CRUD generated

**Goal:** read-only document list.

| Decision | Unit | Why |
|----------|------|-----|
| KEEP | list fetch, list component | Meets goal |
| REJECT | create/update/delete APIs and forms | `scope` |
| CLEAN | `Example*` names → domain slug | `quality` |

## merge-drafts

**Draft A:** correct API, messy names. **Draft B:** pretty UI, wrong endpoint.

- Primary: Draft A  
- KEEP: Draft A’s API wiring  
- REJECT: Draft B’s endpoint  
- CLEAN: rename Draft A symbols; optionally take Draft B’s layout **only** if it does not change behavior  

## Unsafe client config

**Candidate:** frontend hook calls OpenAI directly with `VITE_OPENAI_API_KEY`.

| Decision | Unit | Why |
|----------|------|-----|
| REJECT | API key in frontend bundle | `unsafe` (hard reject) |
| CLEAN / KEEP | call the backend via `frontend/src/api/client.js`; key stays in `backend/src/config.js` | Correct pattern |

## Shared pipeline refactor

**Goal:** fix a chunk-overlap bug in the `chunked` stage.

**Candidate:** fix plus a new `ragPipeline()` that all four stages now call.

| Decision | Unit | Why |
|----------|------|-----|
| KEEP | overlap fix in `backend/src/rag/chunked/` | Meets goal |
| REJECT | shared `ragPipeline()` across stages | `scope` — stages stay independent (ADR-001) |
