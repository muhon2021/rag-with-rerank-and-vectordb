---
title: Principles and Ground Rules
owner: Rajon
status: review
last_reviewed: 2026-08-07
applies_to: all
version: 0.1
---

## 1. Purpose

Binding rules for all SJI work that uses AI assisted development. Every other
playbook page inherits the vocabulary and constraints defined here.

SJI uses AI as a development accelerator, not a substitute for engineering
judgment. Output is draft material until a named developer reviews, tests, and
accepts it.

## 2. When this applies

Always. This page is binding on all client and internal work, including
maintenance, spikes, and tooling changes.

## 3. Rules

### Accountability

1. **MUST** treat every AI generated or AI assisted change as untrusted until
   reviewed and tested by a human who understands the task.
2. **MUST** be able to explain what the change does, why it is correct, and what
   was rejected or edited from the model output.
3. **MUST NOT** merge code the author cannot defend in review without referring
   back to the model.

### Client data and confidentiality

1. **MUST** follow the client contract when it restricts tools, data handling, or
   AI use. The contract wins over this playbook.
2. **MUST NOT** paste into any AI tool: production credentials or secrets;
   live customer PII; full production database exports; unreleased client business
   data the client has not approved for tool use; or source code when the client
   contract prohibits external processing.
3. **MUST** use anonymized, synthetic, or minimal excerpts when a prompt needs
   data shape or examples.
4. **MUST** when the client contract is silent, assume all client code and data
   are confidential and obtain project lead approval before using an external AI
   tool on client material.

### Approved tools

1. **MUST** use only tools on the approved list below, unless the project lead
   records a client approved exception in the project documentation.
2. **MUST** request additions to the list by pull request to this page, reviewed
   by the Owner and engineering management.

| Tool category | Approved (default) | Notes |
|---|---|---|
| IDE assistant | Cursor | Default for SJI internal work |
| Other AI tools | None by default | Require written approval per project |

> **Provisional:** This table is the working default while the page is in
> `review`. Engineering management confirms or expands it before the page goes
> `active`. Until then, Cursor is the assumed IDE assistant; do not treat
> "None by default" as a ban on Cursor itself.

### Generated code, IP, and licensing

1. **MUST** review generated code for license compatibility before merge,
   including dependencies the model introduces.
2. **MUST** apply the same review standard to AI assisted code as to hand written
   code. Fluent output is not evidence of correctness.
3. **MUST** ensure deliverables meet client IP terms. When terms are unclear,
   escalate to the project lead before delivery.

## 4. Procedure

When a rule on this page conflicts with a client instruction or deadline:

1. Stop and do not use the disallowed tool or data in the model.
2. Notify the project lead in writing.
3. If unresolved within one business day, escalate to engineering management.
4. Record the decision in the project documentation before continuing.

## 5. Exit gate

Not applicable. This page has no phase.

## 6. Resources

| Link | Why | Checked |
|---|---|---|
| [`07-merge-gates.md`](07-merge-gates.md) | Checks every PR meets before merge | 2026-09-30 |

## 7. Related skills

All skills in [`../../skills/`](../../skills/README.md). See [`../README.md`](../README.md).
