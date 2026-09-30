---
title: "Stack Pack: Node API"
owner: Iraz
status: draft
last_reviewed: 2026-08-12
applies_to: node-api
version: 0.1
---

## 1. Environment and scaffold

SJI **Node backend services** (Express, Fastify, NestJS, or serverless handlers).
Record framework and Node major in the project README. **MUST** commit the
lockfile; **MUST NOT** commit `.env` or secrets.

**In this repo:** `backend/` is Express 4, Node ESM, plain JS. Config is read in
`backend/src/config.js`; routes in `backend/src/routes/`; logic in
`backend/src/services/` and `backend/src/rag/`. Storage is Pinecone (no SQL).
There is no auth by design (local workshop demo) — do not add it unless the
task asks. Endpoints are documented in [`../../api/README.md`](../../api/README.md).
Front-end half: [`js-fullstack.md`](js-fullstack.md).

## 2. Conventions

1. **MUST** use TypeScript for new services unless the repo is already plain JS.
2. **MUST** validate request bodies at the boundary (Zod, Joi, class-validator, or
   equivalent).
3. **MUST** centralize config — read `process.env` in one module, not inline in
   handlers.
4. **SHOULD** separate route handlers from business logic (service layer).
5. **MUST NOT** expose stack traces or internal paths in production error responses.

## 3. AI failure modes

Treat as merge blockers:

- **Express vs Fastify vs Nest mix.** Middleware and reply APIs copied from the
  wrong framework.
- **Async error holes.** Missing `try/catch` or framework error handlers; unhandled
  promise rejections in route handlers.
- **No auth on mutating routes.** POST/PUT/PATCH/DELETE without authentication or
  authorization checks.
- **CORS misconfiguration.** `origin: '*'` with credentials enabled.
- **JWT in query strings or logs.** Tokens in URLs or console output.
- **N+1 or unbounded queries.** List endpoints without pagination or limits.

## 4. Test and verify

1. **MUST** pass ESLint (and typecheck if TS) on changed code before merge.
2. **SHOULD** unit-test services and integration-test routes (Vitest, Jest, or
   Supertest).
3. **MAY** contract-test routes against the shapes in `docs/api/README.md`.
4. Default suite command: `npm test` — record variants in README and CI.

## 5. Deploy and monitor

1. **MUST** set `NODE_ENV=production` on live services.
2. **MUST** inject secrets from host/CI.
3. **SHOULD** run health-check endpoints and wire them to the load balancer.
4. **SHOULD** enable structured logging and error tracking; record the tool in
   the project README.

## 6. Resources

| Link | Why | Checked |
|---|---|---|
| https://expressjs.com/en/advanced/best-practice-security.html | Express security | 2026-08-12 |
| https://fastify.dev/docs/latest/Guides/Getting-Started/ | Fastify patterns | 2026-08-12 |
| https://docs.nestjs.com/security/authentication | Nest auth baseline | 2026-08-12 |
| https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html | Node OWASP | 2026-08-12 |

## 7. Owner and review

Owner: Iraz (Avengers). Canonical copy lives in the SJI base repo playbook.
Paired front end: also read [`js-fullstack.md`](js-fullstack.md).
