# ADR-005: JWT authentication

- **Date**: 2026-09-13
- **Status**: Accepted
- **Deciders**: Project team
- **Tags**: authentication, authorization, API, JWT

## Context and problem

Synchronized data must cross the boundary between the PWA and API with
identity and authorization. The backend already has registration and login,
and team, player, and match controllers are protected by `JwtAuthGuard`. The
frontend has an interceptor to attach the token to requests.

## Decision drivers

- Protect resources persisted on the server.
- Use a mechanism compatible with PWA HTTP calls.
- Keep API authentication stateless.
- Allow the client to continue local work without login availability.

## Considered options

- Use JWT in the Bearer header, validated by the API Passport strategy.
- Use server sessions with cookies.
- Leave domain endpoints unauthenticated.

## Decision

We will use JWT Bearer to authorize the API. `/auth/login` and
`/auth/register` remain public; `teams`, `players`, and `games` controllers use
`JwtAuthGuard`. The frontend will store the token in `auth_token`, and the
active interceptor will send it in the `Authorization` header.

### Positive consequences

- The API can validate each call without keeping a server session.
- The same boundary protects reads and synchronization of remote data.
- Local work remains separate from authentication-service availability.

### Negative consequences

- The frontend still needs authentication screens for a complete token-acquisition
  journey.
- Token expiration, renewal, and revocation require future work.
- The client must handle protected calls when it has no token.

## Links

- [Current architecture](../../ARCHITECTURE.md)
- [Authentication module](../../api/src/auth/)
- [Registered interceptor](../../frontend/src/app/core/interceptors/auth.interceptor.ts)
