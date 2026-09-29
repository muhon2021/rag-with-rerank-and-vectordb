# Dashboard — Overview & Metrics

## Summary

This document outlines the implementation of an administrative dashboard overview page at `/dashboard`. This page provides administrators with a quick operational snapshot, including key metrics, recent activity, and quick actions. It defines the UI surface, data shapes, and backend endpoints to facilitate parallel frontend and backend development.

## Goals

- Provide a one-glance admin dashboard for operations and health checks.
- Expose small, read-only APIs that aggregate site-wide stats and activity for frontend charts and cards.
- Include Quick Actions that surface management pages (roles, members) and ingest/reindex commands.

## Routes

- `/dashboard` — Overview and metrics

## Primary UI components

- Metric cards (top row):
  - Total members (integer)
  - Total roles (integer)
  - Total vectors indexed (integer)
  - Backend health / index status (ok/warning/error)
- Recent activity feed: chronological list of admin events (limit 20)
- Quick actions: buttons linking to Role Management, Member Management, Re-index/ingest, Run health checks

## Backend API Contract

### GET /api/admin/stats

- Purpose: Fetch aggregated operational statistics for the dashboard.
- Authentication: Required (admin-only).
- Response Shape:
  {
    "members": number,
    "roles": number,
    "totalVectors": number,
    "backendStatus": "ok" | "warning" | "error",
    "lastIngestAt"?: string
  }

### GET /api/admin/activity?limit=20

- Purpose: Fetch a chronological list of recent admin events.
- Authentication: Required (admin-only).
- Response Shape:
  [
    {
      "id": string,
      "type": string,
      "actor": string,
      "message": string,
      "timestamp": string,
      "details"?: object
    },
    // ... up to 20 events
  ]

## Data / event examples

- Activity event example:
  {
    "id": "evt_01",
    "type": "member.create",
    "actor": "alice@example.com",
    "message": "Created new member Alice",
    "timestamp": "2026-09-29T15:16:00Z",
    "details": { "memberId": "m1" }
  }

## Acceptance Criteria

- This docs/features/dashboard-overview-task.md file exists and documents the feature.
- Clear API contracts for GET /api/admin/stats and GET /api/admin/activity are specified and implemented on the backend.
- The frontend `/dashboard` page displays metric cards, an activity list, and Quick Actions using data fetched from the specified backend APIs.
- The sidebar navigation includes an "Overview" link to `/dashboard`.
- Quick actions for "Role Management" and "Member Management" link to `/dashboard/roles` and `/dashboard/members` respectively.
- All `/api/admin/*` routes are protected by admin-only authentication middleware.
- Frontend components reuse existing global styles from `frontend/src/styles/theme.css`.
- The dashboard handles cases where no activity events are available or backend stats data is unavailable (e.g., `backendStatus` reflects 'warning' or 'error').
