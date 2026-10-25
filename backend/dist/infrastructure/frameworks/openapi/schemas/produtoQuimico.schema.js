"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtualizarProdutoQuimicoSchema = exports.NovoProdutoQuimicoSchema = exports.ProdutoQuimicoSchema = void 0;
const registry_1 = require("../registry");
exports.ProdutoQuimicoSchema = registry_1.registry.register("ProdutoQuimico", registry_1.z.object({
    id: registry_1.z.number().int().openapi({
        description: "Identificador único do produto químico",
        example: 1,
    }),
    nome: registry_1.z.string().openapi({
        description: "Nome comercial ou técnico do produto",
        example: "Ácido Sulfúrico",
    }),
    formula: registry_1.z.string().openapi({
        description: "Fórmula molecular",
        example: "H2SO4",
    }),
    descricao: registry_1.z.string().optional().openapi({
        description: "Descrição detalhada e características",
        example: "Líquido viscoso incolor e inodoro",
    }),
    numero_onu: registry_1.z.string().optional().openapi({
        description: "Código ONU para transporte de produtos perigosos",
        example: "1830",
    }),
    classe_risco: registry_1.z.string().optional().openapi({
        description: "Classe de risco conforme norma de segurança",
        example: "8",
    }),
    grupo_compatibilidade: registry_1.z.string().optional().openapi({
        description: "Grupo de compatibilidade para armazenamento",
        example: "Corrosivo",
    }),
    ativo: registry_1.z.boolean().optional().openapi({
        description: "Indica se o produto químico está ativo no catálogo",
        example: true,
    }),
}).openapi({
    description: "Entidade de Produto Químico",
}));
exports.NovoProdutoQuimicoSchema = registry_1.registry.register("NovoProdutoQuimicoInput", registry_1.z.object({
    nome: registry_1.z.string().min(1, "O nome do produto é obrigatório").openapi({
        description: "Nome do produto químico",
        example: "Ácido Sulfúrico",
    }),
    formula: registry_1.z.string().min(1, "A fórmula é obrigatória").openapi({
        description: "Fórmula molecular",
        example: "H2SO4",
    }),
}).openapi({
    description: "Dados para cadastro de novo produto químico",
}));
exports.AtualizarProdutoQuimicoSchema = registry_1.registry.register("AtualizarProdutoQuimicoInput", registry_1.z.object({
    formula: registry_1.z.string().min(1, "A fórmula molecular atualizada é obrigatória").openapi({
        description: "Nova fórmula molecular",
        example: "H2SO4 Concentrado",
    }),
}).openapi({
    description: "Dados para atualização de produto químico",
}));
