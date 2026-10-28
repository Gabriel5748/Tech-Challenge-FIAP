"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCargaQuimicaRoutesDoc = registerCargaQuimicaRoutesDoc;
const registry_1 = require("../registry");
const schemas_1 = require("../schemas");
function registerCargaQuimicaRoutesDoc() {
    registry_1.registry.registerPath({
        method: "post",
        path: "/api/cargas",
        tags: ["Cargas Químicas"],
        summary: "Cadastrar nova carga química",
        description: "Registra uma nova carga química informando o nome e fórmula química.",
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: schemas_1.NovaCargaSchema,
                    },
                },
            },
        },
        responses: {
            201: (0, registry_1.successMessageResponse)("Cadastro realizado com sucesso"),
            400: (0, registry_1.errorResponse)("Conteúdo inválido (nome ou fórmula inválidos)"),
            500: (0, registry_1.errorResponse)("Erro ao cadastrar dados"),
        },
    });
    registry_1.registry.registerPath({
        method: "get",
        path: "/api/cargas",
        tags: ["Cargas Químicas"],
        summary: "Buscar carga química por nome",
        description: "Pesquisa cargas químicas cadastradas através do parâmetro de busca por nome.",
        request: {
            query: registry_1.z.object({
                nome: registry_1.z.string().openapi({
                    description: "Nome ou termo de busca da carga química",
                    example: "Ácido Clorídrico",
                }),
            }),
        },
        responses: {
            200: (0, registry_1.jsonContent)(registry_1.z.array(schemas_1.CargaQuimicaSchema), "Carga química encontrada"),
            400: (0, registry_1.errorResponse)("Conteúdo inválido (parâmetro 'nome' ausente ou incorreto)"),
            404: (0, registry_1.errorResponse)("Carga química não encontrada"),
            500: (0, registry_1.errorResponse)("Erro ao consultar dados"),
        },
    });
    registry_1.registry.registerPath({
        method: "patch",
        path: "/api/cargas/{id}/status",
        tags: ["Cargas Químicas"],
        summary: "Atualizar status da carga química",
        description: "Altera o status de controle da carga química identificada pelo ID.",
        request: {
            params: registry_1.z.object({
                id: registry_1.z.coerce.number().int().openapi({
                    description: "Identificador numérico da carga química",
                    example: 1,
                }),
            }),
            body: {
                content: {
                    "application/json": {
                        schema: schemas_1.AtualizarStatusCargaSchema,
                    },
                },
            },
        },
        responses: {
            200: (0, registry_1.jsonContent)(registry_1.z.array(schemas_1.CargaQuimicaSchema), "Status atualizado com sucesso"),
            400: (0, registry_1.errorResponse)("Identificador ou status inválido"),
            404: (0, registry_1.errorResponse)("Carga química não encontrada"),
            500: (0, registry_1.errorResponse)("Erro ao atualizar status da carga"),
        },
    });
}
