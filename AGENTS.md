# Agent Instructions

These instructions apply to the entire repository.

## Repository context

- `frontend/` contains the Angular 15 progressive web app.
- `api/` contains the NestJS backend.
- Keep changes scoped to the requested work and preserve unrelated working-tree changes.

## Context rules

- `CONTEXT.md` is limited to project-wide semantic context: ubiquitous
  language, canonical domain definitions, domain invariants, product scope,
  and assumptions that influence multiple features.
- Add information to `CONTEXT.md` only when omitting it could cause a
  developer or agent to misunderstand the product domain or make an
  inconsistent cross-feature decision.
- Do not add user flows, routes, implementation details, architecture, API
  documentation, setup instructions, or feature-specific notes to
  `CONTEXT.md`; keep those topics in their dedicated documentation.
- Read and update `CONTEXT.md` whenever a canonical domain term, business
  definition, invariant, or product boundary changes.

## Architecture rules

- `ARCHITECTURE.md` is the source of truth for the current architecture,
  including components, boundaries, data flow, persistence, and deployment
  constraints.
- Every architecture entry in `ARCHITECTURE.md` must link to an ADR in
  `docs/adrs/`. Architectural changes must update `ARCHITECTURE.md` and create
  or supersede the corresponding ADR in the same change.
- Read `ARCHITECTURE.md` and the relevant ADRs before changing architecture.
  Accepted ADRs are historical records; record a new decision instead of
  rewriting an accepted decision.

## Validation requirements

Run the checks relevant to the code you changed. Frontend validation has an additional mandatory browser requirement.

### Frontend changes

Any change that touches `frontend/`, or shared code that can affect the frontend, must be validated with a real browser through Playwright before it is considered complete. This includes changes to components, templates, styles, routes, state, services, configuration, and user-facing behavior.

For every such change:

1. Start the frontend from `frontend/` with `npm start` and use `http://localhost:4200`.
2. Use the Playwright CLI wrapper provided by the Playwright skill. Do not replace browser validation with unit tests or static inspection.
3. Open the affected page or flow, take a snapshot before using element references, and take another snapshot after navigation or any substantial UI change.
4. Exercise the changed behavior from the perspective of a user. For responsive or visual changes, check the relevant viewport(s) and capture a screenshot.
5. Store useful Playwright artifacts under `output/playwright/`. This directory is local-only and must never be committed; do not create another top-level artifact directory.
6. Report the browser flow that was validated and the result. If validation cannot run, report the exact blocker and do not claim the frontend change is fully validated.

Use the Playwright skill's CLI-first workflow and guardrails, including refreshing snapshots when references become stale. Add Playwright test files or repository scripts only when the task explicitly requests automated test coverage.

### Other changes

- Run the relevant package build and tests for backend or shared-code changes.
- Treat build, unit-test, and browser-validation failures as blockers to completion unless the task explicitly documents an accepted exception.

## Completion summary

Before handing off work, summarize the files changed, validation commands run, affected user flows checked, and any remaining limitations.
