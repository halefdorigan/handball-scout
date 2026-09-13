# Architecture

> Current Scout Court architecture, with ADR traceability.

Last reviewed: September 13, 2026.

This file is the source of truth for the current architecture: components,
boundaries, data flow, persistence, and execution and deployment constraints.
Each architectural section and entry is linked to at least one ADR. ADRs record
the rationale for a decision; this file records how it appears in the current
implementation.

## Overview — [ADR-001](docs/adrs/001-separacao-entre-pwa-e-api.md)

```text
User
  ↓
Angular 15 PWA → NgRx Store → RxDB/Dexie (local source)
                              ↓ explicit synchronization
                       NestJS API → MongoDB
```

| Layer | Current implementation | ADR |
| --- | --- | --- |
| Client | Angular 15 PWA running in the browser. | [ADR-001](docs/adrs/001-separacao-entre-pwa-e-api.md) |
| UI state | NgRx Store with `teams`, `players`, and `games` entities. | [ADR-002](docs/adrs/002-persistencia-local-offline-first.md) |
| Local persistence | RxDB over Dexie storage, database `handball_scout_db`. | [ADR-002](docs/adrs/002-persistencia-local-offline-first.md) |
| Integration | `SyncService` explicitly bridges the local database and API. | [ADR-004](docs/adrs/004-sincronizacao-explicita.md) |
| Server | Modular NestJS API exposed over HTTP. | [ADR-001](docs/adrs/001-separacao-entre-pwa-e-api.md) |
| Remote persistence | MongoDB accessed through Mongoose repositories. | [ADR-007](docs/adrs/007-fronteira-de-persistencia-por-repositorios.md) |

## Frontend — [ADR-001](docs/adrs/001-separacao-entre-pwa-e-api.md) and [ADR-002](docs/adrs/002-persistencia-local-offline-first.md)

- The entry point is `frontend/src/main.ts`, which initializes `AppModule`.
  [ADR-001](docs/adrs/001-separacao-entre-pwa-e-api.md)
- The application shell is in `AppComponent`, providing a side rail on desktop
  and bottom navigation on mobile. [ADR-001](docs/adrs/001-separacao-entre-pwa-e-api.md)
- `dashboard`, `teams`, and `games` are lazy-loaded router modules.
  [ADR-001](docs/adrs/001-separacao-entre-pwa-e-api.md)
- The NgRx Store keeps reactive state for teams, players, and matches; reducers
  use entity adapters. [ADR-002](docs/adrs/002-persistencia-local-offline-first.md)
- Effects read and update RxDB. The local database uses Dexie and contains the
  `teams`, `players`, and `games` collections. [ADR-002](docs/adrs/002-persistencia-local-offline-first.md)
- The service worker is enabled only outside development mode.
  [ADR-002](docs/adrs/002-persistencia-local-offline-first.md)
- The interceptor registered in `AppModule` adds a Bearer token when
  `localStorage.auth_token` exists. [ADR-005](docs/adrs/005-autenticacao-jwt.md)

## Backend — [ADR-001](docs/adrs/001-separacao-entre-pwa-e-api.md) and [ADR-003](docs/adrs/003-api-modular-com-mongodb.md)

- `api/src/main.ts` initializes the NestJS application, enables CORS, and
  listens on `PORT` or `3000`. [ADR-001](docs/adrs/001-separacao-entre-pwa-e-api.md)
- `AppModule` composes the `auth`, `teams`, `players`, `player-memberships`,
  `matches`, and `scouting` modules; `games` remains a compatibility facade.
  [ADR-003](docs/adrs/003-api-modular-com-mongodb.md) and [ADR-006](docs/adrs/006-contextos-partida-e-scouting.md)
  [ADR-003](docs/adrs/003-api-modular-com-mongodb.md)
- Each domain module organizes a controller, service, repository, and Mongoose
  schema; only repositories access the driver. [ADR-007](docs/adrs/007-fronteira-de-persistencia-por-repositorios.md)
- The default connection points to the `handball-scout` MongoDB database;
  `MONGODB_URI` can override it. [ADR-003](docs/adrs/003-api-modular-com-mongodb.md)
- The API enables global CORS to allow HTTP communication from the PWA.
  [ADR-001](docs/adrs/001-separacao-entre-pwa-e-api.md)

## State and persistence — [ADR-002](docs/adrs/002-persistencia-local-offline-first.md) and [ADR-003](docs/adrs/003-api-modular-com-mongodb.md)

- RxDB is the frontend's read and write source for the normal flow; screens do
  not query the API directly to load data. [ADR-002](docs/adrs/002-persistencia-local-offline-first.md)
