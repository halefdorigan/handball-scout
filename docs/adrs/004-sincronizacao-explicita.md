# ADR-004: Sincronização explícita

- **Data**: 2026-09-13
- **Status**: Aceito
- **Decisores**: Equipe do projeto
- **Tags**: sincronização, offline-first, integração, consistência

## Contexto e problema

O frontend registra primeiro no armazenamento local, mas precisa trocar os
documentos com a API quando houver conectividade. O roadmap registra que o
modo offline não garante sincronização em tempo real entre dispositivos. O
fluxo atual precisa ser simples, acionado pelo usuário e compatível com as
coleções de times, jogadores e partidas.

## Fatores de decisão

- manter o scout utilizável sem conexão;
- tornar a sincronização uma ação observável e controlável pelo usuário;
- preservar a ordem de dependência entre times, jogadores e partidas;
- permitir que a API faça upsert dos documentos recebidos.

## Opções consideradas

- Sincronização explícita sequencial com push local, resposta da API e upsert
  local.
- Sincronização automática em tempo real entre dispositivos.
- Tornar a API a única fonte de escrita e bloquear alterações offline.

## Decisão

Usaremos sincronização explícita, iniciada pela ação **Sincronizar**. O serviço
executará `teams`, `players` e `games`, nessa ordem. Para cada coleção, enviará
os documentos locais ao endpoint `/sync`, receberá os documentos processados e
fará upsert no RxDB. A arquitetura não promete sincronização em tempo real.

### Consequências positivas

- O usuário consegue trabalhar localmente e escolher quando trocar dados.
- A ordem reduz referências ausentes durante a sincronização.
- O fluxo é pequeno e compatível com os endpoints atuais da API.

### Consequências negativas

- Dados de dispositivos diferentes podem ficar divergentes até a próxima ação.
- Conflitos e falhas parciais exigem tratamento futuro.
- A conversão de exclusão lógica precisa ser mantida em cada coleção.

## Links

- [Arquitetura atual](../../ARCHITECTURE.md)
- [Serviço de sincronização](../../frontend/src/app/core/services/sync.service.ts)
- [Roadmap](../../ROADMAP.md)
