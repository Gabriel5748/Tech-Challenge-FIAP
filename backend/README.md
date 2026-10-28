# QuimiPort API - Backend Tech Challenge

API RESTful para gestão portuária de produtos químicos, cargas perigosas, usuários e grupos de permissões, desenvolvida em Node.js com TypeScript.

---

## 1. Justificativa da Escolha do Framework

A aplicação foi construída sobre o **Node.js** utilizando **Express** em conjunto com **TypeScript**. As justificativas para essa escolha incluem:

- **Maturidade e Confiabilidade**: O Express é o framework mais consolidado do ecossistema Node.js, com suporte abrangente a middlewares, padronização de tratamento de erros e integração direta com bibliotecas de log estruturado (Pino) e documentação OpenAPI/Swagger.
- **Arquitetura Limpa (Clean Architecture / DDD)**: O Express oferece flexibilidade sem impor estruturas rígidas e opinativas, permitindo a separação estrita de responsabilidades em camadas desacopladas:
  - `interfaces`: roteamento HTTP, controllers e middlewares;
  - `application`: casos de uso isolados contendo exclusivamente as regras de negócio;
  - `domain`: entidades, interfaces de repositórios e regras de domínio;
  - `infrastructure`: persistência com Sequelize/PostgreSQL, logs e documentação OpenAPI.
- **Tipagem Estática e Segurança em Tempo de Compilação**: O TypeScript assegura contratos consistentes entre as camadas, prevenindo falhas de execução e inconsistência de tipos.
- **Documentação com Zod e OpenAPI 3.0**: Schemas declarativos reutilizáveis para documentar endpoints no Swagger UI (`/api/docs`).

---

## 2. Estrutura do Projeto

```text
backend/
├── application/
│   └── use-cases/
│       ├── cargaQuimica/        # Registrar, listar, buscar, atualizar status, bloquear, liberar, cancelar
│       ├── produtoQuimico/      # Cadastrar, listar, buscar, atualizar, inativar
│       └── AtribuirUsuarioGrupo.ts
├── config/
│   └── config.js                # Configuração do Sequelize CLI
├── infrastructure/
│   ├── frameworks/
│   │   ├── database.ts          # Instância do Sequelize
│   │   ├── openapi/             # Schemas Zod e rotas do Swagger OpenAPI
│   │   └── settings.ts          # Variáveis de ambiente
│   ├── logger/                  # Logger estruturado (Pino)
│   └── repositories/            # Implementações dos repositórios
├── interfaces/
│   └── http/
│       ├── controllers/         # Adaptadores de entrada HTTP
│       ├── middlewares/         # Log de requisições e tratamento global de erros
│       └── routers/             # Rotas Express
├── migrations/                  # Migrações versionadas do banco de dados
├── src/
│   ├── core/                    # Modelos do Sequelize e associações
│   └── domain/                  # Entidades, interfaces e regras de domínio
└── server.ts                    # Inicialização do servidor Express
```

---

## 3. Máquina de Estados e Transições de Status da Carga Química

A gestão operacional de cargas químicas segue um controle rigoroso de transições de status.

### 3.1 Status Permitidos

- `Registrada` (Status inicial padrão)
- `Em análise`
- `Em inspeção`
- `Liberada`
- `Bloqueada`
- `Em movimentação`
- `Finalizada` (Estado terminal)
- `Cancelada` (Estado terminal)

### 3.2 Tabela de Transições de Status

| Status Atual | Próximos Status Permitidos | Regras e Condições Específicas |
|---|---|---|
| **Registrada** | `Em análise`, `Cancelada` | Produto associado deve estar ativo; quantidade > 0; responsável técnico obrigatório. |
| **Em análise** | `Em inspeção`, `Cancelada` | Análise documental e pré-requisitos técnicos. |
| **Em inspeção** | `Liberada`, `Bloqueada`, `Cancelada` | Para transitar para `Liberada`, exige documentação obrigatória validada. Não pode ir direto para `Finalizada`. |
| **Liberada** | `Em movimentação`, `Cancelada` | Carga liberada com documentação apta para movimentação portuária. |
| **Bloqueada** | `Cancelada` | Carga bloqueada **não pode entrar em movimentação**. |
| **Em movimentação** | `Finalizada` | Finalização do ciclo operacional da carga. |
| **Finalizada** | *(Nenhum)* | **Estado Terminal**: Não sofre novas alterações. |
| **Cancelada** | *(Nenhum)* | **Estado Terminal**: Uma carga cancelada **não pode ser liberada** nem alterada. |

