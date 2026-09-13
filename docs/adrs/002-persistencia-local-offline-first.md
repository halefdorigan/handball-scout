# ADR-002: Persistência local offline-first

- **Data**: 2026-09-13
- **Status**: Aceito
- **Decisores**: Equipe do projeto
- **Tags**: frontend, offline-first, estado, persistência

## Contexto e problema

O scout precisa registrar dados durante uma partida mesmo quando a conexão não
está disponível. O frontend possui entidades de times, jogadores, partidas e
eventos que devem sobreviver à navegação e ser observáveis pela interface. A
arquitetura vigente já usa RxDB com storage Dexie e NgRx.

## Fatores de decisão

- permitir registro e consulta local sem depender da API;
- manter uma base reativa para componentes e effects Angular;
- persistir documentos estruturados no navegador;
- deixar a sincronização explícita e separada da leitura normal.

## Opções consideradas

- Usar RxDB sobre Dexie como persistência local e NgRx como estado reativo de
  interface.
- Usar `localStorage` e estado mantido diretamente nos componentes.
- Fazer a API ser a fonte primária e bloquear o uso offline.

## Decisão

Usaremos RxDB com storage Dexie como fonte local durável para as coleções
`teams`, `players` e `games`. O NgRx Store manterá a projeção reativa dessas
entidades para os componentes; os effects farão a ponte entre ações do usuário
e o RxDB. A base local se chama `handball_scout_db`.

### Consequências positivas

- O scout continua utilizável sem conectividade.
- Os dados permanecem disponíveis após recarregar a PWA.
- NgRx oferece seleção e atualização reativas, enquanto o RxDB concentra a
  persistência.

### Consequências negativas

- O cliente precisa tratar reconciliação e conflitos durante a sincronização.
- Os modelos local e remoto precisam permanecer compatíveis.
- O armazenamento do navegador não substitui uma cópia remota sincronizada.

## Links

- [Arquitetura atual](../../ARCHITECTURE.md)
- [Serviço de banco local](../../frontend/src/app/core/db/database.service.ts)
- [Schemas locais](../../frontend/src/app/core/db/schemas.ts)
