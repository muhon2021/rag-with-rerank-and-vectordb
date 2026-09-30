# Skills — RAG Learning Lab

Agent skills from the SJI base repo, adapted to this project. Each skill is a
self-contained procedure: open its `SKILL.md`, follow the workflow, and meet its
§ 7 exit gate. Load files under `references/` only when the step says to.

When to run which: [`../playbook/core/07-merge-gates.md`](../playbook/core/07-merge-gates.md) § 3.1.

## Skills

| Skill | Use when | Output |
|---|---|---|
| [`synthesize-code`](synthesize-code/SKILL.md) | Generating or filtering AI-written code | Decision log (KEEP / REJECT / CLEAN) + accepted code |
| [`author-tests`](author-tests/SKILL.md) | A change alters behavior or data paths | Tests with real assertions; externals mocked |
| [`profile-performance`](profile-performance/SKILL.md) | Change touches chat pipelines, `compare-all`, ingest, or large lists | Performance report + merge recommendation |
| [`enforce-security`](enforce-security/SKILL.md) | Any app-code change before merge | `VERDICT` + findings + "Checked and clear" |
| [`review-code`](review-code/SKILL.md) | Final check before merge | Verdict + findings with `path:line` |

## Typical order for a feature or fix

1. `synthesize-code` — implement, keep only what the goal needs
2. `author-tests` — cover new behavior and one regression
3. `profile-performance` — only if a hot path changed
4. `enforce-security` — scoped to the diff
5. `review-code` — final verdict

Skills can run on their own; the order is a default, not a gate.

## Repo facts every skill assumes

- Four RAG stages (`basic`, `chunked`, `hybrid`, `rerank`) stay independent — [ADR-001](../../architecture/adr-001-four-pipelines.md)
- New env reads go through `backend/src/config.js`; frontend calls the API only via `frontend/src/api/client.js`
- No test runner yet — see [`author-tests/references/test-patterns.md`](author-tests/references/test-patterns.md) § Runner
- No auth by design; no SQL database (Pinecone only)
- `enforce-security/scripts/scan.sh` is bash — run from Git Bash or WSL on Windows
- After changing `data/*.md` or ingest code, `npm run ingest` must be re-run
