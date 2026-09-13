# Architecture Decision Records

This directory contains Scout Court's accepted architectural decisions. Each
decision has sequential numbering and records its context, alternatives,
choice, and consequences.

`ARCHITECTURE.md` describes the current architectural state and must point to
the ADRs that support each entry. When a decision changes, create a new ADR and
mark the previous one as superseded; do not rewrite an accepted ADR to alter
its historical record.

## Decisions

- [ADR-001 — PWA and API separation](001-separacao-entre-pwa-e-api.md)
- [ADR-002 — Offline-first local persistence](002-persistencia-local-offline-first.md)
- [ADR-003 — Modular API with MongoDB](003-api-modular-com-mongodb.md)
- [ADR-004 — Explicit synchronization](004-sincronizacao-explicita.md)
- [ADR-005 — JWT authentication](005-autenticacao-jwt.md)
- [ADR-006 — Match and scouting context separation](006-contextos-partida-e-scouting.md)
- [ADR-007 — Repository persistence boundary](007-fronteira-de-persistencia-por-repositorios.md)
- [ADR-008 — Frontend session flow](008-fluxo-de-sessao-no-frontend.md)
- [ADR-009 — Environment configuration](009-configuracao-por-ambiente.md)
- [ADR-010 — Railway deployment](010-deploy-na-railway.md)
