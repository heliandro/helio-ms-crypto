# Microserviço de Criptografia em Node.js

![Licença](https://img.shields.io/badge/licença-MIT-blue.svg)
[![Nodejs Pipeline](https://github.com/heliandro/helio-ms-crypto/actions/workflows/nodejs-pipeline.yml/badge.svg)](https://github.com/heliandro/helio-ms-crypto/actions/workflows/nodejs-pipeline.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=heliandro_helio-ms-crypto&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=heliandro_helio-ms-crypto)

Este é um microserviço em Node.js seguindo a arquitetura hexagonal (Ports & Adapters) que oferece recursos de criptografia e descriptografia para suas aplicações.

## Arquitetura Hexagonal

Este projeto adota a arquitetura hexagonal para garantir uma separação clara entre os componentes de domínio e as interfaces de entrada/saída. As camadas são organizadas da seguinte forma:

- **Application/Use Cases**: Contém os casos de uso da aplicação.
- **Domain**: Define as entidades e regras de negócios centrais.
- **Infra/Repository**: Implementa os repositórios para acesso a dados.
- **Infra/Adapters**: Implementa as interfaces de entrada/saída, como a API REST e o armazenamento em arquivo.

## Funcionalidades

- [x] Geração dos pares de chaves pública e privada.
- [x] Armazenamento de chaves em um sistema de arquivos.
- [x] Recuperação da chave pública e privada.
- [x] Criptografia de dados.
- [x] Descriptografia de dados.
- [x] CLI para integração.
- [ ] API RESTful para integração.
- [ ] Documentação com Swagger.
- [ ] Container/Cloud Like.


## Pré-requisitos

- Node.js (v20+)
- npm (ou Yarn)

## Instalação

Instale as dependências:

   ```bash
   npm install
   ```

## Utilização

1. Inicie o cli
    ```bash
    npm run start:cli
    ```

2. Gere o par de chaves de criptografia:
    ```bash
    generate
    ```

3. Recupere a chave publica:
    ```bash
    get public
    ```
4. Faça a encriptação de um dado:
    ```bash
    encrypt "{ name: \"heliandro\" }"
    ```
5. Faça a desencriptação de um dado:
    ```bash
    decrypt "ZDnjmkjlZGv4O7p/vRW3yCoEphgLQLLZTS9PMrfEFWnc2Hp7jOvujnmlEpWtZmuEXmRJnPvRlYlXoDUKVO+QxPxOT0k1z1W0HJTIbpD5WYbEt3ONgkpmwVk4Y1ZFYn9sNdQf5DQMuStkFLlMhsBS5zw0qq4JQ0l8nYygD3N8yVc="
    ```

## Testes

Execute os testes com o seguinte comando:

```bash
npm run test
```

