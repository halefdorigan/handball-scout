# ADR-002: Offline-first local persistence

- **Date**: 2026-09-13
- **Status**: Accepted
- **Deciders**: Project team
- **Tags**: frontend, offline-first, state, persistence

## Context and problem

The scout must record data during a match even when connectivity is
unavailable. The frontend has team, player, match, and event entities that
must survive navigation and remain observable to the UI. The current
architecture already uses RxDB with Dexie storage and NgRx.

## Decision drivers

- Allow local recording and consultation without depending on the API.
- Maintain a reactive base for Angular components and effects.
- Persist structured documents in the browser.
- Keep synchronization explicit and separate from normal reads.

## Considered options

- Use RxDB over Dexie for local persistence and NgRx for reactive UI state.
- Use `localStorage` and state kept directly in components.
- Make the API the primary source and block offline use.

## Decision

We will use RxDB with Dexie storage as the durable local source for the
`teams`, `players`, and `games` collections. The NgRx Store will maintain the
reactive projection of these entities for components; effects will bridge user
actions and RxDB. The local database is named `handball_scout_db`.

### Positive consequences

- The scout remains usable without connectivity.
- Data remains available after the PWA reloads.
- NgRx provides reactive selection and updates, while RxDB concentrates
  persistence.

### Negative consequences

- The client must handle reconciliation and conflicts during synchronization.
- Local and remote models must remain compatible.
- Browser storage does not replace a synchronized remote copy.

## Links

- [Current architecture](../../ARCHITECTURE.md)
- [Local database service](../../frontend/src/app/core/db/database.service.ts)
- [Local schemas](../../frontend/src/app/core/db/schemas.ts)
