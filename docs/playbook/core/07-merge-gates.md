---
title: Merge Gates
owner: All leads
status: review
last_reviewed: 2026-08-07
applies_to: all
version: 0.1
---

## 1. Purpose

The conditions every change meets before merge, and the checks a reviewer performs.
Everything else in the playbook is advisory until it appears here as a checkable
condition.

## 2. When this applies

Every pull request on every project, client or internal, including documentation
only changes that affect delivery standards.

## 3. Rules

1. **MUST** state in the pull request description which parts were AI assisted
   and which tools were used.
2. **MUST** meet the exit checks that apply **to this change** (see § 3.1)
   before review is requested.
3. **MUST NOT** merge on the author's own approval.
4. **MUST** have at least one reviewer who did not author the change.
5. **SHOULD** keep pull requests small enough to review in one sitting (target
   under 400 lines changed, excluding generated lockfiles).

### 3.1 Which exit checks apply to this PR

Use the smallest set that covers the diff:

| Change type | Required before review |
|---|---|
| Touches only docs / playbook / skills (no app runtime) | Principles + this page's AI disclosure |
| App code / config | `enforce-security` and `review-code` always; `synthesize-code` when AI-assisted |
| Changes user-facing behavior or data paths | Also `author-tests` |
| Touches a hot path (chat pipelines, `compare-all`, ingest, large lists) | Also `profile-performance` |
| Standalone skill run | That skill's own exit gate only |

When unsure, the project lead names the checklist in the PR. Do not block a small
fix on a skill whose concern the diff does not touch.

## 4. Definition of done

Reviewer confirms all items before merge:

- [ ] Pull request description states scope, test approach, and AI disclosure.
- [ ] Exit checks for **this change** are met (§ 3.1).
- [ ] Automated tests pass in CI, or the author documents why CI does not apply.
- [ ] No secrets, credentials, or client restricted data in the diff.
- [ ] AI failure mode checklist below is complete.
- [ ] Stack failure modes checked when the change touches that stack.

## 5. AI failure mode checklist

Reviewer checks for these specifically. They are failures that pass a casual read
because the output is fluent.

- [ ] **Nonexistent APIs.** Methods, filters, hooks, or options that do not exist in
      the installed version.
- [ ] **Version drift.** Correct code for a different major version of the
      framework or library.
- [ ] **Silent scope creep.** Files changed beyond the stated task.
- [ ] **Hollow tests.** Tests that assert on mocks only, or that pass regardless
      of the implementation.
- [ ] **Omitted guards.** Missing validation, authorization, escaping, or error
      handling that a human would have written by habit.
- [ ] **Outdated patterns.** Deprecated approaches that were idiomatic years ago.
- [ ] **Unreviewed dependencies.** New packages added by the model without license
      and necessity check.

## 6. Resources

| Link | Why | Checked |
|---|---|---|
| [`00-principles.md`](00-principles.md) | Accountability and data rules | 2026-08-07 |
| [`../stacks/node-api.md`](../stacks/node-api.md) | Backend (Express) failure modes | 2026-09-30 |
| [`../stacks/js-fullstack.md`](../stacks/js-fullstack.md) | Frontend (React + Vite) failure modes | 2026-09-30 |

## 7. Related skills

- Enforce Security — [`enforce-security`](../../skills/enforce-security/SKILL.md)
- Review Code — [`review-code`](../../skills/review-code/SKILL.md)
- Author Tests — [`author-tests`](../../skills/author-tests/SKILL.md)
- Profile Performance — [`profile-performance`](../../skills/profile-performance/SKILL.md)
- Synthesize Code — [`synthesize-code`](../../skills/synthesize-code/SKILL.md)
