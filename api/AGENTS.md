# Instruções para a API

## Testes unitários

- Use Jest para os testes unitários.
- Organize cada teste no formato AAA, com as seções `Arrange`, `Act` e `Assert` claramente separadas.
- Teste o comportamento observável e isole dependências externas, como modelos do Mongoose e serviços de autenticação, com mocks.
- Coloque cada arquivo de teste na pasta `__tests__` dentro do diretório que contém o arquivo testado.
- Nomeie os testes com o sufixo `.spec.ts`. Por exemplo, o teste de `src/teams/teams.service.ts` deve ficar em `src/teams/__tests__/teams.service.spec.ts`.
- O diretório `test/` é reservado para testes end-to-end.

## Comandos

- `npm test` — executa os testes unitários.
- `npm run test:cov` — executa os testes unitários com cobertura.
- `npm run test:e2e` — executa os testes end-to-end.
