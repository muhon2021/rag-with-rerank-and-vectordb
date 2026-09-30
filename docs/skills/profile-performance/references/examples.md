# Profile Performance — examples

Illustrative scenarios for this repo — not a list of real open issues.

## Sequential external calls

**Change:** a new route loops over stages and `await`s each pipeline in turn.

| Severity | Finding | Fix |
|----------|---------|-----|
| Blocker | 4× LLM latency stacked on one request | `Promise.all` over independent stages (as `/compare-all` in `routes/chat.js` already does) |

Evidence: request time ≈ sum of per-stage times instead of the slowest stage.

## Duplicate embedding per request

**Change:** `compare-all` runs four stages; each embeds the same query via `rag/shared.js`.

| Severity | Finding | Fix |
|----------|---------|-----|
| Should fix / Nice | Up to 4 identical OpenAI embedding calls | Only if stages must stay independent (ADR-001): accept, or pass a precomputed vector as an optional arg without merging pipelines |

Weigh against ADR-001 — teaching clarity beats a few ms on a local demo.

## Oversized context to the LLM

**Change:** `topK` raised from 5 to 30 "for better recall" and all chunks sent to the model.

| Severity | Finding | Fix |
|----------|---------|-----|
| Should fix | Prompt tokens ×6 → higher latency and cost | Retrieve wide, rerank, send only the top N |

## False optimization

**Candidate:** wrap every callback in `useCallback` with no child memoization.

| Severity | Finding | Fix |
|----------|---------|-----|
| Nice / reject | No proven benefit | Leave plain functions; optimize only measured hotspots |

## Pre-merge report sample

```markdown
## Performance profile
- Scope: hybrid stage keyword scoring change
- Method: measured (`console.time` around retrieve, 10 runs, dev build)
- Hotspots checked: server | external calls

### Findings
- **Should fix** — `services/keywordIndex.js` — re-tokenizes the whole corpus per query — measured ~120ms — build tokens once at load
- **Nice** — `rag/hybrid/pipeline.js` — merges result arrays twice — optional

### Changes made
- Cached tokenized corpus at startup

### Merge
- approve
```
