# Fluxos da aplicação

Este documento descreve jornadas de uso e navegação. Conceitos de domínio
devem ser consultados no [`CONTEXT.md`](../../CONTEXT.md); a implementação
técnica está em [`ARCHITECTURE.md`](../../ARCHITECTURE.md).

## Navegação

| Rota | Tela | Responsabilidade |
| --- | --- | --- |
| `/dashboard` | Visão geral / Início | Totais e partidas recentes. |
| `/teams` | Times | Lista de times e sincronização. |
| `/teams/new` | Novo time | Criação de time. |
| `/teams/:id` | Editar time | Dados do time e jogadores. |
| `/games` | Jogos | Lista de partidas. |
| `/games/new` | Novo jogo | Criação de partida. |
| `/games/:id` | Partida | Detalhe/edição da partida. |
| `/games/:id/scout` | Scout ao vivo | Cronômetro, placar e eventos. |
| `/dashboard/report/:id` | Relatório | Placar e estatísticas da partida. |
| `/` | — | Redireciona para `/dashboard`. |

## Cadastro de elenco

1. Abra **Times** e crie um time.
2. Informe nome e cor de identificação.
3. Abra o time salvo e adicione jogadores com nome, número e posição.
4. Para remover o time da lista, confirme a exclusão lógica.

## Cadastro de partida

1. Abra **Jogos** e crie uma partida.
2. Informe nome, data, hora e tags.
3. Selecione o time da casa e o time visitante.
4. Salve a partida para iniciar o registro de eventos.

## Scout ao vivo

1. Abra o scout da partida.
2. Inicie ou pause o cronômetro.
3. Escolha uma ação para Casa ou Visitante.
4. Associe o evento a um jogador ou selecione **Coletivo**.
5. Use **Desfazer último** para remover o evento mais recente.

## Relatório

O dashboard abre o relatório das cinco partidas recentes. O relatório mostra o
placar, estatísticas gerais e gols por jogador a partir dos eventos registrados.

## Sincronização

1. Abra **Times** quando houver conectividade.
2. Acione **Sincronizar**.
3. O sistema troca os dados locais com a API e atualiza a base local.

A sincronização não é em tempo real. Os detalhes técnicos da ordem e da
reconciliação estão em [`ARCHITECTURE.md`](../../ARCHITECTURE.md).
