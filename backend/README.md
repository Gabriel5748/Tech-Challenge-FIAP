# QuimiPort API - Backend Tech Challenge (Fase 2)

API RESTful para gestão portuária de produtos químicos, cargas perigosas, usuários e grupos de permissões, desenvolvida em **Node.js** com **TypeScript** e **Clean Architecture**.

---

## 1. Contexto do Problema e Descrição da Solução

O **QuimiPort** é uma solução concebida para atuar no controle e rastreabilidade logística de cargas químicas em ambiente portuário, inspirado nas operações do Porto de Santos.
Historicamente, o manuseio e liberação de substâncias perigosas enfrentam riscos decorrentes de processos manuais e descentralizados:
- Risco de movimentação de cargas quimicamente incompatíveis ou sem documentação de segurança validada (ex.: FISPQ);
- Falta de rastreabilidade do ciclo de vida das cargas (da chegada à armazenagem, movimentação ou cancelamento);
- Dificuldade no controle de permissões e perfis operacionais.

A **API QuimiPort** resolve esses desafios ao prover:
1. **Catálogo de Produtos Químicos**: cadastro controlado, classificação de risco (ONU), compatibilidade e inativação lógica.
2. **Ciclo Operacional de Cargas Químicas**: registro atrelado a produtos ativos, validação de documentação obrigatória e máquina de estados para controle estrito de transições de status.
3. **Controle de Acesso**: gestão de usuários e grupos de permissões associados via tabela intermediária.
4. **Observabilidade e Documentação**: logs estruturados com mascaramento de dados sensíveis e documentação interativa OpenAPI 3.0 via Swagger UI.

---

## 2. Tecnologias Utilizadas

- **Runtime**: Node.js (v20+ / v22 LTS)
- **Linguagem**: TypeScript 5+ (ES2022)
- **Framework Web**: Express 5
- **ORM / Persistência**: Sequelize 6 com driver `pg` (PostgreSQL 16)
- **Migrações de Banco**: Sequelize CLI (versionamento de schema)
- **Validação e OpenAPI**: Zod e `@asteasolutions/zod-to-openapi`
- **Documentação de API**: Swagger UI Express (`/api/docs`) e especificação OpenAPI 3.0 (`documentacao/openapi.yaml`)
- **Logging e Observabilidade**: Pino, Pino-HTTP e Pino-Pretty (com streams para console e arquivos em `logs/`)
- **Testes Automatizados**: Vitest e Supertest (240+ testes unitários e de integração)
- **Containerização**: Docker e Docker Compose (`Dockerfile` e `docker-compose.yml`)
- **CI/CD**: GitHub Actions (`.github/workflows/ci.yml`)

---

## 3. Decisões Arquiteturais e Justificativa do Framework

### 3.1 Justificativa da Escolha do Framework (Express + TypeScript)
- **Maturidade e Confiabilidade**: O Express é o framework mais estável e difundido do ecossistema Node.js, com ecossistema completo de middlewares, tratamento centralizado de erros e facilidade de integração com bibliotecas de log e documentação.
- **Aderência à Clean Architecture e DDD**: Por ser minimalista e não opinativo, o Express viabiliza a separação estrita de responsabilidades sem acoplar regras de negócio ao framework HTTP.
- **Tipagem Estática**: O TypeScript garante contratos estritos entre use cases, repositórios e controllers, evitando erros de runtime.

### 3.2 Organização em Camadas

```text
backend/
├── application/
│   └── use-cases/            # Casos de uso isolados (regras de negócio puras)
│       ├── cargaQuimica/     # Registrar, listar, buscar, atualizar status, bloquear, liberar, cancelar
│       ├── produtoQuimico/   # Cadastrar, listar, buscar, atualizar, inativar
│       └── AtribuirUsuarioGrupo.ts
├── config/                   # Configurações do Sequelize CLI (config.js)
├── infrastructure/
│   ├── frameworks/           # Instâncias de infra (database.ts, openapi/, settings.ts)
│   ├── logger/               # Logger estruturado Pino (console + arquivos)
│   └── repositories/         # Implementações de persistência com Sequelize
├── interfaces/
│   └── http/
│       ├── controllers/      # Adaptadores HTTP (recebem Request e retornam Response)
│       ├── middlewares/      # Logging HTTP e ErrorHandler global
│       └── routers/          # Definição de rotas Express
├── migrations/               # Migrações versionadas com histórico de schema
├── src/
│   ├── core/                 # Modelos Sequelize e associações relacionais
│   └── domain/               # Entidades de domínio, interfaces e state machine
├── tests/                    # Testes automatizados (domínio, use cases e integração)
├── Dockerfile                # Imagem Docker da aplicação
├── docker-compose.yml        # Orquestração da API e PostgreSQL
├── package.json              # Dependências e scripts npm
└── server.ts                 # Ponto de entrada do servidor Express
```

---

## 4. Banco de Dados e Modelagem de Dados

