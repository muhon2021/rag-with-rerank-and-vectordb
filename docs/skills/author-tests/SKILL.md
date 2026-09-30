---
name: author-tests
description: >-
  Writes automated tests that confirm new features work and do not break older
  behavior. Use when adding or updating tests, covering a new feature, fixing a
  regression without a test, or when the user asks to author, write, or generate
  tests.
version: 0.1.0
owner: Avengers
last_reviewed: 2026-08-12
---

# Author Tests

Write automated checks that run during development to confirm new features work and don't accidentally break older features.

## When to use

- New feature, bugfix, or public API change needs coverage
- User asks to write, author, generate, or expand tests
- A changed chunker, retriever, reranker, or route has no test

**This repo has no test runner yet.** See
[references/test-patterns.md](references/test-patterns.md) § Runner before adding one.

## Out of scope

- Implementing the feature itself → implement first (or `synthesize-code`), then return here
- Hitting real OpenAI, Pinecone, Cohere, or production data in unit tests

## Progress checklist

```
Author Tests:
- [ ] Step 1: Map behavior under test
- [ ] Step 2: Choose test type and location
- [ ] Step 3: Mock externals; arrange fixtures
- [ ] Step 4: Write assertions (happy path + failure/regression)
- [ ] Step 5: Run or sanity-check; keep tests focused
```

## Workflow

### 1. Map behavior under test

From the change (diff, module, or user goal), list:

- **New behavior** — must pass (feature works)
- **Old behavior at risk** — must still pass (no regressions)
- **Error paths** — invalid input, empty data, upstream error from OpenAI / Pinecone / Cohere

One behavior → one focused test name. Prefer many small tests over one mega-test.

### 2. Choose location

| Code under test | Where to put tests |
|--------------|--------------------|
| `backend/src/**` | `backend/tests/` or colocated `*.test.js` (keep one convention) |
| `frontend/src/**` | Colocated `*.test.jsx` (only when UI tests are requested) |

Minimums: each new/changed exported function or route, plus one regression
assertion on behavior the change could break. Keep the four RAG stages tested
independently.

Patterns: [references/test-patterns.md](references/test-patterns.md).

### 3. Mock externals

- Mock the `openai` and `@pinecone-database/pinecone` modules and stub global `fetch` for Cohere (backend); mock `frontend/src/api/client.js` (frontend)
- Never call real networks in these unit tests
- Set only fake env values needed for `config` (names in `.env.example`, never real secrets)

### 4. Write assertions

Each test must assert an observable outcome:

- Return value / thrown error (server)
- Visible UI or state change (client: Testing Library queries)
- Regression: assert previous contract still holds after the change

Avoid:

- Tests with no `expect`
- Asserting implementation details (internal private helpers) when a public API exists
- Snapshot spam for trivial markup

### 5. Finish

- Same change as the feature when possible (don’t leave coverage for “later”)
- If the project has a test script, note the command; don’t invent a runner the repo doesn’t use
- Update module docs only if the public API description must mention testable contracts (rare)

## Naming

```text
test('<unit> <behavior> when <condition>', …)
```

Examples: `improvedChunker labels chunks with section heading`, `embedTexts returns [] for empty input`, `rerank falls back to simple rerank when Cohere fetch fails`.

## Output when invoked

1. Behaviors covered (new + regression)
2. Files added/updated
3. Mocks used
4. How to run (if known from `package.json` / README)

## 7. Exit gate

Reviewer verifies against the test files with no author interview.

- [ ] Every new or changed behavior has at least one test with a real `expect`
- [ ] At least one regression test covers behavior at risk from the change
- [ ] Externals mocked; no live network or production data in unit tests
- [ ] Test locations follow one consistent convention per package
- [ ] Route tests match request/response shapes in `docs/api/README.md` or note
      intentional deviation

## Related skills

- Implement first: [`synthesize-code`](../synthesize-code/SKILL.md)
- Performance after correctness: [`profile-performance`](../profile-performance/SKILL.md)

## 8. References

| File | When |
|---|---|
| [`references/test-patterns.md`](references/test-patterns.md) | Choosing patterns and mocks |
| [`references/examples.md`](references/examples.md) | Worked examples |

## 9. Resources

| Link | Why | Checked |
|---|---|---|
| [`playbook/core/07-merge-gates.md`](../../playbook/core/07-merge-gates.md) | "Hollow tests" failure mode | 2026-08-12 |
| [`docs/api/README.md`](../../api/README.md) | API shapes to test against | 2026-09-30 |

## 10. Ownership

Owner: Avengers. Canonical copy lives in the SJI base repo. Siblings: `synthesize-code`, `profile-performance`.
