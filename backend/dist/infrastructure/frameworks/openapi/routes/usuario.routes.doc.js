"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUsuarioRoutesDoc = registerUsuarioRoutesDoc;
const registry_1 = require("../registry");
const schemas_1 = require("../schemas");
function registerUsuarioRoutesDoc() {
    registry_1.registry.registerPath({
        method: "get",
        path: "/api/usuarios",
        tags: ["Usuários"],
        summary: "Listar todos os usuários",
        description: "Retorna a listagem de todos os usuários registrados no sistema, com seus respectivos grupos.",
        responses: {
            200: (0, registry_1.jsonContent)(registry_1.z.array(schemas_1.UsuarioSchema), "Lista de usuários obtida com sucesso"),
            500: (0, registry_1.errorResponse)("Erro interno ao listar usuários"),
        },
    });
    registry_1.registry.registerPath({
        method: "get",
        path: "/api/usuarios/{id}",
        tags: ["Usuários"],
        summary: "Buscar usuário por ID",
        description: "Obtém os detalhes de um usuário pelo seu identificador único (UUID).",
        request: {
            params: registry_1.z.object({
                id: registry_1.z.string().openapi({
                    description: "Identificador UUID do usuário",
                    example: "d290f1ee-6c54-4b01-90e6-d701748f0851",
                }),
            }),
        },
        responses: {
            200: (0, registry_1.jsonContent)(schemas_1.UsuarioSchema, "Usuário encontrado com sucesso"),
            400: (0, registry_1.errorResponse)("ID do usuário inválido ou não fornecido"),
            404: (0, registry_1.errorResponse)("Usuário não encontrado"),
            500: (0, registry_1.errorResponse)("Erro interno ao buscar usuário"),
        },
    });
    registry_1.registry.registerPath({
        method: "post",
        path: "/api/usuarios",
        tags: ["Usuários"],
        summary: "Cadastrar novo usuário",
        description: "Registra um novo colaborador/usuário no sistema QuimiPort.",
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: schemas_1.NovoUsuarioSchema,
                    },
                },
            },
        },
        responses: {
            201: (0, registry_1.jsonContent)(registry_1.z.object({
                mensagem: registry_1.z.string().openapi({ example: "Usuário cadastrado com sucesso." }),
                usuario: schemas_1.UsuarioSchema,
            }), "Usuário cadastrado com sucesso"),
            400: (0, registry_1.errorResponse)("Campos obrigatórios ausentes ou inválidos"),
            409: (0, registry_1.errorResponse)("E-mail já cadastrado por outro usuário"),
            500: (0, registry_1.errorResponse)("Erro interno ao cadastrar usuário"),
        },
    });
    registry_1.registry.registerPath({
        method: "put",
        path: "/api/usuarios/{id}",
        tags: ["Usuários"],
        summary: "Atualizar usuário existente",
        description: "Atualiza os dados cadastrais de um usuário identificado por seu UUID.",
        request: {
            params: registry_1.z.object({
                id: registry_1.z.string().openapi({
                    description: "Identificador UUID do usuário",
                    example: "d290f1ee-6c54-4b01-90e6-d701748f0851",
                }),
            }),
            body: {
                content: {
                    "application/json": {
                        schema: schemas_1.AtualizarUsuarioSchema,
                    },
                },
            },
        },
        responses: {
            200: (0, registry_1.jsonContent)(registry_1.z.object({
                mensagem: registry_1.z.string().openapi({ example: "Usuário atualizado com sucesso." }),
                usuario: schemas_1.UsuarioSchema,
            }), "Usuário atualizado com sucesso"),
            400: (0, registry_1.errorResponse)("ID ou dados inválidos"),
            404: (0, registry_1.errorResponse)("Usuário não encontrado para atualização"),
            409: (0, registry_1.errorResponse)("E-mail já está em uso por outro usuário"),
            500: (0, registry_1.errorResponse)("Erro interno ao atualizar usuário"),
        },
    });
    registry_1.registry.registerPath({
        method: "delete",
        path: "/api/usuarios/{id}",
        tags: ["Usuários"],
        summary: "Deletar usuário",
        description: "Remove um usuário do sistema a partir do seu ID.",
        request: {
            params: registry_1.z.object({
                id: registry_1.z.string().openapi({
                    description: "Identificador UUID do usuário",
                    example: "d290f1ee-6c54-4b01-90e6-d701748f0851",
                }),
            }),
        },
        responses: {
            204: {
                description: "Usuário deletado com sucesso (sem corpo de retorno)",
            },
            400: (0, registry_1.errorResponse)("ID inválido"),
            404: (0, registry_1.errorResponse)("Usuário não encontrado"),
            500: (0, registry_1.errorResponse)("Erro interno ao deletar usuário"),
        },
    });
    registry_1.registry.registerPath({
        method: "post",
        path: "/api/usuarios/{id}/grupos",
        tags: ["Usuários"],
        summary: "Atribuir grupo ao usuário",
        description: "Vincula um grupo de permissões ao usuário identificado.",
        request: {
            params: registry_1.z.object({
                id: registry_1.z.string().openapi({
                    description: "Identificador UUID do usuário",
                    example: "d290f1ee-6c54-4b01-90e6-d701748f0851",
                }),
            }),
            body: {
                content: {
                    "application/json": {
                        schema: schemas_1.AtribuirGrupoSchema,
                    },
                },
            },
        },
        responses: {
            200: (0, registry_1.successMessageResponse)("Grupo atribuído com sucesso"),
            400: (0, registry_1.errorResponse)("Campos inválidos ou erro ao atribuir"),
            404: (0, registry_1.errorResponse)("Usuário ou Grupo não encontrado"),
            500: (0, registry_1.errorResponse)("Erro interno"),
        },
    });
}
