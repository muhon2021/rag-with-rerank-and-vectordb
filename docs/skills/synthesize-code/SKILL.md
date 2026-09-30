---
name: synthesize-code
description: >-
  Synthesizes AI-generated or proposed code like a human manager: classify each
  change as KEEP, REJECT, or CLEAN, then ship only accepted code. Use when
  generating with AI, filtering overbuilt diffs, merging multiple drafts, or when
  the user asks to keep, reject, clean up, or synthesize generated work.
version: 0.1.0
owner: Avengers
last_reviewed: 2026-08-12
---

# Synthesize Code

Act as the human manager—generate code using AI, then decide what to keep, what to reject, and what to clean up to meet quality standards.

Authority: the user owns **product scope**; this skill owns **quality and surplus**. Never expand scope. Never ship REJECT. Never leave CLEAN unfinished.

## Modes

Pick one from the request (default: **synthesize** if code/diff already exists, else **generate**):

| Mode | Input | Behavior |
|------|--------|----------|
| **generate** | Goal only | Produce minimal candidate, then run the manager pass |
| **synthesize** | Diff, PR, files, or pasted drafts | Classify existing candidates; do not add features |
| **merge-drafts** | 2+ alternatives | Choose one primary; KEEP only pieces that improve it |

## Out of scope

- Pure audit with no keep/reject/clean outcome → [`review-code`](../review-code/SKILL.md)
- Changing product requirements without user confirmation

## Progress checklist

```
Synthesize Code:
- [ ] Mode + goal + constraints locked
- [ ] Candidates gathered (no scope creep)
- [ ] Every unit classified (REJECT first)
- [ ] CLEANs applied until they are KEEP
- [ ] REJECTs removed; decision log written
- [ ] Deliverable = accepted code only
```

## Workflow

### 1. Lock goal and constraints

- One-sentence goal (acceptance criteria).
- Project size: this repo is **small** (flat `backend/src/` and `frontend/src/`; no `modules/`).
- Hard constraints: files allowed to change, APIs, env, “do not touch X”.
- If goal is ambiguous and blocks classification, ask **one** clarifying question; otherwise proceed with the narrowest reading.

**Load project docs.** Before gathering or classifying code, read what applies to
the surfaces in scope:

| Doc | Path | Use when |
|---|---|---|
| Project rules | `.cursor/rules/project.md` | Always |
| Architecture | `architecture/overview.md`, `architecture/adr-*.md` | Pipeline boundaries, tech choices |
| API | `docs/api/README.md` | Routes, payloads |
| Storage | `docs/database/README.md` | Pinecone namespaces, ingest |
| Features | `docs/features/README.md` | UI flows, which files own a feature |

Implementation **MUST** match these docs. If the change requires a doc update,
note it in the decision log and update the doc in the same PR — do not silently
diverge. Where docs are silent, follow existing code patterns only.

Also read the stack packs: [`node-api.md`](../../playbook/stacks/node-api.md)
(backend) and [`js-fullstack.md`](../../playbook/stacks/js-fullstack.md) (frontend).

### 2. Gather candidates

- Inventory units to classify: new/changed **files**, **exports**, **deps**, and **behavior blocks** (not every line).
- Reuse existing project patterns; read nearby code before inventing structure.
- Backend: routes in `backend/src/routes/`, logic in `backend/src/services/` or `backend/src/rag/`. Frontend: API calls only via `frontend/src/api/client.js`.

### 3. Classify (manager pass)

Read [references/quality-bar.md](references/quality-bar.md) before classifying.

**Order (required):** for each unit, test **REJECT** → else **CLEAN** → else **KEEP**. Exactly one label.

| Label | Criteria |
|-------|----------|
| **REJECT** | Out of scope, unsafe, duplicate, speculative, or fails a hard reject |
| **CLEAN** | In scope and needed, but wrong shape (naming, width, structure, env placement, noise) |
| **KEEP** | In scope, correct, minimal, passes the quality bar as-is |

Bias: when unsure between KEEP and REJECT on non-essential work → **REJECT**. When unsure between CLEAN and REJECT on essential work → **CLEAN**.

### 4. Apply

- Remove REJECT (delete code or never add it).
- Rewrite CLEAN until it would be KEEP; re-check hard rejects.
- No dead code, commented-out experiments, or TODO-features.

### 5. Deliver

Always output:

1. **Mode** + one-line outcome  
2. **Decision log** (template below)  
3. **Accepted code** applied to the repo — or, if the user asked review-only, a patch summary with no unrequested edits  

## Decision log template

```markdown
## Synthesis

- Mode: generate | synthesize | merge-drafts
- Goal: …
- Outcome: …

## Decisions

### REJECT
- `path` or symbol — reason (scope | unsafe | duplicate | speculative | quality)

### CLEAN
- `path` or symbol — before → after (why)

### KEEP
- `path` or symbol — why required for the goal
```

Omit empty sections. Prefer symbols (`useX`, `createY`) when the file is large.

## Hard rejects (never KEEP)

- Secrets, tokens, private URLs, or API keys (OpenAI, Pinecone, Cohere) in frontend code
- Merging the four RAG stages (`basic`, `chunked`, `hybrid`, `rerank`) into one shared pipeline without an explicit request
- Renaming Pinecone namespaces without updating ingest and docs
- New `process.env` reads outside `backend/src/config.js`
- New dependencies not required to meet the stated goal

## Stop when

- Every inventoried unit is KEEP (after cleans) or REJECT (removed)
- Goal’s acceptance criteria are met with no extra surface
- Decision log matches what remains in the tree
- When contracts were loaded, accepted code aligns with them or logs deviation

## 7. Exit gate

Reviewer verifies against the change and decision log with no author interview.

- [ ] Decision log exists with mode, goal, and outcome
- [ ] Every inventoried unit is KEEP or REJECT (no open CLEAN)
- [ ] No REJECT code remains in the tree
- [ ] Hard rejects absent (secrets, merged stages, unjustified deps)
- [ ] When the diff touches an API route or storage, implementation matches
      `docs/api/README.md` / `docs/database/README.md` or the doc is updated

## Related skills

- Tests after build: [`author-tests`](../author-tests/SKILL.md)
- Final review: [`review-code`](../review-code/SKILL.md)
- Security gate: [`enforce-security`](../enforce-security/SKILL.md)

## 8. References

| File | When |
|---|---|
| [`references/quality-bar.md`](references/quality-bar.md) | Before classify pass |
| [`references/examples.md`](references/examples.md) | KEEP / REJECT / CLEAN examples |

## 9. Resources

| Link | Why | Checked |
|---|---|---|
| [`playbook/core/00-principles.md`](../../playbook/core/00-principles.md) | AI accountability | 2026-08-12 |
| [`playbook/core/07-merge-gates.md`](../../playbook/core/07-merge-gates.md) | AI failure mode checklist | 2026-08-12 |

## 10. Ownership

Owner: Avengers. Canonical copy lives in the SJI base repo. Siblings: `author-tests`, `profile-performance`.
