# Arquitetura

> Arquitetura vigente do Scout Court, com rastreabilidade para ADRs.

Última verificação: 13 de setembro de 2026.

Este arquivo é a fonte da verdade para a arquitetura atual: componentes,
fronteiras, fluxo de dados, persistência e restrições de execução/deploy. Cada
seção e cada entrada arquitetural está vinculada a pelo menos uma ADR. As ADRs
registram o motivo da decisão; este arquivo registra como a decisão aparece na
implementação atual.

## Visão geral — [ADR-001](docs/adrs/001-separacao-entre-pwa-e-api.md)

```text
Usuário
  ↓
Angular 15 PWA → NgRx Store → RxDB/Dexie (fonte local)
                              ↓ sincronização explícita
                       NestJS API → MongoDB
```

| Camada | Implementação atual | ADR |
| --- | --- | --- |
| Cliente | PWA Angular 15 executada no navegador. | [ADR-001](docs/adrs/001-separacao-entre-pwa-e-api.md) |
| Estado de interface | NgRx Store com entidades `teams`, `players` e `games`. | [ADR-002](docs/adrs/002-persistencia-local-offline-first.md) |
| Persistência local | RxDB sobre storage Dexie, base `handball_scout_db`. | [ADR-002](docs/adrs/002-persistencia-local-offline-first.md) |
| Integração | `SyncService` faz a ponte explícita entre a base local e a API. | [ADR-004](docs/adrs/004-sincronizacao-explicita.md) |
| Servidor | API NestJS modular exposta por HTTP. | [ADR-001](docs/adrs/001-separacao-entre-pwa-e-api.md) |
| Persistência remota | MongoDB acessado por Mongoose. | [ADR-003](docs/adrs/003-api-modular-com-mongodb.md) |

## Frontend — [ADR-001](docs/adrs/001-separacao-entre-pwa-e-api.md) e [ADR-002](docs/adrs/002-persistencia-local-offline-first.md)

- O ponto de entrada é `frontend/src/main.ts`, que inicializa o `AppModule`.
  [ADR-001](docs/adrs/001-separacao-entre-pwa-e-api.md)
- O shell da aplicação fica em `AppComponent` e fornece rail lateral no
  desktop e navegação inferior no mobile. [ADR-001](docs/adrs/001-separacao-entre-pwa-e-api.md)
- `dashboard`, `teams` e `games` são módulos lazy carregados pelo roteador.
  [ADR-001](docs/adrs/001-separacao-entre-pwa-e-api.md)
- O NgRx Store mantém estado reativo para times, jogadores e partidas; os
  reducers usam adapters de entidades. [ADR-002](docs/adrs/002-persistencia-local-offline-first.md)
- Os effects consultam e atualizam o RxDB. A base local usa Dexie e contém as
  coleções `teams`, `players` e `games`. [ADR-002](docs/adrs/002-persistencia-local-offline-first.md)
- O service worker é habilitado apenas fora do modo de desenvolvimento.
  [ADR-002](docs/adrs/002-persistencia-local-offline-first.md)
- O interceptor registrado no `AppModule` acrescenta o token Bearer quando
  existe `localStorage.auth_token`. [ADR-005](docs/adrs/005-autenticacao-jwt.md)

## Backend — [ADR-001](docs/adrs/001-separacao-entre-pwa-e-api.md) e [ADR-003](docs/adrs/003-api-modular-com-mongodb.md)

- `api/src/main.ts` inicializa a aplicação NestJS, habilita CORS e escuta a
  porta `PORT` ou `3000`. [ADR-001](docs/adrs/001-separacao-entre-pwa-e-api.md)
- `AppModule` compõe os módulos `auth`, `teams`, `players` e `games`.
  [ADR-003](docs/adrs/003-api-modular-com-mongodb.md)
- Cada módulo de domínio organiza controller, service e schema Mongoose.
  [ADR-003](docs/adrs/003-api-modular-com-mongodb.md)
- A conexão padrão aponta para o banco MongoDB `handball-scout`; `MONGODB_URI`
  pode substituí-la. [ADR-003](docs/adrs/003-api-modular-com-mongodb.md)
- A API habilita CORS globalmente para permitir a comunicação HTTP da PWA.
  [ADR-001](docs/adrs/001-separacao-entre-pwa-e-api.md)

## Estado e persistência — [ADR-002](docs/adrs/002-persistencia-local-offline-first.md) e [ADR-003](docs/adrs/003-api-modular-com-mongodb.md)

- O RxDB é a fonte de leitura e escrita do fluxo normal do frontend; as telas
  não consultam a API diretamente para carregar dados. [ADR-002](docs/adrs/002-persistencia-local-offline-first.md)
- A base local possui schemas para `Team`, `Player` e `Game`; eventos ficam
  embutidos no array `events` de uma partida. [ADR-002](docs/adrs/002-persistencia-local-offline-first.md)
