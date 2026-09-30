# Playbook — RAG Learning Lab

Subset of the SJI AI Development Playbook that applies to this repo. The canonical,
full playbook lives in the SJI base repo; only pages relevant to this project are
kept here.

**Project:** React + Vite frontend, Node + Express backend, Pinecone vectors,
OpenAI embeddings/LLM. Local workshop demo, no auth, no SQL database. See
[`../../README.md`](../../README.md) and [`../../architecture/overview.md`](../../architecture/overview.md).

## Read in this order

| # | Page | Why |
|---|---|---|
| 1 | [`core/00-principles.md`](core/00-principles.md) | Binding rules for AI-assisted work: accountability, data handling, licensing |
| 2 | [`core/07-merge-gates.md`](core/07-merge-gates.md) | What every PR must meet; which skills to run for which change; AI failure mode checklist |
| 3 | [`stacks/node-api.md`](stacks/node-api.md) | Backend (`backend/`) conventions and failure modes |
| 4 | [`stacks/js-fullstack.md`](stacks/js-fullstack.md) | Frontend (`frontend/`) conventions and failure modes |

Then run the skills in [`../skills/`](../skills/README.md) that the change needs.

## Precedence

1. The task spec from the requester
2. [`../../.cursor/rules/project.md`](../../.cursor/rules/project.md) — repo-specific rules (four independent stages, file locations)
3. `core/00-principles.md`, then `core/07-merge-gates.md`
4. Stack packs — repo notes at the top of each pack override the generic rules below them

Stack packs never override core pages. Where a generic rule conflicts with an
existing repo convention (e.g. plain JS, `export default` components, no auth),
follow the repo convention.
