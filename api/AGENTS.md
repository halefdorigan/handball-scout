# Instruções para a API

## Fronteira de persistência

- Apenas arquivos em `repositories/` podem usar `@InjectModel`, `Model` ou
  executar consultas e comandos Mongoose.
- Services dependem de repositórios e concentram regras de negócio; controllers
  e guards dependem apenas de services.
- Execute `npm run check:persistence-boundary` ao alterar persistência.

## Organização dos testes

- Considere `api/src/` a entrada dos módulos da API.
- Coloque testes de arquivos diretamente em `api/src/` em
  `api/src/__tests__/`.
- Coloque testes de arquivos de um módulo em
  `api/src/<módulo>/__tests__/`.
- Reserve `api/test/` exclusivamente para testes end-to-end.

## Testes unitários

- Use Jest para os testes unitários.
- Organize cada teste no formato AAA, com as seções `Arrange`, `Act` e
  `Assert` claramente separadas.
- Teste o comportamento observável e isole dependências externas, como modelos do Mongoose e serviços de autenticação, com mocks.
- Ao mockar modelos do Mongoose, simule também o encadeamento de consultas
  com `.exec()` quando o código testado o utilizar.
- Nos testes de autenticação, faça mock do `bcrypt` e da assinatura de tokens JWT.
- Coloque cada arquivo de teste na pasta `__tests__` dentro do diretório que contém o arquivo testado.
- Nomeie os testes com o sufixo `.spec.ts`. Por exemplo, o teste de
  `src/teams/teams.service.ts` deve ficar em
  `src/teams/__tests__/teams.service.spec.ts`.

## Comandos

- `npm test` — executa os testes unitários.
- `npm run test:cov` — executa os testes unitários com cobertura.
- `npm run test:e2e` — executa os testes end-to-end.
- `npm run format` — aplica o Prettier aos arquivos da API.
- `npm run format:check` — verifica o formato sem alterar arquivos.
