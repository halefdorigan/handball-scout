# ADR-006: Match and scouting context separation

- **Date**: 2026-09-13
- **Status**: Accepted

## Context

The legacy `Game` aggregate mixed match data with real-time event capture. This
violated the boundary between Match Context and Scouting Context and made the
evolution of reports and synchronization fragile.

## Decision

Matches are persisted as `Match` without events. Each match has a
`ScoutingSession` with an ordered clock and events. The `games` endpoints and
collection remain only for migration compatibility. The frontend creates local
`matches` and `scoutingSessions` collections and converts legacy documents
idempotently.

## Consequences

- Scouting can evolve without coupling capture to match registration.
- Reports are projections that combine contexts without writing to events.
- The migration preserves existing IDs and events; the legacy facade will be
  removed in a future decision after client transition.
