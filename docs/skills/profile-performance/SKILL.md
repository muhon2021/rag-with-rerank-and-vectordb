---
name: profile-performance
description: >-
  Profiles code for speed and efficiency before merge: find hotspots, measure
  or estimate cost, and recommend or apply fixes. Use when checking performance,
  investigating slowness, reviewing a PR for efficiency, or when the user asks
  to profile, benchmark, or optimize before merging.
version: 0.1.0
owner: Avengers
last_reviewed: 2026-08-12
---

# Profile Performance

Test the code for speed and efficiency before merging it into the main project.

## When to use

- Pre-merge check for a feature or PR that may be slow or chatty
- User reports lag, jank, large payloads, or repeated network/DB calls
- User asks to profile, benchmark, optimize, or efficiency-review

## Out of scope

- Correctness / regression tests → `author-tests`
- General code review → [`review-code`](../review-code/SKILL.md)
- Inventing a full APM stack or production monitoring product
- Premature micro-optimizations with no measured or reasoned hotspot

## Progress checklist

```
Profile Performance:
- [ ] Step 1: Scope the change and user-visible risk
- [ ] Step 2: Inventory likely hotspots (CPU, IO, render, queries)
- [ ] Step 3: Measure or bound cost (tooling or reasoned estimate)
- [ ] Step 4: Rank findings; fix or recommend only high-impact items
- [ ] Step 5: Re-check; report merge recommendation
```

## Workflow

### 1. Scope

- What changed (paths / APIs / screens)?
- What must stay fast (list load, submit, auth, scroll, API p95)?
- Constraints: no new deps unless required; match existing stack.

### 2. Inventory hotspots

Inspect the diff and call path for:

| Area | Red flags |
|------|-----------|
| **Client render** | Work in render body, missing keys, huge lists without virtualization when clearly needed, sync expensive compute on every render |
| **Data fetching** | Waterfalls, duplicate fetches, over-fetch (`select *`), no pagination on large lists, N+1 patterns |
| **Server** | Sync CPU on request path, unbounded loops, repeated OpenAI / Pinecone calls that could be one call or run in parallel |
| **Payloads** | Large JSON, base64 in lists, logging full bodies |
| **Effects** | `useEffect` storms, unstable deps causing refetch loops |

Heuristics: [references/hotspots.md](references/hotspots.md).

### 3. Measure or bound

Prefer evidence in this order:

1. **Existing tools** in the project (bench scripts, React Profiler, Chrome Performance, `console.time`, Node `--cpu-prof`) — use if available  
2. **Lightweight instrumentation** you add temporarily (`performance.now()`, timed tests) — remove or gate before merge unless the user wants it kept  
3. **Reasoned bound** when tooling isn't runnable: complexity, call counts, payload size, query shape  

Do not claim "X ms faster" without a measurement method. If only reasoned, label findings **estimated**.

### 4. Act

Severity:

| Level | Meaning | Before merge |
|-------|---------|--------------|
| **Blocker** | Likely user-visible stall, unbounded work, or accidental O(n²)/N+1 on hot path | Must fix or explicitly defer with user OK |
| **Should fix** | Clear waste (duplicate fetch, over-select) with cheap fix | Fix in the same change when safe |
| **Nice** | Micro-gain, readability tradeoff | Optional; don't expand scope |

Apply the smallest fix that removes the hotspot. Prefer algorithmic/query/render structure over new caching layers unless caching is clearly required.

### 5. Report

```markdown
## Performance profile

- Scope: …
- Method: measured | estimated
- Hotspots checked: client | server | queries | payloads

### Findings
- **Blocker/Should/Nice** — `path` — issue — evidence — fix

### Changes made
- …

### Merge
- approve | approve with follow-ups | request changes
```

## Stop when

- Hot path for the scoped change has no open **Blocker**
- Remaining items are documented as Nice/follow-up
- Temporary probes removed (unless user asked to keep them)

## 7. Exit gate

Reviewer verifies against the performance report with no author interview.

- [ ] Report states scope, method (`measured` or `estimated`), and merge recommendation
- [ ] Hotspots checked cover the areas the change touches (client, server, queries, payloads)
- [ ] No open **Blocker** without explicit user-approved deferral in the PR
- [ ] Temporary probes removed unless the user asked to keep them

## Related skills

- Correctness tests: [`author-tests`](../author-tests/SKILL.md)
- Cut speculative optimizations: [`synthesize-code`](../synthesize-code/SKILL.md)

## 8. References

| File | When |
|---|---|
| [`references/hotspots.md`](references/hotspots.md) | Inventory step |
| [`references/examples.md`](references/examples.md) | Worked profiles |

## 9. Resources

| Link | Why | Checked |
|---|---|---|
| [`playbook/core/07-merge-gates.md`](../../playbook/core/07-merge-gates.md) | When profiling is required | 2026-09-30 |
| [`architecture/overview.md`](../../../architecture/overview.md) | Request flow and pipelines | 2026-09-30 |

## 10. Ownership

Owner: Avengers. Canonical copy lives in the SJI base repo. Siblings: `synthesize-code`, `author-tests`.
