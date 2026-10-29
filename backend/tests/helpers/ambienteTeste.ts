// Precisa ser o PRIMEIRO import de cada teste de integração: o settings.ts lê a
// porta ao ser carregado, e o server.ts sobe o servidor ao ser importado. Com a
// porta 0, cada arquivo de teste usa uma porta livre, sem conflito entre eles.
process.env.API_PORT = "0";
