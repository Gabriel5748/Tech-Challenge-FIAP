"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerProdutoQuimicoRoutesDoc = registerProdutoQuimicoRoutesDoc;
const registry_1 = require("../registry");
const schemas_1 = require("../schemas");
function registerProdutoQuimicoRoutesDoc() {
    registry_1.registry.registerPath({
        method: "post",
        path: "/api/produtos-quimicos",
        tags: ["Produtos Químicos"],
        summary: "Cadastrar produto químico",
        description: "Cadastra um novo produto químico informando seu nome e fórmula molecular.",
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: schemas_1.NovoProdutoQuimicoSchema,
                    },
                },
            },
        },
        responses: {
            201: (0, registry_1.successMessageResponse)("Produto químico cadastrado com sucesso"),
            400: (0, registry_1.errorResponse)("Nome e fórmula são obrigatórios"),
            500: (0, registry_1.errorResponse)("Erro interno ao cadastrar produto químico"),
        },
    });
    registry_1.registry.registerPath({
        method: "get",
        path: "/api/produtos-quimicos",
        tags: ["Produtos Químicos"],
        summary: "Listar produtos químicos",
        description: "Retorna a listagem completa de todos os produtos químicos registrados.",
        responses: {
            200: (0, registry_1.jsonContent)(registry_1.z.array(schemas_1.ProdutoQuimicoSchema), "Lista de produtos químicos obtida com sucesso"),
            500: (0, registry_1.errorResponse)("Erro ao listar produtos químicos"),
        },
    });
    registry_1.registry.registerPath({
        method: "get",
        path: "/api/produtos-quimicos/{id}",
        tags: ["Produtos Químicos"],
        summary: "Buscar produto químico por ID",
        description: "Consulta e retorna os dados de um produto químico a partir do seu ID numérico.",
        request: {
            params: registry_1.z.object({
                id: registry_1.z.coerce.number().int().openapi({
                    description: "Identificador numérico do produto químico",
                    example: 1,
                }),
            }),
        },
        responses: {
            200: (0, registry_1.jsonContent)(schemas_1.ProdutoQuimicoSchema, "Produto químico encontrado"),
            400: (0, registry_1.errorResponse)("Identificador inválido"),
            404: (0, registry_1.errorResponse)("Produto químico não encontrado"),
            500: (0, registry_1.errorResponse)("Erro ao consultar produto químico"),
        },
    });
    registry_1.registry.registerPath({
        method: "patch",
        path: "/api/produtos-quimicos/{id}",
        tags: ["Produtos Químicos"],
        summary: "Atualizar fórmula do produto químico",
        description: "Atualiza a fórmula molecular de um produto químico cadastrado.",
        request: {
            params: registry_1.z.object({
                id: registry_1.z.coerce.number().int().openapi({
                    description: "Identificador numérico do produto químico",
                    example: 1,
                }),
            }),
            body: {
                content: {
                    "application/json": {
                        schema: schemas_1.AtualizarProdutoQuimicoSchema,
                    },
                },
            },
        },
        responses: {
            200: (0, registry_1.jsonContent)(schemas_1.ProdutoQuimicoSchema, "Produto químico atualizado com sucesso"),
            400: (0, registry_1.errorResponse)("Identificador e fórmula válida são obrigatórios"),
            404: (0, registry_1.errorResponse)("Produto químico não encontrado"),
            500: (0, registry_1.errorResponse)("Erro ao atualizar produto químico"),
        },
    });
    registry_1.registry.registerPath({
        method: "delete",
        path: "/api/produtos-quimicos/{id}",
        tags: ["Produtos Químicos"],
        summary: "Inativar produto químico",
        description: "Inativa o produto químico no catálogo portuário.",
        request: {
            params: registry_1.z.object({
                id: registry_1.z.coerce.number().int().openapi({
                    description: "Identificador numérico do produto químico",
                    example: 1,
                }),
            }),
        },
        responses: {
            200: (0, registry_1.jsonContent)(schemas_1.ProdutoQuimicoSchema, "Produto químico inativado com sucesso"),
            400: (0, registry_1.errorResponse)("Identificador inválido"),
            404: (0, registry_1.errorResponse)("Produto químico não encontrado"),
            500: (0, registry_1.errorResponse)("Erro ao inativar produto químico"),
        },
    });
}