### 4.1 Justificativa do Banco Relacional (PostgreSQL)
A escolha do **PostgreSQL** é justificada por:
- Integridade referencial forte (chaves estrangeiras entre cargas e produtos, usuários e grupos);
- Conformidade ACID para operações críticas de liberação e movimentação de cargas;
- Suporte a tipos nativos estruturados (`JSONB` para armazenamento flexível de documentos obrigatórios e metadados de inspeção).

### 4.2 Tabelas e Relacionamentos

1. **`produto_quimico`**:
   - `id` (INTEGER, PK, AutoIncrement)
   - `nome` (VARCHAR, Not Null)
   - `formula` (VARCHAR)
   - `descricao` (TEXT)
   - `numero_onu` (VARCHAR)
   - `classe_risco` (VARCHAR, Not Null)
   - `grupo_compatibilidade` (VARCHAR)
   - `ativo` (BOOLEAN, Default True - inativação lógica)
   - `created_at`, `updated_at` (TIMESTAMP)

2. **`carga_quimica`**:
   - `id` (INTEGER, PK, AutoIncrement)
   - `codigo` (VARCHAR)
   - `nome` (VARCHAR, Not Null)
   - `formula` (VARCHAR)
   - `produto_quimico_id` (INTEGER, FK -> `produto_quimico.id`, ON DELETE SET NULL)
   - `quantidade` (DECIMAL, Not Null)
   - `unidade_medida` (VARCHAR)
   - `origem` (VARCHAR)
   - `destino` (VARCHAR)
   - `responsavel_tecnico` (VARCHAR, Not Null)
   - `documentacao_obrigatoria` (JSONB)
   - `status` (VARCHAR, Default 'Registrada')
   - `data_entrada` (TIMESTAMP)
   - `created_at`, `updated_at` (TIMESTAMP)

3. **`usuarios`**, **`grupos`**, **`permissoes`**, **`usuario_grupo`**, **`grupo_permissao`**:
   - Controle de usuários, grupos operacionais e permissões granulares via tabelas associativas N:N.

### 4.3 Evolução Futura dos Dados
- Particionamento por data de entrada para histórico de auditoria de cargas;
- Tabela dedicada de eventos de transição (`historico_status_carga`) para compliance regulatório;
- Integração com sistemas de balança e sensores IoT portuários.

---

## 5. Máquina de Estados das Cargas Químicas

A gestão operacional de cargas segue regras estritas de transição de status.

### 5.1 Status Permitidos
- `Registrada` (Inicial)
- `Em análise`
- `Em inspeção`
- `Liberada`
- `Bloqueada`
- `Em movimentação`
- `Finalizada` (Terminal)
- `Cancelada` (Terminal)

### 5.2 Tabela de Transições de Status

| Status Atual | Próximos Status Permitidos | Regras e Condições Específicas |
|---|---|---|
| **Registrada** | `Em análise`, `Cancelada` | Produto associado deve estar ativo; quantidade > 0; responsável técnico obrigatório. |
| **Em análise** | `Em inspeção`, `Cancelada` | Análise documental e triagem operacional. |
| **Em inspeção** | `Liberada`, `Bloqueada`, `Cancelada` | Para transitar para `Liberada`, exige documentação obrigatória validada. Não pode ir direto para `Finalizada`. |
| **Liberada** | `Em movimentação`, `Cancelada` | Carga apta para trânsito e carregamento no terminal. |
| **Bloqueada** | `Cancelada` | Carga bloqueada **não pode entrar em movimentação**. |
| **Em movimentação** | `Finalizada` | Conclusão do transporte e entrega. |
| **Finalizada** | *(Nenhum)* | **Estado Terminal**: Carga finalizada não sofre novas alterações. |
| **Cancelada** | *(Nenhum)* | **Estado Terminal**: Carga cancelada **não pode ser liberada** nem reativada. |

### 5.3 Diagrama de Transição (State Machine)

```text
[Registrada] ──────> [Em análise] ──────> [Em inspeção] ──────> [Liberada] ──────> [Em movimentação] ──────> [Finalizada] (Terminal)
     │                     │                     │                    │
     │                     │                     ├────────> [Bloqueada]
     │                     │                     │               │
     ▼                     ▼                     ▼               ▼
[Cancelada] <────────────────────────────────────────────────────┘ (Terminal)
```

---

## 6. Endpoints da API REST

A API disponibiliza endpoints padronizados com compatibilidade com e sem prefixo `/api`:

### 6.1 Produtos Químicos
- `POST /api/produtos-quimicos`: Cadastrar produto químico (nome e classe de risco obrigatórios).
- `GET /api/produtos-quimicos`: Listar todos os produtos químicos.
- `GET /api/produtos-quimicos/:id`: Buscar produto químico por ID numérico.
- `PUT /api/produtos-quimicos/:id`: Atualizar dados do produto químico.
- `PATCH /api/produtos-quimicos/:id/inativar`: Inativar logicamente o produto químico (alias: `DELETE`).

