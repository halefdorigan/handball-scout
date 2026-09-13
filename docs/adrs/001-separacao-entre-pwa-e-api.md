# ADR-001: PWA and API separation

- **Date**: 2026-09-13
- **Status**: Accepted
- **Deciders**: Project team
- **Tags**: architecture, frontend, backend, integration

## Context and problem

The project already has two executables with distinct responsibilities: an
Angular PWA in `frontend/` and a NestJS API in `api/`. The PWA must continue
operating locally, while the API provides remote persistence, authentication,
and synchronization. The architecture must preserve a clear HTTP boundary
between these responsibilities.

## Decision drivers

- Keep client local operation independent from API availability.
- Separate frontend and backend build, execution, and deployment cycles.
- Allow other clients to consume the API in the future.
- Preserve the boundary already represented by the repository structure.

## Considered options

- Keep an Angular PWA and a NestJS API separated by HTTP.
- Combine frontend and backend into one executable application.
- Have the frontend access MongoDB directly.

## Decision

We will keep `frontend/` and `api/` as separate applications, communicating
through the HTTP API. The frontend does not access MongoDB directly; it uses
local persistence and the API for synchronization and authentication.

### Positive consequences

- Offline operation is isolated from server availability.
- Each layer can evolve and be validated with its own tools.
- The HTTP boundary makes client and server contracts explicit.

### Negative consequences

- The project must maintain configuration, dependencies, and commands in two
  packages.
- CORS, authentication, API availability, and contract compatibility become
  integration concerns.
- The current compose configuration must remain aligned with the actual
  `api/` directory.

## Links

- [Current architecture](../../ARCHITECTURE.md)
- [Repository overview](../../README.md)
