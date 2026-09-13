# ADR-005: Autenticação JWT

- **Data**: 2026-09-13
- **Status**: Aceito
- **Decisores**: Equipe do projeto
- **Tags**: autenticação, autorização, API, JWT

## Contexto e problema

Os dados sincronizados precisam atravessar a fronteira entre a PWA e a API com
identidade e autorização. O backend já possui registro e login, e os
controllers de times, jogadores e partidas estão protegidos por
`JwtAuthGuard`. O frontend possui um interceptor para anexar o token às
requisições.

## Fatores de decisão

- proteger os recursos persistidos no servidor;
- usar um mecanismo compatível com chamadas HTTP da PWA;
- manter autenticação stateless na API;
- permitir que o cliente continue trabalhando localmente sem login disponível.

## Opções consideradas

- Usar JWT no header Bearer, validado pela estratégia Passport da API.
- Usar sessões de servidor com cookie.
- Deixar os endpoints de domínio sem autenticação.

## Decisão

Usaremos JWT Bearer para autorizar a API. `/auth/login` e `/auth/register`
permanecem públicos; os controllers de `teams`, `players` e `games` usam
`JwtAuthGuard`. O frontend armazenará o token em `auth_token` e o interceptor
ativo o enviará no header `Authorization`.

### Consequências positivas

- A API pode validar cada chamada sem manter sessão no servidor.
- A mesma fronteira protege leitura e sincronização dos dados remotos.
- O trabalho local permanece separado da disponibilidade do serviço de auth.

### Consequências negativas

- O frontend ainda precisa de telas de autenticação para obter o token por uma
  jornada completa de usuário.
- Expiração, renovação e revogação de tokens exigem evolução posterior.
- O cliente precisa lidar com chamadas protegidas quando não possui token.

## Links

- [Arquitetura atual](../../ARCHITECTURE.md)
- [Módulo de autenticação](../../api/src/auth/)
- [Interceptor registrado](../../frontend/src/app/core/interceptors/auth.interceptor.ts)
