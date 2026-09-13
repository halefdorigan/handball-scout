# Scout Court

Scout Court is an offline-first handball scouting workspace. It helps coaches
and analysts register teams, players, matches, and live match events, then
review the resulting reports from one focused interface.

The frontend follows the visual direction in [`DESIGN.md`](./DESIGN.md): a
photography-inspired editorial system translated into a monochrome scouting
tool, with strong type, compact data rows, semantic accents, and responsive
navigation.

## Repository layout

- `frontend/` — Angular 15 progressive web app with NgRx state and RxDB local
  persistence.
- `api/` — NestJS API with MongoDB persistence for teams, players, player
  memberships, games, and authentication.
- `docker-compose.yml` — local MongoDB, API, and frontend container stack.
- `ARCHITECTURE.md` — current architecture, with links to the related ADRs.
- `docs/adrs/` — Architecture Decision Records for architectural changes.
- `specs/` — BDD specifications for user flows, organized by domain.
- `docs/known-limitations.md` — known implementation gaps and divergences.
- `docs/deployment/railway.md` — Railway services and production deployment.
- `DESIGN.md` — product design tokens and visual direction.

## Requirements

- Node.js 18 or newer
- npm 9 or newer
- MongoDB 6 or newer for the API

## Run the frontend

Install dependencies and start the Angular development server:

```bash
cd frontend
npm install
npm start
```

Open <http://localhost:4200>. The app stores working data locally and uses the
API at `http://localhost:3000` when synchronization is requested.

## Run the API

Start MongoDB, then install and run the NestJS service:

```bash
cd api
npm install
npm run start:dev
```

The API listens on <http://localhost:3000>. Set `MONGODB_URI` when MongoDB is
not running at the default local connection used by the application.

## Useful commands

Run these commands from the relevant package directory:

```bash
# frontend production build
npm run build

# frontend unit tests
npm test

# API unit tests
npm test
```

The frontend build output is written to `frontend/dist/frontend`. The API
build output is written to `api/dist`.

## Main flows

1. Create a global player profile in **Jogadores**.
2. Create a team and link existing player profiles with their number and
   position.
3. Create a game and select the two teams.
4. Open **Scout** to start the timer and register match events.
5. Open the game report from the dashboard to compare team and player output.
6. Use **Sync** on the teams screen to exchange local data with the API.

## Deploy to Railway

The frontend and API are deployable as separate Railway services from this
isolated monorepo. Follow [`docs/deployment/railway.md`](docs/deployment/railway.md)
for the service, variable, networking, and domain configuration.

## Design notes

The interface uses the design tokens in `frontend/src/styles.scss`. The shell
uses a fixed editorial rail on larger screens and an accessible bottom
navigation on small screens. Pink, teal, green, purple, and red accents are
reserved for status or interaction meaning; the primary chrome remains black,
white, and soft cloud gray.

## License

This project does not currently declare a public license.