### 3.3 Diagrama de Fluxo (State Machine)

```text
[Registrada] ──────> [Em análise] ──────> [Em inspeção] ──────> [Liberada] ──────> [Em movimentação] ──────> [Finalizada] (Terminal)
     │                     │                     │                    │
     │                     │                     ├────────> [Bloqueada]
     │                     │                     │               │
     ▼                     ▼                     ▼               ▼
[Cancelada] <────────────────────────────────────────────────────┘ (Terminal)
```

---

## 4. Endpoints da API REST

A API disponibiliza endpoints com e sem o prefixo `/api` para máxima compatibilidade:

### 4.1 Produtos Químicos
- `POST /api/produtos-quimicos` (ou `/produtos-quimicos`): Cadastrar produto químico.
- `GET /api/produtos-quimicos` (ou `/produtos-quimicos`): Listar produtos químicos.
- `GET /api/produtos-quimicos/:id` (ou `/produtos-quimicos/:id`): Buscar produto químico por ID.
- `PUT /api/produtos-quimicos/:id` (ou `/produtos-quimicos/:id`): Atualizar produto químico completo.
- `PATCH /api/produtos-quimicos/:id/inativar` (ou `DELETE /api/produtos-quimicos/:id`): Inativar produto químico.

### 4.2 Cargas Químicas
- `POST /api/cargas-quimicas` (ou `/cargas-quimicas` / `/api/cargas`): Registrar nova carga química.
- `GET /api/cargas-quimicas` (ou `/cargas-quimicas` / `/api/cargas`): Listar cargas químicas (filtro opcional: `?nome=...`).
- `GET /api/cargas-quimicas/:id` (ou `/cargas-quimicas/:id` / `/api/cargas/:id`): Buscar carga química por ID.
- `PATCH /api/cargas-quimicas/:id/status` (ou `/api/cargas/:id/status`): Atualizar status da carga com validação de transição.
- `PATCH /api/cargas-quimicas/:id/bloquear` (ou `/api/cargas/:id/bloquear`): Bloquear carga química.
- `PATCH /api/cargas-quimicas/:id/liberar` (ou `/api/cargas/:id/liberar`): Liberar carga química (valida documentação).
- `PATCH /api/cargas-quimicas/:id/cancelar` (ou `/api/cargas/:id/cancelar`): Cancelar carga química.

### 4.3 Usuários e Grupos
- `GET /api/usuarios`: Listar todos os usuários com seus grupos.
- `POST /api/usuarios`: Cadastrar novo usuário (sem FK direta de grupo).
- `GET /api/usuarios/:id`: Buscar usuário por ID.
- `PUT /api/usuarios/:id`: Atualizar dados do usuário.
- `DELETE /api/usuarios/:id`: Remover usuário.
- `POST /api/usuarios/:id/grupos`: Atribuir grupo ao usuário através da tabela intermediária `usuario_grupo`.
- `GET /api/grupos`: Listar todos os grupos de permissões.
- `POST /api/grupos`: Cadastrar novo grupo.

---

## 5. Executando o Projeto

### Pré-requisitos
- Node.js 18+ instalado
- PostgreSQL rodando localmente ou via Docker

### Instalação e Execução
```bash
# Instalar dependências
npm install

# Executar migrações do banco
npm run db:migrate

# Iniciar aplicação em modo desenvolvimento
npm start
```

Documentação interativa Swagger UI acessível em:
`http://localhost:3000/api/docs`
