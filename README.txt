// Entities -> Independente de outras camadas, contém a lógica de negócio central da aplicação

// Use Cases -> Regras de negócio da aplicação, gerenciam a relação entre as Entities e as Interfaces

// Interfaces -> Contratos entre os Use Cases e o mundo externo, definem como a aplicação se comunica com recursos externos

// Frameworks -> Tecnologias e ferramentas utilizadas pela aplicação, responsáveis por fornecer funcionalidades como servidor HTTP, banco de dados, bibliotecas e frameworks. São detalhes externos que podem ser substituídos sem alterar as regras de negócio.

// Infrastructure -> Implementações concretas dos recursos externos, como conexão com banco de dados, serviços externos, armazenamento, filas e APIs. É onde os contratos definidos pelas Interfaces são realmente implementados.