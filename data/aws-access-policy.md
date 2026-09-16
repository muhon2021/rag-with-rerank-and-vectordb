# AWS Access Policy

**Document ID:** AWS-ACCESS-POL-2025  
**Effective Date:** January 1, 2025  
**Owner:** Cloud Platform Team

## Purpose

This policy governs access to Amazon Web Services (AWS) accounts and resources at Acme Corp.

## How to Request AWS Access

To **request AWS access**, follow the **AWS-ACCESS-REQUEST** process:

1. Open a Jira ticket using template **AWS-ACCESS-REQUEST** in the INFRA project.
2. Specify: employee ID, role, target AWS account(s), required IAM permissions, business justification, and manager name.
3. Your **manager must approve** the ticket within 2 business days.
4. Cloud Platform reviews and provisions access within **3 business days** for standard roles.
5. You will receive an email when access is granted. Initial console login requires MFA per **POLICY-SEC-2025**.

Emergency access uses the break-glass procedure (PagerDuty + CISO approval).

## Identity and Session Requirements

- AWS console access follows security control `SEC-CONTROL-MFA-A17`.
- Human IAM users must use MFA at first login and for privileged role assumption.
- Programmatic automation users are exempt from interactive MFA but must use short-lived credentials.

## Access Principles

- **Least privilege** — Grant minimum permissions required.
- **Separation of duties** — Production changes require two-person review for IAM policy updates.
- Access reviews occur **quarterly**.

## Production Access for Contractors

**Contractors cannot access production systems** unless all of the following are met:

- Written exception approved by VP Engineering and CISO
- Time-bound access (maximum **90 days**)
- Named sponsor from Acme Corp engineering
- Background check completed
- MFA and bastion-only access enforced

Default answer: **No**, contractors may **not** access production AWS accounts or production Kubernetes clusters.

## Non-Production Access

Contractors may receive read-only access to **development** and **staging** accounts with manager approval via AWS-ACCESS-REQUEST.

## Legacy Reference (Do Not Use)

Older tickets may mention `POLICY-SEC-2024`. This reference is obsolete; use `POLICY-SEC-2025` and `SEC-CONTROL-MFA-A17`.

## Offboarding

HR offboarding triggers automatic IAM deprovisioning within 24 hours.

## Contact

Cloud Platform: cloud-platform@acmecorp.example
