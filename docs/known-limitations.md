# Limitações conhecidas

Este documento concentra divergências e lacunas observadas na implementação.
Elas não fazem parte do contexto semântico global.

- A interface ainda lê a coleção legada `games`; a migração para `matches` e
  `scoutingSessions` já é executada na base local, mas as telas precisam ser
  transferidas antes de remover a compatibilidade.
- Cartões amarelos são registrados, mas não possuem estatística no relatório.
- O cronômetro não altera o `Game.status`; a partida permanece `PENDING` após
  sua criação.
- A rota `/games/:id` existe, mas o carregamento da partida para edição ainda
  não foi implementado.
- O frontend não possui telas ou rotas de autenticação, embora a API ofereça
  login e registro.
- A conversão de exclusão lógica entre `isDeleted` e `deleted` é explícita
  apenas para times durante a sincronização.
- O `docker-compose.yml` usa `./backend` como contexto de build, embora o
  backend esteja no diretório `api/`.
