# ADR-003: API modular com MongoDB

- **Data**: 2026-09-13
- **Status**: Aceito
- **Decisores**: Equipe do projeto
- **Tags**: backend, NestJS, MongoDB, Mongoose

## Contexto e problema

O servidor precisa expor autenticação e sincronização para os agregados de
times, jogadores e partidas. O código atual é NestJS e organiza cada área em
um módulo próprio, com schemas Mongoose e uma conexão MongoDB. A persistência
precisa acompanhar documentos que contêm listas e eventos de uma partida.

## Fatores de decisão

- manter módulos de domínio isolados no backend;
- persistir os agregados usados pelo cliente offline-first;
- suportar o array de eventos embutido em uma partida;
- usar as bibliotecas e a estrutura já presentes no repositório.

## Opções consideradas

- Usar NestJS com módulos de domínio, Mongoose e MongoDB.
- Usar NestJS com um banco relacional e ORM.
- Usar um driver de banco sem schemas Mongoose e sem módulos de domínio.

## Decisão

Usaremos NestJS como framework da API, com módulos `auth`, `teams`, `players` e
`games`. Mongoose define os schemas e MongoDB persiste os documentos. Times,
jogadores e partidas são documentos separados; as referências entre eles são
identificadores string (`teamId`, `teamAId` e `teamBId`).

### Consequências positivas

- A organização por módulo acompanha as áreas funcionais do produto.
- MongoDB representa naturalmente documentos e eventos embutidos.
- Mongoose fornece schemas, timestamps e integração com NestJS.

### Consequências negativas

- A integridade entre referências precisa ser tratada pela aplicação.
- Consultas que cruzam times, jogadores e partidas exigem composição explícita.
- A API e a base local precisam coordenar nomes como `deleted` e `isDeleted`.

## Links

- [Arquitetura atual](../../ARCHITECTURE.md)
- [Módulo principal da API](../../api/src/app.module.ts)
- [Schemas de domínio](../../api/src/)
