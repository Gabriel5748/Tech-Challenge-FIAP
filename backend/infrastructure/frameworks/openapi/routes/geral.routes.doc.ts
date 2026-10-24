import { registry, jsonContent, errorResponse } from "../registry";
import { StatusApiSchema } from "../schemas";

export function registerGeralRoutesDoc() {
  registry.registerPath({
    method: "get",
    path: "/",
    tags: ["Geral"],
    summary: "Status da API",
    description: "Retorna o status de funcionamento da API QuimiPort e o ambiente de execução.",
    responses: {
      200: jsonContent(StatusApiSchema, "API online e operando normalmente"),
      500: errorResponse("Erro interno no servidor"),
    },
  });
}
