import { extendZodWithOpenApi, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

export function jsonContent(schema: any, description = "Sucesso") {
  return {
    description,
    content: {
      "application/json": {
        schema,
      },
    },
  };
}

export function errorResponse(description = "Erro na requisição") {
  return {
    description,
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/ErroResponse",
        },
      },
    },
  };
}

export function successMessageResponse(description = "Operação realizada com sucesso") {
  return {
    description,
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/MensagemSucesso",
        },
      },
    },
  };
}

export { z };
