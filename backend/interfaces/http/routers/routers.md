# Documentação de Rotas e APIs (REST, GraphQL e gRPC)

Este documento detalha a organização das rotas e estilos arquiteturais de APIs presentes no projeto QuimiPort, atendendo aos requisitos obrigatórios (REST) e ao diferencial demonstrativo opcional (GraphQL e gRPC), conforme especificado no Item 14 do documento do Tech Challenge.

---

## 1. API REST (Obrigatória - Espinha Dorsal do Sistema)

Localizada nas pastas `interfaces/http/routers/`:
- `cargaQuimica/cargaQuimicaRoute.ts`: Rotas de cargas químicas (`/api/cargas-quimicas` e `/api/cargas`);
- `produtoQuimico/produtoQuimicoRoute.ts`: Rotas de produtos químicos (`/api/produtos-quimicos`);
- `users/users.ts`: Rotas de usuários (`/api/usuarios`);
- `grupos/grupos.ts`: Rotas de grupos de permissão (`/api/grupos`).

Todas as regras operacionais, persistência transacional em PostgreSQL, autenticação e documentação Swagger UI (`/api/docs`) estão centradas na API REST.

---

## 2. Diferenciais Demonstrativos Opcionais: GraphQL e gRPC

Conforme o **Item 14 do Edital ("Aplicação de APIs além de REST")**:
> *"Como diferencial opcional, o grupo poderá implementar uma funcionalidade pequena e demonstrativa utilizando GraphQL ou gRPC. Esse diferencial deve ter escopo limitado, sem substituir ou comprometer a API REST obrigatória."*

Implementamos os dois exemplos sugeridos no edital:

### 2.1 GraphQL (`interfaces/http/routers/graphQL/graphqlRoute.ts`)
- **Endpoint**: `POST /graphql`
- **Cenário de Uso**: Consulta de cargas químicas filtradas por status (`cargasPorStatus`).
- **Motivo da Escolha**: Permite que o cliente consulte apenas os dados desejados da carga para um status específico (ex: listar apenas `id`, `codigo` e `responsavelTecnico` de cargas em `Em inspeção`), evitando tráfego excessivo de rede (*over-fetching*).
- **Exemplo de Requisição**:
  ```json
  POST /graphql
  Content-Type: application/json

  {
    "query": "query BuscarCargas($status: String!) { cargasPorStatus(status: $status) { id codigo nome status quantidade unidadeMedida responsavelTecnico } }",
    "variables": {
      "status": "Registrada"
    }
  }
  ```
- **Exemplo de Resposta**:
  ```json
  {
    "data": {
      "cargasPorStatus": [
        {
          "id": 1,
          "codigo": "CRG-2026-001",
          "nome": "Ácido Clorídrico",
          "status": "Registrada",
          "quantidade": 500,
          "unidadeMedida": "L",
          "responsavelTecnico": "Eng. Roberto Faria"
        }
      ]
    }
  }
  ```

---

### 2.2 gRPC (`interfaces/http/routers/gRPC/`)
- **Definição de Contrato Protobuf**: [`status_transicao.proto`](gRPC/status_transicao.proto)
- **Endpoint HTTP/JSON Transcodificado**: `POST /grpc/validar-transicao`
- **Cenário de Uso**: Validação instantânea de regras da State Machine de transição de status entre microsserviços.
- **Motivo da Escolha**: Baixíssima latência e validação estrita baseada em contratos binários tipados, ideal para chamadas frequentes entre serviços operacionais no porto antes de disparar comandos de movimentação física.
- **Contrato Protobuf (`status_transicao.proto`)**:
  ```protobuf
  syntax = "proto3";

  package quimiport.status;

  service StatusService {
    rpc ValidarTransicao (TransicaoRequest) returns (TransicaoResponse);
  }

  message TransicaoRequest {
    string status_atual = 1;
    string novo_status = 2;
  }

  message TransicaoResponse {
    bool permitida = 1;
    string status_resultante = 2;
    string mensagem = 3;
  }
  ```
- **Exemplo de Chamada de Validação (`POST /grpc/validar-transicao`)**:
  ```json
  POST /grpc/validar-transicao
  Content-Type: application/json

  {
    "status_atual": "Em inspeção",
    "novo_status": "Liberada"
  }
  ```
- **Exemplo de Resposta (Sucesso)**:
  ```json
  {
    "permitida": true,
    "status_resultante": "Liberada",
    "mensagem": "Transição de 'Em inspeção' para 'Liberada' é válida conforme a State Machine."
  }
  ```
- **Exemplo de Resposta (Transição Proibida)**:
  ```json
  {
    "permitida": false,
    "status_resultante": "",
    "mensagem": "Transição de status inválida: não é permitido mudar de 'Bloqueada' para 'Em movimentação'."
  }
  ```
