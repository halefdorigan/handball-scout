# ADR-003: Modular API with MongoDB

- **Date**: 2026-09-13
- **Status**: Accepted
- **Deciders**: Project team
- **Tags**: backend, NestJS, MongoDB, Mongoose

## Context and problem

The server must expose authentication and synchronization for team, player,
and match aggregates. The current NestJS code organizes each area into its own
module, with Mongoose schemas and a MongoDB connection. Persistence must handle
documents containing lists and match events.

## Decision drivers

- Keep isolated domain modules in the backend.
- Persist the aggregates used by the offline-first client.
- Support the embedded event array in a match.
- Use the libraries and structure already present in the repository.

## Considered options

- Use NestJS with domain modules, Mongoose, and MongoDB.
- Use NestJS with a relational database and ORM.
- Use a database driver without Mongoose schemas or domain modules.

## Decision

We will use NestJS as the API framework, with `auth`, `teams`, `players`, and
`games` modules. Mongoose defines schemas and MongoDB persists documents.
Teams, players, and matches are separate documents; references between them are
string identifiers (`teamId`, `teamAId`, and `teamBId`).

### Positive consequences

- Module organization follows the product's functional areas.
- MongoDB naturally represents documents and embedded events.
- Mongoose provides schemas, timestamps, and NestJS integration.

### Negative consequences

- Application code must handle reference integrity.
- Queries that cross teams, players, and matches require explicit composition.
- The API and local database must coordinate names such as `deleted` and
  `isDeleted`.

## Links

- [Current architecture](../../ARCHITECTURE.md)
- [API root module](../../api/src/app.module.ts)
- [Domain schemas](../../api/src/)
