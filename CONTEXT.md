# Project context

> Scout Court ubiquitous language and global semantic context.

Last reviewed: September 13, 2026.

This file contains only the information needed to interpret the product domain
consistently across features. It is not a catalog of architecture, flows,
routes, APIs, or implementation details.

## Product scope

**Scout Court** is an offline-first workspace for handball professionals. The
product supports registering teams, players, and matches, recording events
during a scout, and reviewing performance reports.

The roadmap includes simultaneous scouting, user registration, and password
reset. Accounts and password reset are not yet part of the current product
journey.

## Ubiquitous language

| Canonical term | UI and code terms | Definition |
| --- | --- | --- |
| **Scout Court** | `Scout Court` | Product name. |
| **scout** | `Scout`, `scouting` | Observing a match while recording events. |
| **scouting session** | `ScoutingSession` | Scout record associated with one match, containing its timer and events. |
| **team** | `Team`, `Time`, `Times` | Registered sports group that participates in a match. |
| **roster** | `Roster`, `Jogadores` | Set of players associated with a team; it is not a separate entity. |
| **player** | `Player`, `Jogador` | Athlete belonging to a team. |
| **shirt number** | `Nº` | Number used to identify a player during a scout. |
| **position** | `Goleiro`, `Ponta`, `Armador`, `Pivô` | Sporting role registered for a player. |
| **match** | `Game`, `jogo`, `Jogos` | Contest between two teams that can be observed and analyzed. |
| **home team** | `Casa`, `Time A` | First match participant. |
| **away team** | `Visitante`, `Time B` | Second match participant. |
| **match event** | `evento` | Occurrence recorded during a scout. |
| **scout action** | `GOL`, `FORA`, `DEFESA`, `AMARELO`, `2 MIN` | Sporting action selected for recording. |
| **collective entry** | `COLETIVO` | Event attributed to a team without identifying a player. |
| **goal** | `GOL` | Event that adds one point to the score. |
| **missed shot** | `FORA` | Shot without a goal. |
| **save** | `DEFESA` | Defensive action by a team. |
| **yellow card** | `AMARELO` | Yellow card received by a team. |
| **2-minute suspension** | `2 MIN` | Temporary penalty for a player or team. |
| **score** | `placar` | Result formed by each team's goal count. |
| **timer** | `cronômetro` | Match time tracked during a scout. |
| **match status** | `pendente`, `em andamento`, `finalizada` | Current state of a match. |
| **match report** | `relatório` | Consolidated view of the score and recorded events. |
| **tag** | `tag` | Free-form label that classifies a team or match. |
| **synchronization** | `Sincronizar` | Updating local data with its remote copy. |

## Domain invariants

- A match relates one home team and one away team.
- A player belongs to only one team at a time.
- An event belongs to a match and a team and can also identify a player.
- A scouting session belongs to only one match.
- The score is derived from goal events, not an independent value.
- Local work can continue without connectivity; synchronization is a later
  capability of the same data.
- Temporal values are stored as UTC instants and presented in the viewer's
  local timezone.

## Related documentation

- [`ARCHITECTURE.md`](ARCHITECTURE.md) — components, boundaries, persistence,
  technical flow, and deployment constraints.
- [`docs/adrs/`](docs/adrs/) — rationale for architectural decisions.
- [`specs/`](specs/) — BDD specifications for user flows, organized by domain.
- [`docs/known-limitations.md`](docs/known-limitations.md) — known
  implementation limitations and divergences.
- [`README.md`](README.md) — local execution and repository overview.
