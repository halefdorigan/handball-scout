# Railway deployment

Scout Court is an isolated monorepo: the Angular PWA and NestJS API are
independent deployable services under `frontend/` and `api/`.

## Railway project

Create one Railway project with a production environment and connect both
services to the `halefdorigan/handball-scout` GitHub repository. Configure the
services as follows:

| Service | Root directory | Public domain | Healthcheck |
| --- | --- | --- | --- |
| `backend` | `/api` | Not required | `/health` |
| `frontend` | `/frontend` | Required | `/` |

Both directories contain a `Dockerfile`, so Railway detects the correct build
strategy after the root directory is set. Configure watch paths so a service
only redeploys for changes under its own directory:

- `backend`: `/api/**`
- `frontend`: `/frontend/**`

Use the same branch for both services, normally `master`.

## Backend variables

Set these variables on the `backend` service:

```text
NODE_ENV=production
MONGODB_URI=<connection string from the Railway MongoDB service>
JWT_SECRET=<sealed, long random secret>
JWT_EXPIRES_IN=7d
```

Add a MongoDB service to the same Railway project and use its private
connection string for `MONGODB_URI`. Keep `JWT_SECRET` sealed in Railway and do
not commit its value.

The API listens on Railway's `PORT` variable and exposes `GET /health` for the
deployment healthcheck. Railway can keep the backend private because browser
traffic reaches it through the frontend proxy.

## Frontend variables

Set this reference variable on the `frontend` service:

```text
BACKEND_URL=http://${{backend.RAILWAY_PRIVATE_DOMAIN}}:${{backend.PORT}}
```

The frontend image renders `frontend/nginx.conf` when the container starts.
The default value remains `http://backend:3000` for Docker Compose; Railway
overrides it with the backend's private hostname and port. The proxy removes
the `/api` prefix before forwarding requests to NestJS.

Generate a public Railway domain only for the `frontend` service. The Angular
production environment uses the same-origin `/api` path, so no backend public
URL is compiled into the PWA and browser requests never use Railway's private
network directly.

## Local container check

From the repository root, provide a development secret and start the stack:

```bash
JWT_SECRET=local-development-secret docker compose up --build
```

Open <http://localhost:8080>. The Compose default in the frontend image points
the `/api` proxy at the `backend` service.

## Release checklist

- Confirm `JWT_SECRET` and `MONGODB_URI` are set on `backend`.
- Confirm the backend deployment is healthy at `/health`.
- Confirm `BACKEND_URL` resolves to the backend private domain on `frontend`.
- Open the frontend public domain and verify the landing page, login, and an
  authenticated API request.
- Keep the backend public domain disabled unless an external client requires
  direct API access.
