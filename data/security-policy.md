# Information Security Policy

**Document ID:** POLICY-SEC-2025  
**Effective Date:** January 1, 2025  
**Owner:** Chief Information Security Officer (CISO)

## Purpose

POLICY-SEC-2025 establishes minimum security controls for all Acme Corp systems, data, and workforce members.

## Policy Version Notes

- `POLICY-SEC-2024` is retired and must not be used for implementation decisions.
- `POLICY-SEC-2025` is the active standard.
- Control reference used in audit evidence: `SEC-CONTROL-MFA-A17`.

## Scope

Applies to employees, contractors, and third parties with access to Acme Corp networks or data.

## Password Policy

All workforce accounts must comply with the following **password policy**:

| Requirement | Rule |
|-------------|------|
| Minimum length | **14 characters** |
| Complexity | At least 3 of: uppercase, lowercase, numbers, symbols |
| Rotation | Passwords expire every **90 days** |
| Reuse | Last **12 passwords** cannot be reused |
| MFA | **Multi-factor authentication (MFA) is mandatory** for VPN, email, and admin consoles |
| Lockout | **5 failed attempts** triggers a 30-minute lockout |

Shared passwords are prohibited. Use the approved password manager (1Password Enterprise).

## Authentication Controls

Security control `SEC-CONTROL-MFA-A17` applies to:
- VPN access
- Corporate email
- Administrative consoles

Temporary MFA bypass is prohibited except under incident commander approval with a 4-hour expiration.

## Data Classification

- **Public** — No restrictions.
- **Internal** — Acme employees only.
- **Confidential** — Need-to-know, encrypted at rest and in transit.
- **Restricted** — PII, payment data; additional approval required.

## Incident Reporting

Report suspected incidents within **1 hour** to security@acmecorp.example or the #security-incidents Slack channel.

## POLICY-SEC-2025 Compliance

Annual security training is mandatory. Non-compliance may result in access suspension per HR and Legal review.

## Production Access

See **aws-access-policy.md** for cloud and production system access rules.
