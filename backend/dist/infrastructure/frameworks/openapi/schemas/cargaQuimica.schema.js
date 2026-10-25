"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtualizarStatusCargaSchema = exports.NovaCargaSchema = exports.CargaQuimicaSchema = void 0;
const registry_1 = require("../registry");
exports.CargaQuimicaSchema = registry_1.registry.register("CargaQuimica", registry_1.z.object({
    id: registry_1.z.number().int().openapi({
        description: "Identificador único da carga química",
        example: 1,
    }),
    nome: registry_1.z.string().openapi({
        description: "Nome da carga química",
        example: "Ácido Clorídrico",
    }),
    formula: registry_1.z.string().openapi({
        description: "Fórmula química correspondente",
        example: "HCl",
    }),
    status: registry_1.z.enum(["bloqueado", "liberado", "cancelado"]).openapi({
        description: "Status atual da carga",
        example: "liberado",
    }),
}).openapi({
    description: "Entidade de Carga Química",
}));
exports.NovaCargaSchema = registry_1.registry.register("NovaCargaInput", registry_1.z.object({
    nome: registry_1.z.string().min(1, "O nome da carga química é obrigatório").openapi({
        description: "Nome da carga química",
        example: "Ácido Clorídrico",
    }),
    formula: registry_1.z.string().min(1, "A fórmula é obrigatória").openapi({
        description: "Fórmula molecular da carga",
        example: "HCl",
    }),
}).openapi({
    description: "Dados para cadastro de nova carga química",
}));
exports.AtualizarStatusCargaSchema = registry_1.registry.register("AtualizarStatusCargaInput", registry_1.z.object({
    status: registry_1.z.enum(["bloqueado", "liberado", "cancelado"]).openapi({
        description: "Novo status da carga",
        example: "liberado",
    }),
}).openapi({
    description: "Status permitido para atualização da carga química",
}));
