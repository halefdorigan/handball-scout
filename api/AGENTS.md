# API Instructions

## Persistence boundary

- Only files in `repositories/` may use `@InjectModel`, `Model`, or execute
  Mongoose queries and commands.
- Services depend on repositories and contain business rules; controllers and
  guards depend only on services.
- Run `npm run check:persistence-boundary` after changing persistence.

## Test organization

- Treat `api/src/` as the entry point for API modules.
- Place tests for files directly under `api/src/` in `api/src/__tests__/`.
- Place tests for a module's files in `api/src/<module>/__tests__/`.
- Reserve `api/test/` exclusively for end-to-end tests.

## Unit tests

- Use Jest for unit tests.
- Organize every test in AAA format, with clearly separated `Arrange`, `Act`,
  and `Assert` sections.
- Test observable behavior and isolate external dependencies, such as Mongoose
  models and authentication services, with mocks.
- When mocking Mongoose models, also simulate chained queries with `.exec()`
  when the code under test uses it.
- Mock `bcrypt` and JWT signing in authentication tests.
- Place every test file in the `__tests__` folder within the directory that
  contains the file under test.
- Name tests with the `.spec.ts` suffix. For example, the test for
  `src/teams/teams.service.ts` belongs in
  `src/teams/__tests__/teams.service.spec.ts`.

## Commands

- `npm test` — runs unit tests.
- `npm run test:cov` — runs unit tests with coverage.
- `npm run test:e2e` — runs end-to-end tests.
- `npm run format` — applies Prettier to API files.
- `npm run format:check` — verifies API file formatting without changes.
