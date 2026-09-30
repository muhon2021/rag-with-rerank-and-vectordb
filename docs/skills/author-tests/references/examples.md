# Author Tests — examples

Illustrative scenarios for this repo — not a list of real open bugs.

## Chunking change

**Change:** `improvedChunker` now splits on `####` headings too.

| Test | Protects |
|------|----------|
| `splits on h4 headings` | New feature |
| `still splits on h1-h3 headings` | Older feature |
| `returns [] for empty text` | Edge case |

## New API field

**Change:** `/api/chat/*` responses gain `latencyMs`.

| Test | Protects |
|------|----------|
| `chat response includes numeric latencyMs` | New feature |
| `chat response still includes answer and sources` | Older contract (`docs/api/README.md`) |
| `returns 502 with error code when OpenAI mock throws` | Failure path |

## Bugfix without prior test

**Bug:** hybrid search crashes when the keyword cache is empty.

1. Add failing test: empty keyword index → hybrid falls back to vector-only results, does not throw.
2. Fix production code.
3. Keep the test as the regression lock.

## Over-testing (REJECT noise)

Do **not** add:

- Separate tests for every private helper already covered via the public function
- Snapshots of entire pages for a one-line copy change
- Tests that only check `toBeDefined()` on imports
- Tests that call real OpenAI/Pinecone to "check it works"
