# ADR-009: Configuração por ambiente

- **Data**: 2026-09-13
- **Status**: Aceito
- **Decisores**: Equipe do projeto
- **Tags**: configuração, ambiente, deploy, Angular, NestJS

## Contexto e problema

A PWA usava `http://localhost:3000` diretamente nos serviços de autenticação e
sincronização. Esse endereço não funciona em produção, onde cliente e API são
publicados em uma topologia diferente. A API também precisava de perfis locais
claros sem versionar segredos.

## Fatores de decisão

- manter o endereço local simples durante o desenvolvimento;
- evitar URLs de API fixas no código da PWA;
- manter segredos e conexões fora do controle de versão;
- permitir que o container de produção receba variáveis do ambiente de execução.

## Opções consideradas

- Manter URLs absolutas em cada serviço do frontend.
- Compilar a PWA de produção com uma URL externa fixa.
- Usar ambientes Angular e uma rota relativa `/api` encaminhada pelo proxy de
  produção.

## Decisão

O frontend usa `environment.apiUrl`: desenvolvimento aponta para
`http://localhost:3000` e produção aponta para `/api`. O Nginx do container da
PWA encaminha `/api/` para o serviço `backend`, removendo o prefixo antes de
enviar a chamada ao NestJS.

A API lê o ambiente do processo. Os comandos de desenvolvimento e produção
carregam, quando presentes, `.env.development` e `.env.production`,
respectivamente. Os arquivos `.env.*.example` documentam as variáveis exigidas
sem incluir credenciais reais.

## Consequências

- Serviços do frontend não conhecem o host de produção da API.
- Deploys de produção precisam colocar PWA e API na mesma origem com o proxy
  `/api`, ou fornecer uma configuração Nginx equivalente.
- A execução local requer copiar o arquivo de exemplo de desenvolvimento para
  o arquivo ignorado correspondente.
- O Compose publica a PWA em `http://localhost:8080` e exige `JWT_SECRET` no
  ambiente que o executa.

## Links

- [Ambientes Angular](../../frontend/src/environments/)
- [Configuração Nginx](../../frontend/nginx.conf)
- [Exemplos de ambiente da API](../../api/.env.development.example)
