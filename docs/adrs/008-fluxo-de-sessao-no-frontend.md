# ADR-008: Fluxo de sessão no frontend

- **Data**: 2026-09-13
- **Status**: Aceito
- **Decisores**: Equipe do projeto
- **Tags**: autenticação, Angular, JWT, rotas

## Contexto e problema

ADR-005 definiu JWT Bearer para a fronteira HTTP, mas a PWA ainda permitia o
acesso direto a páginas internas e mantinha duas implementações de interceptor.
O cliente precisava tratar sessão local, redirecionamentos e logout de forma
coerente com a proteção existente na API.

## Fatores de decisão

- preservar a URL originalmente solicitada por usuários sem sessão;
- evitar acesso às telas de login e registro após a autenticação;
- centralizar a inclusão do header Bearer;
- encerrar a sessão local de forma explícita.

## Opções consideradas

- Proteger cada página interna com guards de rota Angular.
- Verificar autenticação somente quando cada componente é inicializado.
- Deixar as páginas internas públicas e depender apenas das respostas 401 da
  API.

## Decisão

As rotas `/dashboard`, `/teams`, `/players` e `/games` usam `AuthGuard`. Sem
token local, o guard redireciona para `/login` com `returnUrl`. `GuestGuard`
redireciona uma sessão existente de `/login` e `/register` para `/dashboard`.
Após login, o cliente retorna para uma `returnUrl` local válida ou para o
dashboard.

O `AuthService` armazena o `access_token` em `localStorage.auth_token` e o
logout o remove. Há apenas um `AuthInterceptor` registrado, responsável por
adicionar o header `Authorization: Bearer <token>` quando o token existe.

A API lê `JWT_SECRET` e `JWT_EXPIRES_IN` do ambiente para assinar e validar os
tokens. Ela não inicia sem essas variáveis.

## Consequências

- Usuários sem sessão não conseguem navegar para áreas internas pela URL.
- O fluxo de login preserva a navegação pretendida sem aceitar URLs externas.
- O logout bloqueia novamente as rotas internas no cliente.
- Ambientes de execução precisam fornecer as variáveis JWT antes de iniciar a
  API.

## Links

- [ADR-005: Autenticação JWT](005-autenticacao-jwt.md)
- [Rotas da PWA](../../frontend/src/app/app-routing.module.ts)
- [Módulo de autenticação da API](../../api/src/auth/auth.module.ts)