- O backend persiste os mesmos agregados como documentos Mongoose separados.
  `teamAId`, `teamBId` e `teamId` são referências por string, sem relações
  Mongoose declaradas. [ADR-003](docs/adrs/003-api-modular-com-mongodb.md)
- A base local representa exclusão lógica com `isDeleted`; a API representa a
  mesma ideia com `deleted`. [ADR-002](docs/adrs/002-persistencia-local-offline-first.md) e [ADR-003](docs/adrs/003-api-modular-com-mongodb.md)

## Sincronização — [ADR-004](docs/adrs/004-sincronizacao-explicita.md)

- A sincronização é iniciada explicitamente pelo usuário na tela **Times**.
  [ADR-004](docs/adrs/004-sincronizacao-explicita.md)
- `SyncService.syncAll()` executa `teams`, depois `players`, depois `games`.
  Cada etapa envia os documentos locais para o endpoint `/sync`, recebe a
  resposta e faz upsert local. [ADR-004](docs/adrs/004-sincronizacao-explicita.md)
- O fluxo atual é push local → API → pull da resposta; não há sincronização em
  tempo real entre dispositivos. [ADR-004](docs/adrs/004-sincronizacao-explicita.md)
- O tratamento explícito de `isDeleted`/`deleted` existe no envio e recebimento
  de times; jogadores e partidas seguem o documento local sem essa conversão.
  [ADR-004](docs/adrs/004-sincronizacao-explicita.md)

## Autorização da fronteira HTTP — [ADR-005](docs/adrs/005-autenticacao-jwt.md)

- `/auth/login` e `/auth/register` são endpoints públicos da API.
  [ADR-005](docs/adrs/005-autenticacao-jwt.md)
- Os controllers de times, jogadores e partidas usam `JwtAuthGuard`.
  [ADR-005](docs/adrs/005-autenticacao-jwt.md)
- O frontend armazena o token em `auth_token` e o interceptor ativo o envia
  como `Authorization: Bearer <token>`. [ADR-005](docs/adrs/005-autenticacao-jwt.md)
- O frontend ainda não possui telas ou rotas de autenticação; a arquitetura
  local-first permite o trabalho local sem a API, mas a sincronização protegida
  depende de um JWT. [ADR-005](docs/adrs/005-autenticacao-jwt.md)

## Restrições de execução e deploy — [ADR-001](docs/adrs/001-separacao-entre-pwa-e-api.md) e [ADR-004](docs/adrs/004-sincronizacao-explicita.md)

- O frontend é executado em `http://localhost:4200` e aponta a sincronização
  para `http://localhost:3000`. [ADR-001](docs/adrs/001-separacao-entre-pwa-e-api.md)
- A operação offline depende do armazenamento local do navegador; a troca com
  a API só ocorre quando o usuário solicita sincronização e há conectividade.
  [ADR-002](docs/adrs/002-persistencia-local-offline-first.md) e [ADR-004](docs/adrs/004-sincronizacao-explicita.md)
- O `docker-compose.yml` ainda usa `./backend` como contexto de build, embora
  o backend esteja em `api/`. [ADR-001](docs/adrs/001-separacao-entre-pwa-e-api.md)

## Fontes de implementação — [ADR-001](docs/adrs/001-separacao-entre-pwa-e-api.md), [ADR-002](docs/adrs/002-persistencia-local-offline-first.md), [ADR-003](docs/adrs/003-api-modular-com-mongodb.md), [ADR-004](docs/adrs/004-sincronizacao-explicita.md) e [ADR-005](docs/adrs/005-autenticacao-jwt.md)

- [Frontend](frontend/src/) — shell, módulos lazy, estado e persistência local.
  [ADR-001](docs/adrs/001-separacao-entre-pwa-e-api.md) e [ADR-002](docs/adrs/002-persistencia-local-offline-first.md)
- [Backend](api/src/) — módulos NestJS, controllers, services e schemas.
  [ADR-001](docs/adrs/001-separacao-entre-pwa-e-api.md) e [ADR-003](docs/adrs/003-api-modular-com-mongodb.md)
- [Sincronização](frontend/src/app/core/services/sync.service.ts) — sequência
  e transformação dos dados. [ADR-004](docs/adrs/004-sincronizacao-explicita.md)
- [Configuração de módulos](api/src/app.module.ts) — composição da API e banco.
  [ADR-003](docs/adrs/003-api-modular-com-mongodb.md)
- [Índice de ADRs](docs/adrs/README.md) — decisões que fundamentam este mapa.
  [ADR-001](docs/adrs/001-separacao-entre-pwa-e-api.md), [ADR-002](docs/adrs/002-persistencia-local-offline-first.md), [ADR-003](docs/adrs/003-api-modular-com-mongodb.md), [ADR-004](docs/adrs/004-sincronizacao-explicita.md) e [ADR-005](docs/adrs/005-autenticacao-jwt.md)
