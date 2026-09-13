# ADR-004: Explicit synchronization

- **Date**: 2026-09-13
- **Status**: Accepted
- **Deciders**: Project team
- **Tags**: synchronization, offline-first, integration, consistency

## Context and problem

The frontend records data in local storage first, but must exchange documents
with the API when connectivity exists. The roadmap states that offline mode
does not guarantee real-time synchronization between devices. The current flow
must be simple, user-initiated, and compatible with team, player, and match
collections.

## Decision drivers

- Keep the scout usable without a connection.
- Make synchronization observable and controllable by the user.
- Preserve dependency order between teams, players, and matches.
- Allow the API to upsert received documents.

## Considered options

- Explicit sequential synchronization with local push, API response, and local
  upsert.
- Automatic real-time synchronization between devices.
- Make the API the only write source and block offline changes.

## Decision

We will use explicit synchronization initiated through the **Sincronizar**
action. The service will execute `teams`, `players`, and `games` in that order.
For each collection, it will send local documents to the `/sync` endpoint,
receive processed documents, and upsert them in RxDB. The architecture does not
promise real-time synchronization.

### Positive consequences

- Users can work locally and choose when to exchange data.
- The order reduces missing references during synchronization.
- The flow is small and compatible with current API endpoints.

### Negative consequences

- Data on different devices can diverge until the next action.
- Conflicts and partial failures require future handling.
- Soft-deletion conversion must be maintained in each collection.

## Links

- [Current architecture](../../ARCHITECTURE.md)
- [Synchronization service](../../frontend/src/app/core/services/sync.service.ts)
- [Roadmap](../../ROADMAP.md)
