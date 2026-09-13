# ADR-001: Separação entre PWA e API

- **Data**: 2026-09-13
- **Status**: Aceito
- **Decisores**: Equipe do projeto
- **Tags**: arquitetura, frontend, backend, integração

## Contexto e problema

O projeto já possui dois executáveis com responsabilidades distintas: uma PWA
Angular em `frontend/` e uma API NestJS em `api/`. A PWA precisa continuar
operando localmente, enquanto a API fornece persistência remota, autenticação e
sincronização. A arquitetura precisa preservar uma fronteira HTTP clara entre
essas responsabilidades.

## Fatores de decisão

- manter a operação local do cliente independente da disponibilidade da API;
- separar ciclos de build, execução e deploy do frontend e do backend;
- permitir que a API seja consumida por outros clientes no futuro;
- preservar o limite já refletido na estrutura do repositório.

## Opções consideradas

- Manter uma PWA Angular e uma API NestJS separadas por HTTP.
- Unificar frontend e backend em uma única aplicação executável.
- Fazer o frontend acessar diretamente o MongoDB.

## Decisão

Manteremos `frontend/` e `api/` como aplicações separadas, com a comunicação
entre elas feita pela API HTTP. O frontend não acessa o MongoDB diretamente;
ele usa a persistência local e a API para sincronização e autenticação.

### Consequências positivas

- A operação offline fica isolada da disponibilidade do servidor.
- Cada camada pode evoluir e ser validada com suas próprias ferramentas.
- A fronteira HTTP explicita os contratos entre cliente e servidor.

### Consequências negativas

- O projeto precisa manter configurações, dependências e comandos em dois
  pacotes.
- CORS, autenticação, disponibilidade da API e compatibilidade de contratos
  passam a ser preocupações de integração.
- O compose atual precisa ser mantido alinhado ao diretório real `api/`.

## Links

- [Arquitetura atual](../../ARCHITECTURE.md)
- [Visão geral do projeto](../../README.md)
