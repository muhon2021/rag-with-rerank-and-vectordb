# Engineering Guidelines

**Document ID:** ENG-GUIDE-2025  
**Effective Date:** January 1, 2025  
**Owner:** Engineering Leadership

## Overview

These guidelines define how engineering teams at Acme Corp build, review, and ship software.

## Development Standards

- All production code requires **peer review** (minimum one approver).
- Use trunk-based development; feature flags for risky changes.
- Unit test coverage target: **80%** for new services.

## Branching and Releases

- `main` is always deployable.
- Releases to production occur Tuesday–Thursday only, except hotfixes approved by on-call lead.

## Observability

Services must emit structured logs, metrics (Prometheus), and distributed traces (OpenTelemetry).

## Secrets Management

Never commit secrets. Use AWS Secrets Manager or HashiCorp Vault. Reference **POLICY-SEC-2025** for password and MFA rules.

## Documentation

Each service requires a README, runbook, and architecture diagram in the internal wiki.

## On-Call

Engineering teams maintain a weekly on-call rotation with a 15-minute response SLA for SEV-1 incidents.

## Contractors

Contractors may commit code to non-production repositories with manager approval. Production deployment access requires separate approval per **aws-access-policy.md**.
