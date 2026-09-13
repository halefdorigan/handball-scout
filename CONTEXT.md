# Contexto do projeto

> Linguagem ubíqua e contexto semântico global do Scout Court.

Última verificação: 13 de setembro de 2026.

Este arquivo contém apenas informações necessárias para interpretar o domínio
do produto de forma consistente entre funcionalidades. Não é um catálogo de
arquitetura, fluxos, rotas, API ou detalhes de implementação.

## Escopo do produto

**Scout Court** é um espaço de trabalho offline-first para profissionais que
acompanham handebol. O produto permite cadastrar times, jogadores e partidas,
registrar eventos durante o scout e consultar relatórios de desempenho.

O roadmap inclui scout simultâneo, cadastro de usuários e redefinição de senha.
Contas e redefinição de senha ainda não fazem parte da jornada atual do produto.

## Linguagem ubíqua

| Termo canônico | Termos usados | Definição |
| --- | --- | --- |
| **Scout Court** | `Scout Court` | Nome do produto. |
| **scout** | `Scout`, `scouting` | Acompanhamento de uma partida com registro de eventos. |
| **sessão de scout** | `ScoutingSession` | Registro de scout associado a uma única partida, que contém o cronômetro e os eventos. |
| **time** | `Team`, `Time`, `Times` | Grupo esportivo cadastrado e participante de uma partida. |
| **elenco** | `Roster`, `Jogadores` | Conjunto de jogadores associados a um time; não é uma entidade própria. |
| **jogador** | `Player`, `Jogador` | Atleta pertencente a um time. |
| **número da camisa** | `Nº` | Número usado para identificar o jogador durante o scout. |
| **posição** | `Goleiro`, `Ponta`, `Armador`, `Pivô` | Função esportiva cadastrada para o jogador. |
| **partida** | `Game`, `jogo`, `Jogos` | Confronto entre dois times que pode ser acompanhado e analisado. |
| **time da casa** | `Casa`, `Time A` | Primeiro participante da partida. |
| **time visitante** | `Visitante`, `Time B` | Segundo participante da partida. |
| **evento de partida** | `evento` | Ocorrência registrada durante o scout. |
| **ação de scout** | `GOL`, `FORA`, `DEFESA`, `AMARELO`, `2 MIN` | Ação esportiva escolhida para registro. |
| **registro coletivo** | `COLETIVO` | Evento atribuído ao time sem identificar um jogador. |
| **gol** | `GOL` | Evento que soma um ponto ao placar. |
| **arremesso para fora** | `FORA` | Finalização sem gol. |
| **defesa** | `DEFESA` | Ação defensiva de um time. |
| **advertência amarela** | `AMARELO` | Cartão amarelo recebido por um time. |
| **suspensão de 2 minutos** | `2 MIN` | Penalidade temporária de um jogador ou time. |
| **placar** | `placar` | Resultado formado pela contagem de gols de cada time. |
| **cronômetro** | `cronômetro` | Tempo de jogo acompanhado durante o scout. |
| **status da partida** | `pendente`, `em andamento`, `finalizada` | Estado atual da partida. |
| **relatório de partida** | `relatório` | Leitura consolidada do placar e dos eventos registrados. |
| **tag** | `tag` | Rótulo livre para classificar um time ou uma partida. |
| **sincronização** | `Sincronizar` | Atualização dos dados locais com a cópia remota. |

## Invariantes do domínio

- Uma partida relaciona um time da casa e um time visitante.
- Um jogador pertence a um único time por vez.
- Um evento pertence a uma partida e a um time, podendo também identificar um
  jogador.
- Uma sessão de scout pertence a uma única partida.
- O placar é derivado dos eventos de gol, não de um valor independente.
- O trabalho local pode continuar sem conectividade; a sincronização é uma
  capacidade posterior do mesmo dado.

## Documentação relacionada

- [`ARCHITECTURE.md`](ARCHITECTURE.md) — componentes, fronteiras, persistência,
  fluxo técnico e restrições de deploy.
- [`docs/adrs/`](docs/adrs/) — justificativas das decisões arquiteturais.
- [`docs/flows/`](docs/flows/) — fluxos de navegação e uso da aplicação.
- [`docs/known-limitations.md`](docs/known-limitations.md) — limitações e
  divergências conhecidas da implementação.
- [`README.md`](README.md) — execução local e visão geral do repositório.
