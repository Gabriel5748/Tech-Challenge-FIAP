# 🚀 Guia de Migrações do Banco de Dados com Sequelize (QuimiPort)

Este guia orienta como gerenciar, executar e reverter as migrações do banco de dados PostgreSQL do projeto utilizando o **Sequelize CLI**.

---

## 📋 Sumário
1. [Visão Geral e Arquitetura](#1-visão-geral-e-arquitetura)
2. [Estrutura de Arquivos](#2-estrutura-de-arquivos)
3. [Configuração do Ambiente (.env)](#3-configuração-do-ambiente-env)
4. [Como Aplicar as Migrações no Banco](#4-como-aplicar-as-migrações-no-banco)
5. [Como Verificar o Status das Migrações](#5-como-verificar-o-status-das-migrações)
6. [Como Reverter Migrações (Rollback)](#6-como-reverter-migrações-rollback)
7. [Como Criar Novas Migrações](#7-como-criar-novas-migrações)
8. [Rotas do UserController (Usuários)](#8-rotas-do-usercontroller-usuários)
9. [Solução de Problemas Comuns (Troubleshooting)](#9-solução-de-problemas-comuns-troubleshooting)

---

## 1. Visão Geral e Arquitetura

Anteriormente, o projeto utilizava sincronização automática (`sequelize.sync({ alter: true })`), o que não é recomendado para ambientes de homologação e produção por não registrar histórico de alterações nem permitir reversão segura.

Agora, o banco é controlado por **migrações versionadas** gerenciadas pelo `sequelize-cli`:
- Cada alteração estrutural no banco é representada por um arquivo com timestamp em `migrations/`.
- O Sequelize cria uma tabela de controle chamada `SequelizeMeta` no PostgreSQL para saber exatamente quais migrações já foram aplicadas.
- Os modelos em `src/core/models.ts` estão alinhados em tipos e chaves (UUID para usuários/grupos/permissões e inteiros para cargas/produtos).

---

## 2. Estrutura de Arquivos

```
backend/
├── .sequelizerc                                    # Mapeamento de diretórios do Sequelize CLI
├── config/
│   └── config.js                                   # Configuração de conexão com o banco via .env
├── migrations/                                     # Arquivos de migração versionados
│   ├── 20261024000001-create-usuarios.js           # Criação da tabela 'usuarios'
│   ├── 20261024000002-create-grupos.js             # Criação da tabela 'grupos'
│   ├── 20261024000003-create-permissoes.js         # Criação da tabela 'permissoes'
│   ├── 20261024000004-create-usuario-grupo.js      # Tabela pivot 'usuario_grupo'
│   ├── 20261024000005-create-grupo-permissao.js    # Tabela pivot 'grupo_permissao'
│   ├── 20261024000006-create-produto-quimico.js    # Criação da tabela 'produto_quimico'
│   └── 20261024000007-create-carga-quimica.js      # Criação da tabela 'carga_quimica'
├── src/
│   └── core/
│       ├── database.ts                             # Exportação da instância Sequelize
│       └── models.ts                               # Modelos TypeScript e Associações
├── interfaces/http/
│   ├── controllers/users/userController.ts         # Controller com CRUD completo de usuários
│   └── routers/users/users.ts                      # Rotas Express para usuários
└── package.json                                    # Scripts npm configurados
```

---

## 3. Configuração do Ambiente (.env)

O arquivo `config/config.js` lê diretamente as variáveis do arquivo `.env` na raiz do backend.

Verifique se o seu `.env` contém as credenciais corretas:

```env
API_PORT=3000
API_HOST=localhost
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=QuimiportDB
DB_USER=postgres
DB_PASSWORD=postgres

ALLOWED_HOSTS=http://localhost:8081
```

> [!NOTE]
> Se você estiver rodando o PostgreSQL através do `docker compose` com a porta mapeada para `5433:5432`, altere no `.env` o `DB_PORT=5433` e a senha correspondente (`123456`).

---

## 4. Como Aplicar as Migrações no Banco

Antes de executar, certifique-se de que o PostgreSQL está rodando e que o banco de dados especificado em `DB_NAME` já foi criado.

### Opção A: Utilizando os scripts npm (Recomendado)

Na pasta `backend`, execute:

```bash
npm run db:migrate
```

### Opção B: Utilizando npx

```bash
npx sequelize-cli db:migrate
```

### O que acontece ao executar:
1. O Sequelize conecta no PostgreSQL com as credenciais do `.env`.
2. Cria a tabela `SequelizeMeta` caso ela não exista.
3. Executa a função `up()` de cada arquivo pendente dentro de `migrations/` em ordem cronológica.
4. Registra cada migração concluída na tabela `SequelizeMeta`.

---

## 5. Como Verificar o Status das Migrações

Para checar quais migrações já foram aplicadas e quais estão pendentes:

```bash
npm run db:migrate:status
```
ou:
```bash
npx sequelize-cli db:migrate:status
```

Exemplo de saída:
```text
up 20261024000001-create-usuarios.js
up 20261024000002-create-grupos.js
up 20261024000003-create-permissoes.js
up 20261024000004-create-usuario-grupo.js
up 20261024000005-create-grupo-permissao.js
up 20261024000006-create-produto-quimico.js
up 20261024000007-create-carga-quimica.js
```

---

## 6. Como Reverter Migrações (Rollback)

### Reverter a última migração executada:
```bash
npm run db:migrate:undo
```
ou:
```bash
npx sequelize-cli db:migrate:undo
```

### Reverter até uma migração específica:
```bash
npx sequelize-cli db:migrate:undo --to 20261024000003-create-permissoes.js
```

### Reverter todas as migrações:
```bash
npm run db:migrate:undo:all
```
ou:
```bash
npx sequelize-cli db:migrate:undo:all
```

---

## 7. Como Criar Novas Migrações

Sempre que precisar alterar o banco (adicionar coluna, criar nova tabela, alterar índice):

### Criar um arquivo de migração vazio:
```bash
npm run db:migration:generate -- --name adicionar-telefone-em-usuarios
```
ou:
```bash
npx sequelize-cli migration:generate --name adicionar-telefone-em-usuarios
```

Isso gerará um arquivo em `migrations/YYYYMMDDHHMMSS-adicionar-telefone-em-usuarios.js`.

### Exemplo de implementação da migração:
```javascript
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('usuarios', 'telefone', {
      type: Sequelize.STRING(20),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('usuarios', 'telefone');
  }
};
```

Depois de editar, basta rodar:
```bash
npm run db:migrate
```

---

## 8. Rotas do UserController (Usuários)

O `UserController` foi corrigido e implementado com todas as operações CRUD e vínculo com grupos:

| Método | Rota | Descrição | Status Sucesso |
|---|---|---|---|
| `GET` | `/api/usuarios` | Lista todos os usuários e seus grupos/permissões | `200 OK` |
| `GET` | `/api/usuarios/:id` | Busca usuário específico por UUID | `200 OK` (ou `404`) |
| `POST` | `/api/usuarios` | Cadastra um novo usuário | `201 Created` |
| `PUT` | `/api/usuarios/:id` | Atualiza dados do usuário | `200 OK` |
| `DELETE` | `/api/usuarios/:id` | Remove um usuário | `204 No Content` |
| `POST` | `/api/usuarios/:id/grupos` | Atribui um grupo ao usuário | `200 OK` |

### Exemplo de Payload para Cadastro (`POST /api/usuarios`):
```json
{
  "nomeCompleto": "Gabriel Silva",
  "email": "gabriel.silva@quimiport.com",
  "dataDeContratacao": "2026-01-15T08:00:00.000Z",
  "periodoTurno": "Matutino",
  "status": "ativo",
  "gruposIds": []
}
```

### Exemplo de Atribuição de Grupo (`POST /api/usuarios/:id/grupos`):
```json
{
  "grupoId": "uuid-do-grupo-aqui"
}
```

---

## 9. Solução de Problemas Comuns (Troubleshooting)

### 1. `Connection refused at 127.0.0.1:5432`
- O serviço do PostgreSQL não está rodando ou a porta no `.env` está diferente da porta do serviço.
- Se estiver usando Docker Compose, confirme se o container está de pé com `docker compose ps` e verifique a porta exposta (ex: `5433` vs `5432`).

### 2. `database "QuimiportDB" does not exist`
- Crie a base de dados no PostgreSQL antes de rodar as migrações:
  ```sql
  CREATE DATABASE "QuimiportDB";
  ```
  Ou use o comando da CLI:
  ```bash
  npx sequelize-cli db:create
  ```

### 3. `permission denied for schema public`
- Verifique se o usuário do PostgreSQL configurado no `.env` tem privilégios de `OWNER` ou `CREATE` no banco de dados.

### 4. `type "enum_usuarios_status" already exists`
- Caso tenha rodado testes anteriores ou o banco já tenha tipos ENUM criados manualmente, basta dropar a tabela antiga ou os enums via SQL:
  ```sql
  DROP TYPE IF EXISTS "enum_usuarios_status" CASCADE;
  ```
