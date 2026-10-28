"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.z = exports.registry = void 0;
exports.jsonContent = jsonContent;
exports.errorResponse = errorResponse;
exports.successMessageResponse = successMessageResponse;
const zod_to_openapi_1 = require("@asteasolutions/zod-to-openapi");
const zod_1 = require("zod");
Object.defineProperty(exports, "z", { enumerable: true, get: function () { return zod_1.z; } });
(0, zod_to_openapi_1.extendZodWithOpenApi)(zod_1.z);
exports.registry = new zod_to_openapi_1.OpenAPIRegistry();
function jsonContent(schema, description = "Sucesso") {
    return {
        description,
        content: {
            "application/json": {
                schema,
            },
        },
    };
}
function errorResponse(description = "Erro na requisição") {
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
function successMessageResponse(description = "Operação realizada com sucesso") {
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
