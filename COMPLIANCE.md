# Dados pessoais e responsabilidades

Este documento descreve o tratamento de dados pessoais no MVP do cadastro
global de jogadores. Ele é uma orientação técnica do produto e não substitui
a revisão jurídica, o aviso de privacidade ou os procedimentos da organização
responsável pelo uso do sistema.

## Dados coletados e finalidade

| Dado | Finalidade | Obrigatório |
| --- | --- | --- |
| Nome | Identificar o jogador no cadastro e no scout | Sim |
| Data de nascimento | Apoiar a identificação e a organização do elenco | Não |
| Altura e peso | Contextualizar o perfil esportivo | Não |
| Mão dominante | Contextualizar o perfil esportivo | Não |
| Time, número, posição e status | Representar o vínculo do jogador com cada time | No vínculo |
| `playerId` nos eventos | Preservar a autoria histórica dos eventos de jogos | Técnico |

O MVP não coleta foto, avaliações avançadas, observações livres ou histórico
detalhado. Esses itens devem passar por nova análise antes de serem incluídos.

## Armazenamento e sincronização

- O cadastro é salvo localmente no dispositivo, como parte do fluxo
  offline-first.
- A sincronização com a API envia os dados cadastrados pelo usuário para o
  ambiente configurado pela organização.
- O perfil de identidade (`Player`) é separado dos vínculos com times
  (`PlayerMembership`). Assim, número e posição não são tratados como
  atributos globais do jogador.
- A sincronização por identificador deve ser idempotente e respeitar a marca
  de exclusão lógica (`isDeleted` local e `deleted` na API).

## Retenção, arquivamento e eventos

Arquivar um jogador ou vínculo é uma exclusão lógica. O jogador arquivado e os
vínculos inativos deixam de aparecer nos cadastros ativos e nas escalações,
mas os eventos existentes continuam referenciando o `playerId` para preservar
os relatórios históricos. O MVP não implementa exclusão física automática.

## Riscos e limites do MVP

- Dados de menores podem ser informados, especialmente quando a data de
  nascimento é preenchida; a organização deve definir regras apropriadas para
  coleta, acesso e consentimento.
- O produto não deve receber categorias de dados sensíveis, documentos,
  informações médicas ou dados de contato neste cadastro.
- O armazenamento local pode existir em dispositivos compartilhados ou
  perdidos; o responsável pela operação deve aplicar bloqueio, controle de
  acesso e gestão de dispositivos adequados.
- O transporte, autenticação, autorização, backups e retenção do ambiente de
  API devem ser configurados e revisados fora deste MVP.

## Pendências jurídicas e operacionais

Antes de uso em produção, o responsável pelo produto deve confirmar a base
legal, o aviso de privacidade, o prazo de retenção, os perfis de acesso, o
registro de consentimento quando aplicável e o procedimento para incidentes.
Também deve ser definido quem é responsável pelo tratamento e como titulares
podem exercer seus direitos. Essas definições não são implementadas por este
documento.

## Privacidade, governança e solicitações

O responsável pela organização deve limitar o acesso por função, revisar os
dados periodicamente e orientar os usuários a preencher somente o necessário.
Exportação, atendimento de solicitações de acesso/correção e exclusão física
ou anonimização ainda não fazem parte do MVP. O arquivamento disponível na
interface preserva os eventos e deve ser tratado como medida operacional, não
como atendimento automático a uma solicitação legal de exclusão.
