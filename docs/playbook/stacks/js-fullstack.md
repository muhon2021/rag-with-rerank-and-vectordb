---
title: "Stack Pack: JavaScript Full Stack"
owner: Rajon
status: draft
last_reviewed: 2026-08-10
applies_to: js-fullstack
version: 0.1
---

## 1. Environment and scaffold

SJI **MERN stack** work: Node + API (Express) + React (often Next.js). Classic
data layer is MongoDB; other stores still use this pack for the JS half.

**In this repo:** `frontend/` is React 18 + Vite in plain JS (no Next.js, no
TypeScript, no database). Next.js and MongoDB rules below do not apply. Backend
rules live in [`node-api.md`](node-api.md).

**MUST** pin Node LTS (record major in README) and commit the lockfile.
**SHOULD** keep `web` and `api` separate (or Next with a clear server boundary).
**MUST NOT** commit `.env` or secrets.

## 2. Conventions

1. **MUST** use TypeScript for new app code unless the repo is already plain JS.
2. **MUST** run ESLint + Prettier (or repo equivalent) on changed files.
3. Next.js: **MUST NOT** mix Pages Router APIs into an App Router codebase.
4. **MUST** expose client env only via `NEXT_PUBLIC_*` / `VITE_*`.
5. **SHOULD** validate API bodies at the boundary (Zod/Joi or equivalent).

## 3. AI failure modes

Treat as merge blockers:

- **Router confusion.** App Router and Pages Router patterns in one feature.
- **Outdated data fetch.** `useEffect` + client `fetch` where a Server Component
  should load; unnecessary `'use client'`.
- **Nonexistent UI APIs.** Props not in the installed library — check the lockfile.
- **JWT in `localStorage`.** Prefer httpOnly cookies (or project auth doc).
- **NoSQL / body injection.** Raw `req.body` into Mongo; `$ne` operators —
  validate and coerce first.
- **CORS `*` + credentials.** Explicit origin allowlist in production.
- **Secrets in the client bundle.** DB URIs, service roles, private API keys.

## 4. Test and verify

1. **MUST** pass ESLint (and typecheck if TS) on changed code before merge.
2. **SHOULD** unit-test domain/API logic (Vitest or Jest).
3. **MAY** add Playwright for critical flows.
4. Default suite command: `npm test` (or project script in README/CI).

## 5. Deploy and monitor

1. **MUST** inject secrets from host/CI — not committed env files.
2. **MUST** set `NODE_ENV=production` on live Node.
3. **SHOULD** run data migrations/indexes as an explicit release step when needed.
4. **SHOULD** enable error logging (Sentry, host APM, or equivalent); record the
   tool in the project README.

## 6. Resources

| Link | Why | Checked |
|---|---|---|
| https://nextjs.org/docs/app | App Router / RSC | 2026-08-10 |
| https://react.dev/reference/rsc/server-components | Server vs Client Components | 2026-08-10 |
| https://expressjs.com/en/advanced/best-practice-security.html | Express security | 2026-08-10 |
| https://www.mongodb.com/docs/manual/security/ | MongoDB security | 2026-08-10 |
| https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html | Node OWASP | 2026-08-10 |

## 7. Owner and review

Owner: Rajon (DevSquad). Canonical copy lives in the SJI base repo playbook.
