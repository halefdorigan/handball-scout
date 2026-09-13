# Known limitations

This document captures observed implementation divergences and gaps. They are
not part of the global semantic context.

- The UI still reads the legacy `games` collection; migration to `matches` and
  `scoutingSessions` already runs in the local database, but screens must be
  migrated before compatibility can be removed.
- Yellow cards are recorded but have no statistic in the report.
- The timer does not change `Game.status`; the match remains `PENDING` after
  creation.
- The `/games/:id` route exists, but loading a match for editing is not yet
  implemented.
- The frontend has no authentication screens or routes, although the API
  offers login and registration.
- The soft-deletion conversion between `isDeleted` and `deleted` is explicit
  only for teams during synchronization.
- `docker-compose.yml` uses `./backend` as its build context, although the
  backend is in the `api/` directory.
