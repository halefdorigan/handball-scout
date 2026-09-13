# BDD Specs

The specifications in this directory describe observable Scout Court user
flows in English Gherkin. Each subdirectory represents the domain that owns
the behavior.

## Conventions

- Create or update `specs/<domain>/*.feature` whenever a user flow is added
  or changed.
- Write every feature file in English using `Feature`, `Background`,
  `Scenario`, `Scenario Outline`, `Examples`, `Given`, `When`, `Then`, `And`,
  and `But`.
- Write independent scenarios using the domain's canonical language from
  [`CONTEXT.md`](../CONTEXT.md).
- Describe observable outcomes and business rules. Do not include framework,
  persistence, API, or UI-selector details.
- Cover the primary path and relevant exceptions or validation. Use a
  `Scenario Outline` when a rule applies to several examples.

The files are the current acceptance specification. No Gherkin runner is
configured in this repository yet; future automation must reuse these specs
rather than duplicate them elsewhere.
