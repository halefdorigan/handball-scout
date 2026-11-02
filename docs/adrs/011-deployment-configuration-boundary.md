# ADR-011: Keep deployment configuration outside the public repository

- **Date**: 2026-11-02
- **Status**: Accepted
- **Supersedes**: ADR-010 (withdrawn from this public repository)
- **Decision makers**: Project team
- **Tags**: deployment, configuration, security

## Context

Scout Court is published as an open-source repository. The previous deployment
record described a concrete hosting provider, service topology, private
hostnames, and environment bindings. It also coincided with a local Compose
default that embedded a JWT signing secret in version control. Those details
are environment-specific, can reveal operational infrastructure, and can
compromise a deployment if the same values are reused.

## Decision

The public repository documents only provider-neutral development and local
container behavior:

- Production deployment configuration, provider identifiers, domains, and
  secret values live in the private operational environment, not in source.
- Secrets are supplied at runtime through environment variables. Committed
  files may document variable names and placeholders, but never real values.
- Container images remain generic and receive runtime configuration such as
  `BACKEND_URL`, `MONGODB_URI`, `JWT_SECRET`, and `JWT_EXPIRES_IN`.
- Deployment-specific runbooks are maintained outside this repository.

## Consequences

- Anyone can build and run the stack locally without learning production
  topology or credentials.
- Maintainers must keep deployment documentation and secrets in a private
  location.
- Any secret that was previously committed must be rotated, because removing it
  from the current tree does not remove it from version history.
- The repository no longer prescribes a hosting provider, so deployment
  instructions are portable and provider-independent.

## Links

- [Environment variable examples](../../api/.env.development.example)
- [Local container stack](../../docker-compose.yml)
- [Architecture: execution constraints](../../ARCHITECTURE.md)
