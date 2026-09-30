# Quality bar — Synthesize Code

Read before KEEP / REJECT / CLEAN. This repo follows the **small** and **this repo** rules below.

## Decision order

For each unit:

1. **Hard reject?** → REJECT  
2. **Not required for the stated goal?** → REJECT  
3. **Required but wrong shape?** → CLEAN  
4. Else → KEEP  

## Universal pass / fail

| Pass | Fail |
|------|------|
| Meets the locked goal | Speculative / “for later” behavior |
| Smallest surface that works | Unused exports, helpers, or files |
| Names match nearby code | Generic `Helper` / `Manager` / `Utils` dumps |
| Errors handled or propagated | Empty `catch`, swallowed failures |
| No secrets in source | Tokens, keys, private URLs |
| Fits existing stack | Unneeded new libraries |
| Types honest | Blanket `any` / lies in types |

## Small projects

- Flat `src/` or `app/`; do not invent `modules/` unless asked.
- Prefer direct logic over new abstractions.
- Env reads in one config module only.

## This repo (RAG Learning Lab)

| Area | Pass |
|-------|------|
| Stages | `backend/src/rag/{basic,chunked,hybrid,rerank}/` stay independent; shared helpers only in `rag/shared.js` or `services/` |
| Config | New env reads go through `backend/src/config.js`; new vars added to `.env.example` |
| Routes | HTTP in `backend/src/routes/`; logic in `services/` or `rag/` |
| Frontend | Plain JS + React; API calls via `frontend/src/api/client.js`; match existing `export default` component style |
| Storage | Pinecone namespaces fixed; ingest changes documented (re-run `npm run ingest`) |
| Docs | API / storage / feature changes ⇒ update `docs/api/`, `docs/database/`, `docs/features/`, `docs/changelog.md` |

## Reason tags (use in decision log)

| Tag | Use when |
|-----|----------|
| `scope` | Not asked for / beyond acceptance criteria |
| `unsafe` | Security, secrets, prompt injection |
| `duplicate` | Already exists in project |
| `speculative` | Future-proofing without a caller |
| `quality` | Shape/noise issues (usually CLEAN, else REJECT if optional) |

## Prefer REJECT

- Extra UI, flags, or config the user did not request  
- Second way to do the same thing  
- Narrative comments that restate code  
- Tests that assert nothing  
- “Just in case” dependencies  

## Prefer CLEAN

- Right behavior, wrong name or file placement  
- Over-wide API or props → narrow to what’s used  
- Env reads inline → move to config  
- Copy-paste inside one module → one local helper  
- Oversized function that mixes UI + IO → split along existing project lines  

## Prefer KEEP

- Minimal path that hits acceptance criteria  
- Matches neighboring patterns (imports, error style, test style)  
- Boring, explicit error handling  
- Tests that lock the changed behavior  