### 6.2 Cargas Químicas
- `POST /api/cargas-quimicas`: Registrar nova carga química (produto ativo, qtd > 0, responsável técnico).
- `GET /api/cargas-quimicas`: Listar cargas químicas (filtro opcional por nome `?nome=...`).
- `GET /api/cargas-quimicas/:id`: Buscar carga química por ID.
- `PATCH /api/cargas-quimicas/:id/status`: Atualizar status da carga com validação da máquina de estados.
- `PATCH /api/cargas-quimicas/:id/bloquear`: Bloquear carga química (transita para `Bloqueada`).
- `PATCH /api/cargas-quimicas/:id/liberar`: Liberar carga química (valida documentação obrigatória).
- `PATCH /api/cargas-quimicas/:id/cancelar`: Cancelar carga química (transita para `Cancelada`).

### 6.3 Usuários e Grupos
- `GET /api/usuarios`: Listar usuários e seus respectivos grupos.
- `POST /api/usuarios`: Cadastrar novo usuário (sem FK direta de grupo).
- `GET /api/usuarios/:id`: Buscar usuário por UUID.
- `PUT /api/usuarios/:id`: Atualizar dados do usuário.
- `DELETE /api/usuarios/:id`: Remover usuário.
- `POST /api/usuarios/:id/grupos`: Atribuir grupo ao usuário via tabela intermediária `usuario_grupo`.
- `GET /api/grupos`: Listar todos os grupos de acesso.
- `POST /api/grupos`: Cadastrar novo grupo de acesso.

---

## 7. Como Configurar e Executar

### 7.1 Configuração das Variáveis de Ambiente
Copie o arquivo de exemplo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Conteúdo padrão do arquivo `.env`:
```env
API_PORT=3000
API_HOST=localhost
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=QuimiportDB
DB_NAME_TEST=QuimiportDB_test
DB_USER=postgres
DB_PASSWORD=postgres

ALLOWED_HOSTS=http://localhost:8081
LOG_DB_QUERIES=false
```

### 7.2 Execução Local (sem Docker)

1. Certifique-se de que o **Node.js 20+** e o **PostgreSQL** estão instalados e rodando.
2. Crie o banco de dados principal e de testes no PostgreSQL:
   ```sql
   CREATE DATABASE "QuimiportDB";
   CREATE DATABASE "QuimiportDB_test";
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Execute as migrações:
   ```bash
   npm run db:migrate
   ```
5. Inicie a aplicação:
   ```bash
   npm start
   ```
   A API estará rodando em `http://localhost:3000`.

### 7.3 Execução com Docker e Docker Compose

Para subir a aplicação completa e o banco de dados PostgreSQL containerizados:

```bash
# Na pasta backend/
docker compose up -d
```

O compose executa:
- O banco PostgreSQL na porta `5433` (mapeada internamente para `5432`) com volume persistente `postgres_dados`.
- O healthcheck do PostgreSQL antes de inicializar o serviço da API.
- A API na porta `3000`.

Para parar o ambiente:
```bash
docker compose down
```

---

## 8. Testes Automatizados

A suíte de testes utiliza o **Vitest** e **Supertest**, cobrindo 100% dos cenários e regras de negócio exigidos no desafio:
- Cadastro e validação de produtos químicos (bloqueio sem nome, sem classe de risco, status inválido);
- Registro de carga química (bloqueio sem produto associado, produto inativo, quantidade <= 0, sem responsável técnico);
- Validação e bloqueio de liberação sem documentação obrigatória;
- Todas as transições válidas da máquina de estados;
- Bloqueio de todas as transições proibidas (carga bloqueada para movimentação, cancelada para liberada, inspeção direto para finalizada, alteração em estados terminais);
- Testes unitários, de casos de uso e testes de integração com banco de dados.

Para executar todos os testes:
```bash
npm test
```

Para executar a compilação do TypeScript (build check):
```bash
npm run build
```

---

## 9. Documentação da API

- **Swagger UI Interativo**: acessível pelo navegador em `http://localhost:3000/api/docs`.
- **JSON OpenAPI**: acessível em `http://localhost:3000/api/docs.json`.
- **Especificação OpenAPI em arquivo estático**: localizada em `documentacao/openapi.yaml`.

---

## 10. Pipeline de CI/CD (GitHub Actions)

O pipeline em `.github/workflows/ci.yml` é executado a cada push e pull request na branch `main`:
1. **Instalação**: `npm ci` com cache de dependências;
2. **Build**: compilação do projeto com TypeScript (`npm run build`);
3. **Banco de Testes e Migrações**: inicialização de container PostgreSQL e execução de migrações (`npm run db:migrate`);
4. **Testes Automatizados**: execução completa da suíte de testes com Vitest (`npm test`);
5. **Validação de OpenAPI**: verificação do arquivo `openapi.yaml` via Swagger CLI;
6. **Docker**: validação do `docker-compose.yml` e compilação do `Dockerfile`.

---

## 11. Integrantes do Grupo

- Gabriel Santos
- *(Demais integrantes do grupo conforme entrega acadêmica FIAP)*
