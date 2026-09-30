# Test patterns — Author Tests

Match the runner already in the project. Do not switch frameworks unless asked.

## Runner (this repo)

No test runner is installed yet. When the first test is needed:

1. Propose **Vitest** (the frontend already uses Vite; Vitest runs Node ESM without
   extra config). Confirm with the user before adding the dependency.
2. Add it to the package whose code is under test (`backend/` or `frontend/`) with
   a `"test": "vitest run"` script.
3. Colocate tests as `*.test.js` next to the file, or under `backend/tests/` —
   pick one and keep it consistent.

## Backend — pure logic (no mocks)

Test real functions directly. Best first targets: `services/chunkingService.js`,
`services/keywordIndex.js`, `rag/shared.js`, `utils/retry.js`.

```js
import { describe, test, expect } from 'vitest';
import { improvedChunker } from '../src/services/chunkingService.js';

describe('improvedChunker', () => {
  test('keeps chunks under chunkSize plus overlap', () => {
    const text = '# Policy\n\n' + 'word '.repeat(500);
    const chunks = improvedChunker(text, { chunkSize: 400, overlap: 80 });
    for (const c of chunks) expect(c.text.length).toBeLessThanOrEqual(400 + 80 + 1);
  });

  test('labels chunks with their section heading', () => {
    const chunks = improvedChunker('# MFA\n\nUse MFA.\n\n# VPN\n\nUse VPN.');
    expect(chunks.map((c) => c.heading)).toEqual(['MFA', 'VPN']);
  });
});
```

## Backend — services that call OpenAI / Pinecone / Cohere

Mock the SDK module, not the network. Set fake config values only.

```js
import { describe, test, expect, vi } from 'vitest';

vi.mock('openai', () => ({
  default: class {
    embeddings = {
      create: vi.fn(async ({ input }) => ({
        data: input.map((_, index) => ({ index, embedding: [0.1, 0.2] })),
      })),
    };
  },
}));

const { embedTexts } = await import('../src/services/embeddingService.js');

describe('embedTexts', () => {
  test('returns one embedding per input in order', async () => {
    const out = await embedTexts(['a', 'b']);
    expect(out).toHaveLength(2);
  });

  test('returns [] for empty input without calling OpenAI', async () => {
    expect(await embedTexts([])).toEqual([]);
  });
});
```

For Pinecone, mock `@pinecone-database/pinecone` the same way and return a fixed
`matches` array. Cohere (`services/reranker.js`) uses global `fetch` — stub it with
`vi.stubGlobal('fetch', vi.fn(...))` and assert the fallback path when it rejects.
Error paths: make the OpenAI mock throw `{ status: 400, message: 'bad request' }`
and assert the service raises `AppError` with code `OPENAI_ERROR`.

`backend/src/utils/retry.js` retries 429 / 500 / 503 / `ETIMEDOUT` with 1s and 3s
delays. Use a non-retryable status (e.g. 400) for error-path tests, or
`vi.useFakeTimers()` when testing the retry behavior itself.

## Backend — routes

Use `supertest` against the Express app only if it is already installed or the
user approves adding it. Mock the pipeline/service modules; assert status code and
response shape against `docs/api/README.md`.

## Frontend

Only if the user asks for UI tests. Use `@testing-library/react` with Vitest +
`jsdom`. Mock `frontend/src/api/client.js`, never `fetch` to the real backend.
Assert visible text and outcomes, not hook internals.

## What not to mock away

- Pure domain logic under test (chunkers, keyword scoring, retry logic)
- Simple transformers / validators that are the subject of the test

## Never

- Real OpenAI, Pinecone, or Cohere calls in unit tests (cost + flakiness)
- Real API keys in fixtures or env — use obvious fakes like `test-key`
