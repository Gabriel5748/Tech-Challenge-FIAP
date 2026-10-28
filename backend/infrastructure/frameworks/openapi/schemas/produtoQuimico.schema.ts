import { registry, z } from "../registry";

export const ProdutoQuimicoSchema = registry.register(
  "ProdutoQuimico",
  z.object({
    id: z.number().int().openapi({
      description: "Identificador único do produto químico",
      example: 1,
    }),
    nome: z.string().openapi({
      description: "Nome comercial ou técnico do produto",
      example: "Ácido Sulfúrico",
    }),
    formula: z.string().optional().openapi({
      description: "Fórmula molecular",
      example: "H2SO4",
    }),
    descricao: z.string().optional().openapi({
      description: "Descrição detalhada e características",
      example: "Líquido viscoso incolor e inodoro",
    }),
    numeroONU: z.string().optional().openapi({
      description: "Código ONU para transporte de produtos perigosos",
      example: "1830",
    }),
    classeRisco: z.string().openapi({
      description: "Classe de risco conforme norma de segurança",
      example: "8",
    }),
    grupoCompatibilidade: z.string().optional().openapi({
      description: "Grupo de compatibilidade para armazenamento",
      example: "Corrosivo",
    }),
    ativo: z.boolean().openapi({
      description: "Indica se o produto químico está ativo no catálogo",
      example: true,
    }),
    createdAt: z.union([z.string(), z.date()]).optional().openapi({
      description: "Data de criação do registro",
      example: "2026-10-27T20:00:00.000Z",
    }),
    updatedAt: z.union([z.string(), z.date()]).optional().openapi({
      description: "Data de atualização do registro",
      example: "2026-10-27T20:00:00.000Z",
    }),
  }).openapi({
    description: "Entidade de Produto Químico",
  })
);

export const NovoProdutoQuimicoSchema = registry.register(
  "NovoProdutoQuimicoInput",
  z.object({
    nome: z.string().min(1, "O nome do produto é obrigatório").openapi({
      description: "Nome do produto químico",
      example: "Ácido Sulfúrico",
    }),
    formula: z.string().optional().openapi({
      description: "Fórmula molecular",
      example: "H2SO4",
    }),
    descricao: z.string().optional().openapi({
      description: "Descrição detalhada do produto",
      example: "Líquido incolor e corrosivo",
    }),
    numeroONU: z.string().optional().openapi({
      description: "Número ONU do produto",
      example: "1830",
    }),
    classeRisco: z.string().min(1, "A classe de risco é obrigatória").openapi({
      description: "Classe de risco do produto",
      example: "8",
    }),
    grupoCompatibilidade: z.string().optional().openapi({
      description: "Grupo de compatibilidade",
      example: "Corrosivo",
    }),
    status: z.enum(["ativo", "inativo"]).optional().default("ativo").openapi({
      description: "Status do produto químico",
      example: "ativo",
    }),
  }).openapi({
    description: "Dados para cadastro de novo produto químico",
  })
);

export const AtualizarProdutoQuimicoSchema = registry.register(
  "AtualizarProdutoQuimicoInput",
  z.object({
    nome: z.string().optional().openapi({
      description: "Novo nome do produto",
      example: "Ácido Sulfúrico Concentrado",
    }),
    formula: z.string().optional().openapi({
      description: "Nova fórmula molecular",
      example: "H2SO4",
    }),
    descricao: z.string().optional().openapi({
      description: "Nova descrição",
      example: "Solução concentrada",
    }),
    numeroONU: z.string().optional().openapi({
      description: "Novo número ONU",
      example: "1830",
    }),
    classeRisco: z.string().optional().openapi({
      description: "Nova classe de risco",
      example: "8",
    }),
    grupoCompatibilidade: z.string().optional().openapi({
      description: "Novo grupo de compatibilidade",
      example: "Corrosivo",
    }),
    status: z.enum(["ativo", "inativo"]).optional().openapi({
      description: "Novo status do produto químico",
      example: "ativo",
    }),
  }).openapi({
    description: "Dados para atualização de produto químico",
  })
);
