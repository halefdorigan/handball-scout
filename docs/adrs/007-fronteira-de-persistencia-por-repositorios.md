# ADR-007: Repository persistence boundary

## Status

Accepted.

## Context

Frontend effects accessed RxDB directly, and API services depended directly on
Mongoose models. This coupled use cases to drivers.

## Decision

Document queries and commands are allowed only in repositories. Services
orchestrate rules and synchronization; UI, effects, controllers, and guards
depend on their contracts. Local database schema creation and registration
remain technical bootstrap work, without document CRUD.

## Consequences

Service tests mock repositories, and an automated check prevents new direct
accesses outside this boundary.
