# Documentação de Rotas e APIs

Este documento explica a organização das rotas da aplicação, detalhando a estrutura principal em **REST** e a demonstração opcional de rotas utilizando **GraphQL** e **gRPC**.


## Pasta `routers/` (API REST - Obrigatória)

A pasta `routers/` contém as rotas principais do sistema, responsáveis pela **API REST obrigatória**. Toda a regra de negócio e os fluxos essenciais da aplicação são servidos por meio dessa estrutura, utilizando os verbos e padrões HTTP convencionais (`GET`, `POST`, `PUT`, `DELETE`).

> **Importante:** A API REST é a *espinha dorsal* do projeto e mantém o funcionamento completo do sistema independentemente das outras tecnologias citadas a seguir.

---

## Pastas `graphql/` e `grpc/` (Diferenciais Opcionais)

Para atender ao requisito de exploração de outros estilos de API além do REST, criamos estruturas específicas para demonstrar o uso de **GraphQL** e **gRPC** de forma isolada, **sem interferir no funcionamento do núcleo do projeto**.

### Pasta `graphql/`

A pasta `graphql/` guarda a implementação de consultas flexíveis para cenários específicos de leitura de dados.

* **Cenários de uso e exemplos:**
  * Consulta de *cargas por status*.
  * Consulta de *detalhes de produtos químicos*.
* **Motivo da escolha:** O GraphQL foi escolhido para esses casos para permitir que a aplicação cliente solicite **apenas os campos necessários** em cada busca, evitando o tráfego de dados desnecessários (*over-fetching*).

### Pasta `grpc/`

A pasta `grpc/` contém a implementação de uma comunicação direta e estruturada via *Protocol Buffers* (`.proto`) para validações pontuais.

* **Cenário de uso e exemplo:**
  * Método simples para *validar a transição de status* de uma carga ou processo.
* **Motivo da escolha:** O gRPC foi selecionado por ser uma solução de **baixa latência e alta performance** para chamadas pontuais de validação de regras de negócio.

---

> **Nota Final:** Como exigido nas diretrizes da disciplina, tanto as rotas em **GraphQL** quanto o método em **gRPC** possuem escopo *estritamente demonstrativo e limitado*, servindo como um diferencial **sem substituir ou comprometer** a API REST obrigatória.