# ADR-010: Deploy the PWA and API as Railway services

- **Date**: 2026-09-13
- **Status**: Accepted
- **Decision makers**: Project team
- **Tags**: deployment, Railway, Docker, networking

## Context

Scout Court contains two isolated applications in one repository: an Angular
PWA under `frontend/` and a NestJS API under `api/`. The existing containers
can run together with Docker Compose, where the frontend Nginx proxy resolves
the backend as `backend`. Railway deploys monorepo applications as separate
services, so that Compose-only hostname cannot be the production contract.

## Decision

Deploy the applications as two persistent Railway services in the same project
and environment:

- `frontend` uses `/frontend`, its existing Nginx image, and the only public
  domain.
- `backend` uses `/api`, its existing NestJS image, and a private Railway
  domain unless a direct API client requires public access.
- The frontend container renders its Nginx proxy configuration from the
  `BACKEND_URL` runtime variable. Railway sets that variable through a private
  service reference to `backend.RAILWAY_PRIVATE_DOMAIN` and `backend.PORT`.
- The API exposes `/health` as a process healthcheck and continues to read
  `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, and `PORT` from the runtime
  environment.
- MongoDB is a separate Railway service or compatible managed database. Its
  private connection string is provided to the API as `MONGODB_URI`.

Repository files describe the service setup, but Railway project bindings,
domains, and secret values remain environment configuration rather than source
code.

## Consequences

- The public PWA keeps the same-origin `/api` contract and does not expose a
  private Railway hostname to browsers.
- Backend-to-database traffic can remain on Railway's private network.
- The initial Railway project setup still requires a maintainer to create the
  services, configure variables, and generate the frontend domain.
- Docker Compose remains the local integration environment and keeps its
  `backend` hostname through the frontend image default.

## Links

- [Railway deployment guide](../deployment/railway.md)
- [Frontend container](../../frontend/Dockerfile)
- [Frontend proxy](../../frontend/nginx.conf)
- [API health endpoint](../../api/src/app.controller.ts)
