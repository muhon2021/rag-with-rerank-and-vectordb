# SOPs — RAG Learning Lab

## Local setup

1. Copy `.env.example` → `.env` and fill OpenAI + Pinecone keys
2. `npm run install:all`
3. `npm run ingest`
4. `npm run dev`
5. Open `http://localhost:5173`

## After changing `data/*.md`

1. Run `npm run ingest` again
2. Smoke-test chat for each affected stage

## Before an SCCR / PR task

1. Confirm Spec Engine folders exist (`.cursor/`, `architecture/`, `docs/`)
2. Keep the task small and stage-scoped when possible
3. Do not commit `.env`

## Smoke checks

- `GET /api/health` returns OK
- Ask one question from `demo-questions.md` on two stages and compare
