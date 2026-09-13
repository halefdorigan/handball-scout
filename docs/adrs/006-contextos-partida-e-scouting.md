# ADR-006: Separação entre partida e scouting

- **Data**: 2026-09-13
- **Status**: Aceito

## Contexto

O agregado legado `Game` misturava dados de uma partida com a captura de
eventos em tempo real. Isso contrariava a fronteira entre Match Context e
Scouting Context e tornava a evolução de relatórios e sincronização frágil.

## Decisão

Partidas são persistidas como `Match`, sem eventos. Cada partida possui uma
`ScoutingSession` com relógio e eventos ordenados. Os endpoints e a coleção
`games` são mantidos apenas como compatibilidade de migração. O frontend cria
coleções locais `matches` e `scoutingSessions` e converte documentos legados
de modo idempotente.

## Consequências

- Scouting pode evoluir sem acoplar captura ao cadastro da partida.
- Relatórios são projeções que combinam contextos, sem escrever nos eventos.
- A migração preserva os IDs e eventos existentes; a fachada legada será
  removida em decisão futura após a transição de clientes.
