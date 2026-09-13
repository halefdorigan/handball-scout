# ADR-007: Fronteira de persistência por repositórios

## Status

Aceita.

## Contexto

Effects do frontend acessavam RxDB diretamente e os services da API dependiam
diretamente de modelos Mongoose. Isso acoplava casos de uso aos drivers.

## Decisão

Consultas e comandos de documentos são permitidos apenas em repositórios.
Services orquestram regras e sincronização; UI, effects, controllers e guards
dependem de seus contratos. A criação e o registro de schemas do banco local
continuam como bootstrap técnico, sem CRUD de documentos.

## Consequências

Testes de services mockam repositórios, e uma verificação automatizada impede
novos acessos diretos fora dessa fronteira.
