# Handball Scout

Aplicativo de scout de handebol, que busca auxiliar times no registros de treinos e de jogos visando a obtenção de métricas gerais e específicas.

## Entregas concluídas

### Homepage e autenticação

- [x] Landing page pública com apresentação do Scout Court e suas

  funcionalidades.
- [x] Navegação para as telas de login e registro.
- [x] Formulários de login e registro conectados ao serviço de autenticação.
- [x] Acesso preservado ao dashboard interno em `/dashboard`.

## Roadmap

### Autenticação

Fluxo de autenticação com JWT, Bearer token, guards de rota de frontend e
middlewares de autenticação no backend — concluído.

### Cadastro de novos usuários

Permitir que novos usuários criem uma conta para acessar o aplicativo.

### Redefinição de senha

Permitir que usuários redefinam a senha com segurança quando não conseguirem  
acessar a conta.

### Multi-tenancy

Cada usuário administrador deve possuir um banco de dados. Deve prever a migração de uma base de dados single database em multi database.

### Cargos de usuário 

Admin, scouter, jogador.  Cada um deve estar vinculado a um tenant

### Scout simultâneo

Busca permitir que duas pessoas registrem o mesmo jogo ou treino — uma  
registrando o time da casa (titular) e outra o time visitante (reserva). Se  
houver apenas um usuário no jogo, ele deve poder registrar eventos de ambos os  
times.

> **Disclaimer — modo offline:** no modo offline, o scout simultâneo não  
> garante sincronização em tempo real entre dispositivos. Os eventos devem ser  
> sincronizados quando a conexão for restabelecida, com tratamento de possíveis  
> conflitos.

### Privacidade e governança

- Definir base legal, aviso de privacidade, consentimento quando aplicável e
responsável pelo tratamento.
- Implementar exportação, correção, anonimização e exclusão física conforme as
regras da organização.
- Definir perfis de acesso, auditoria, retenção e resposta a incidentes.

### Evolução do cadastro de jogadores

- Avaliar suporte a foto com consentimento e controles de retenção.
- Ampliar a preservação e a visualização do histórico por jogador e por time.
- Adicionar avaliações avançadas e observações somente após definir finalidade,
permissões e política de retenção.
