"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusApiSchema = exports.MensagemSucessoSchema = exports.ErroResponseSchema = void 0;
const registry_1 = require("../registry");
exports.ErroResponseSchema = registry_1.registry.register("ErroResponse", registry_1.z.object({
    erro: registry_1.z.string().openapi({
        description: "Mensagem descritiva do erro",
        example: "Dados de requisição inválidos",
    }),
    detalhes: registry_1.z.string().optional().openapi({
        description: "Informações adicionais sobre o erro",
        example: "O campo 'nome' é obrigatório",
    }),
}).openapi({
    description: "Estrutura padrão para respostas de erro",
}));
exports.MensagemSucessoSchema = registry_1.registry.register("MensagemSucesso", registry_1.z.object({
    mensagem: registry_1.z.string().openapi({
        description: "Mensagem informativa de sucesso",
        example: "Operação realizada com sucesso.",
    }),
}).openapi({
    description: "Estrutura padrão para confirmação de operações",
}));
exports.StatusApiSchema = registry_1.registry.register("StatusApi", registry_1.z.object({
    message: registry_1.z.string().openapi({ example: "Bem-vindo à API do QuimiPort!" }),
    status: registry_1.z.string().openapi({ example: "online" }),
    ambiente: registry_1.z.string().openapi({ example: "development" }),
    documentacao: registry_1.z.string().openapi({ example: "/api/docs" }),
}).openapi({
    description: "Status de saúde e informações gerais da API",
}));