- The local database has legacy schemas for `Game` and new collections for
  `Match` and `ScoutingSession`; events belong to the scouting session.
  [ADR-002](docs/adrs/002-persistencia-local-offline-first.md) and [ADR-006](docs/adrs/006-contextos-partida-e-scouting.md)
- The backend persists the same aggregates as separate Mongoose documents.
  `teamAId`, `teamBId`, and `teamId` are string references without declared
  Mongoose relationships. [ADR-003](docs/adrs/003-api-modular-com-mongodb.md)
- The local database represents soft deletion with `isDeleted`; the API
  represents the same idea with `deleted`. [ADR-002](docs/adrs/002-persistencia-local-offline-first.md) and [ADR-003](docs/adrs/003-api-modular-com-mongodb.md)

## Synchronization — [ADR-004](docs/adrs/004-sincronizacao-explicita.md)

- Synchronization is explicitly started by the user from the **Times** screen.
  [ADR-004](docs/adrs/004-sincronizacao-explicita.md)
- `SyncService.syncAll()` executes `teams`, then `players`, then `games`.
  Each stage sends local documents to the `/sync` endpoint, receives the
  response, and performs a local upsert. [ADR-004](docs/adrs/004-sincronizacao-explicita.md)
- The current flow is local push → API → response pull; there is no real-time
  synchronization between devices. [ADR-004](docs/adrs/004-sincronizacao-explicita.md)
- Explicit `isDeleted`/`deleted` handling exists when sending and receiving
  teams; players and matches follow the local document without this conversion.
  [ADR-004](docs/adrs/004-sincronizacao-explicita.md)

## HTTP boundary authorization — [ADR-005](docs/adrs/005-autenticacao-jwt.md)

- `/auth/login` and `/auth/register` are public API endpoints.
  [ADR-005](docs/adrs/005-autenticacao-jwt.md)
- Controllers for teams, players, and matches use `JwtAuthGuard`.
  [ADR-005](docs/adrs/005-autenticacao-jwt.md)
- The frontend stores the token in `auth_token`, and the active interceptor
  sends it as `Authorization: Bearer <token>`. [ADR-005](docs/adrs/005-autenticacao-jwt.md)
- The frontend does not yet have authentication screens or routes; the
  local-first architecture allows local work without the API, but protected
  synchronization depends on a JWT. [ADR-005](docs/adrs/005-autenticacao-jwt.md)

## Execution and deployment constraints — [ADR-001](docs/adrs/001-separacao-entre-pwa-e-api.md) and [ADR-004](docs/adrs/004-sincronizacao-explicita.md)

- The frontend runs at `http://localhost:4200` and points synchronization to
  `http://localhost:3000`. [ADR-001](docs/adrs/001-separacao-entre-pwa-e-api.md)
- Offline operation depends on local browser storage; data is exchanged with
  the API only when the user requests synchronization and connectivity exists.
  [ADR-002](docs/adrs/002-persistencia-local-offline-first.md) and [ADR-004](docs/adrs/004-sincronizacao-explicita.md)
- `docker-compose.yml` still uses `./backend` as its build context, although
  the backend is in `api/`. [ADR-001](docs/adrs/001-separacao-entre-pwa-e-api.md)

## Implementation sources — [ADR-001](docs/adrs/001-separacao-entre-pwa-e-api.md), [ADR-002](docs/adrs/002-persistencia-local-offline-first.md), [ADR-003](docs/adrs/003-api-modular-com-mongodb.md), [ADR-004](docs/adrs/004-sincronizacao-explicita.md), and [ADR-005](docs/adrs/005-autenticacao-jwt.md)

- [Frontend](frontend/src/) — shell, lazy modules, state, and local persistence.
  [ADR-001](docs/adrs/001-separacao-entre-pwa-e-api.md) and [ADR-002](docs/adrs/002-persistencia-local-offline-first.md)
- [Backend](api/src/) — NestJS modules, controllers, services, and schemas.
  [ADR-001](docs/adrs/001-separacao-entre-pwa-e-api.md) and [ADR-003](docs/adrs/003-api-modular-com-mongodb.md)
- [Synchronization](frontend/src/app/core/services/sync.service.ts) — data
  sequence and transformation. [ADR-004](docs/adrs/004-sincronizacao-explicita.md)
- [Module configuration](api/src/app.module.ts) — API and database composition.
  [ADR-003](docs/adrs/003-api-modular-com-mongodb.md)
- [ADR index](docs/adrs/README.md) — decisions that support this map.
  [ADR-001](docs/adrs/001-separacao-entre-pwa-e-api.md), [ADR-002](docs/adrs/002-persistencia-local-offline-first.md), [ADR-003](docs/adrs/003-api-modular-com-mongodb.md), [ADR-004](docs/adrs/004-sincronizacao-explicita.md), and [ADR-005](docs/adrs/005-autenticacao-jwt.md)
