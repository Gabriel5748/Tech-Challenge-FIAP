import { registry, jsonContent, errorResponse, z } from "../registry";
import {
  ProdutoQuimicoSchema,
  NovoProdutoQuimicoSchema,
  AtualizarProdutoQuimicoSchema,
} from "../schemas";

export function registerProdutoQuimicoRoutesDoc() {
  registry.registerPath({
    method: "post",
    path: "/api/produtos-quimicos",
    tags: ["Produtos Químicos"],
    summary: "Cadastrar produto químico",
    description: "Cadastra um novo produto químico informando obrigatoriamente nome e classe de risco.",
    request: {
      body: {
        content: {
          "application/json": {
            schema: NovoProdutoQuimicoSchema,
          },
        },
      },
    },
    responses: {
      201: jsonContent(
        z.object({
          mensagem: z.string().openapi({ example: "Produto químico cadastrado com sucesso" }),
          produto: ProdutoQuimicoSchema,
        }),
        "Produto químico cadastrado com sucesso"
      ),
      400: errorResponse("Campos obrigatórios ausentes ou status inválido"),
      500: errorResponse("Erro interno ao cadastrar produto químico"),
    },
  });

  registry.registerPath({
    method: "get",
    path: "/api/produtos-quimicos",
    tags: ["Produtos Químicos"],
    summary: "Listar produtos químicos",
    description: "Retorna a listagem completa de todos os produtos químicos registrados.",
    responses: {
      200: jsonContent(z.array(ProdutoQuimicoSchema), "Lista de produtos químicos obtida com sucesso"),
      500: errorResponse("Erro ao listar produtos químicos"),
    },
  });

  registry.registerPath({
    method: "get",
    path: "/api/produtos-quimicos/{id}",
    tags: ["Produtos Químicos"],
    summary: "Buscar produto químico por ID",
    description: "Consulta e retorna os dados de um produto químico a partir do seu ID numérico.",
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({
          description: "Identificador numérico do produto químico",
          example: 1,
        }),
      }),
    },
    responses: {
      200: jsonContent(ProdutoQuimicoSchema, "Produto químico encontrado com sucesso"),
      400: errorResponse("Identificador inválido"),
      404: errorResponse("Produto químico não encontrado"),
      500: errorResponse("Erro ao consultar produto químico"),
    },
  });

  registry.registerPath({
    method: "put",
    path: "/api/produtos-quimicos/{id}",
    tags: ["Produtos Químicos"],
    summary: "Atualizar produto químico",
    description: "Atualiza os dados de um produto químico cadastrado.",
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({
          description: "Identificador numérico do produto químico",
          example: 1,
        }),
      }),
      body: {
        content: {
          "application/json": {
            schema: AtualizarProdutoQuimicoSchema,
          },
        },
      },
    },
    responses: {
      200: jsonContent(ProdutoQuimicoSchema, "Produto químico atualizado com sucesso"),
      400: errorResponse("Dados inválidos para atualização"),
      404: errorResponse("Produto químico não encontrado"),
      500: errorResponse("Erro ao atualizar produto químico"),
    },
  });

  registry.registerPath({
    method: "patch",
    path: "/api/produtos-quimicos/{id}/inativar",
    tags: ["Produtos Químicos"],
    summary: "Inativar produto químico",
    description: "Inativa o produto químico no catálogo portuário.",
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({
          description: "Identificador numérico do produto químico",
          example: 1,
        }),
      }),
    },
    responses: {
      200: jsonContent(ProdutoQuimicoSchema, "Produto químico inativado com sucesso"),
      400: errorResponse("Identificador inválido"),
      404: errorResponse("Produto químico não encontrado"),
      500: errorResponse("Erro ao inativar produto químico"),
    },
  });
}
