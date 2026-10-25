"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerGeralRoutesDoc = registerGeralRoutesDoc;
const registry_1 = require("../registry");
const schemas_1 = require("../schemas");
function registerGeralRoutesDoc() {
    registry_1.registry.registerPath({
        method: "get",
        path: "/",
        tags: ["Geral"],
        summary: "Status da API",
        description: "Retorna o status de funcionamento da API QuimiPort e o ambiente de execução.",
        responses: {
            200: (0, registry_1.jsonContent)(schemas_1.StatusApiSchema, "API online e operando normalmente"),
            500: (0, registry_1.errorResponse)("Erro interno no servidor"),
        },
    });
}
