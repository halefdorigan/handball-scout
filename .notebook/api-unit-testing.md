# API Unit Testing
> Jest unit tests colocated with the implementation

Entry: `api/src/` module directories

Layout:
- `api/src/__tests__/` — tests for files directly under `api/src/`
- `api/src/<module>/__tests__/` — tests for files in each API module
- `api/test/` — end-to-end tests only

Structure: every test case uses explicit `Arrange`, `Act`, and `Assert` sections, as required by `api/AGENTS.md`.

Dependencies: services mock Mongoose model methods and the chained `.exec()` query; auth tests mock `bcrypt` and JWT signing.

Updated: 2026-09-12
