# QuimiPort - Tech Challenge FIAP (Fase 2)

Sistema de Gerenciamento e Controle de Cargas Químicas e Produtos Perigosos em Ambiente Portuário.

---

## Sumário da Entrega - Fase 2

Nesta segunda fase do Tech Challenge, o planejamento conceitual da Fase 1 foi transformado em uma **API backend funcional completa** desenvolvida em **Node.js** com **TypeScript**, banco relacional **PostgreSQL**, containerização com **Docker**, testes automatizados e pipeline de integração contínua com **GitHub Actions**.

---

## 1. Contexto e Solução

O **QuimiPort** informatiza as operações de entrada, triagem, inspeção, liberação, movimentação e cancelamento de cargas químicas no ambiente portuário (inspirado nas operações do Porto de Santos).

Principais capacidades implementadas:
- Cadastro e manutenção de produtos químicos com código ONU, classe de risco e grupo de compatibilidade;
- Registro de cargas químicas vinculadas obrigatoriamente a produtos químicos ativos;
- Controle de ciclo de vida operacional com máquina de estados finitos (State Machine);
- Validação documental obrigatória (ex.: FISPQ, licenças) para liberação;
- Controle de acesso baseado em usuários e grupos operacionais;
- Documentação interativa da API via Swagger UI (`/api/docs`);
- Suíte completa de testes automatizados unitários e de integração.

---

## 2. Estrutura do Repositório

```text
Tech-Challenge-FIAP/
├── .github/
│   └── workflows/
│       └── ci.yml               # Pipeline de CI/CD automatizado no GitHub Actions
├── backend/                     # API RESTful em Node.js / TypeScript
│   ├── application/use-cases/   # Casos de uso de cargas e produtos
│   ├── config/                  # Configurações do Sequelize CLI
│   ├── infrastructure/          # Banco de dados, repositórios, logger e openapi
│   ├── interfaces/http/         # Rotas Express, controllers e middlewares
│   ├── migrations/              # Migrações versionadas do banco de dados
│   ├── src/core/                # Modelos ORM e associações
│   ├── src/domain/              # Entidades, regras de negócio e state machine
│   ├── tests/                   # Testes automatizados (Vitest e Supertest)
│   ├── Dockerfile               # Containerização da aplicação
│   ├── docker-compose.yml       # Orquestração da API e PostgreSQL
│   └── README.md                # Documentação técnica aprofundada do backend
├── documentacao/
│   ├── Apresentacao_QuimiPort.mp4  # Apresentação do projeto
│   └── openapi.yaml             # Especificação estática OpenAPI 3.0
└── README.md                    # Documentação principal da entrega
```

---

## 3. Tecnologias Utilizadas

- **Backend**: Node.js 22 LTS, TypeScript, Express 5;
- **Persistência**: PostgreSQL 16, Sequelize ORM, Sequelize CLI;
- **Validação & Contratos**: Zod, @asteasolutions/zod-to-openapi, Swagger UI;
- **Logging**: Pino, Pino-HTTP (logs estruturados e rotação em arquivos);
- **Testes**: Vitest, Supertest (243 testes automatizados);
- **DevOps**: Docker, Docker Compose, GitHub Actions.

---

## 4. Como Executar o Projeto

### 4.1 Execução com Docker (Recomendado)

Na pasta `backend/`:
```bash
# 1. Acessar a pasta do backend
cd backend

# 2. Configurar o arquivo de variáveis
cp .env.example .env

# 3. Subir o ambiente completo (API + PostgreSQL)
docker compose up -d
```
A API estará acessível em: `http://localhost:3000`  
Documentação Swagger UI: `http://localhost:3000/api/docs`

### 4.2 Execução Local (sem Docker)

```bash
cd backend
npm install
cp .env.example .env
npm run db:migrate
npm start
```

---

## 5. Como Executar os Testes Automatizados

A aplicação conta com mais de 240 testes automatizados cobrindo todas as regras de negócio exigidas no edital.

```bash
cd backend
npm test
```

Para validar a compilação do TypeScript:
```bash
npm run build
```

---

## 6. Documentação da API

- **Swagger UI interativo**: `http://localhost:3000/api/docs`
- **JSON OpenAPI**: `http://localhost:3000/api/docs.json`
- **Arquivo de especificação estático**: `documentacao/openapi.yaml`

---

## 7. Decisões Arquiteturais e Máquina de Estados

Consulte o documento detalhado em [backend/README.md](backend/README.md) para:
- Diagrama e tabela completa das transições permitidas e proibidas da máquina de estados;
- Modelagem relacional das tabelas, chaves primárias e estrangeiras;
- Justificativa da escolha do framework Express e do banco relacional PostgreSQL.

---

## 8. Integrantes do Grupo

- Gabriel Santos
- *(Demais integrantes do grupo conforme entrega acadêmica FIAP)*
