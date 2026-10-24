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
    formula: z.string().openapi({
      description: "Fórmula molecular",
      example: "H2SO4",
    }),
    descricao: z.string().optional().openapi({
      description: "Descrição detalhada e características",
      example: "Líquido viscoso incolor e inodoro",
    }),
    numero_onu: z.string().optional().openapi({
      description: "Código ONU para transporte de produtos perigosos",
      example: "1830",
    }),
    classe_risco: z.string().optional().openapi({
      description: "Classe de risco conforme norma de segurança",
      example: "8",
    }),
    grupo_compatibilidade: z.string().optional().openapi({
      description: "Grupo de compatibilidade para armazenamento",
      example: "Corrosivo",
    }),
    ativo: z.boolean().optional().openapi({
      description: "Indica se o produto químico está ativo no catálogo",
      example: true,
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
    formula: z.string().min(1, "A fórmula é obrigatória").openapi({
      description: "Fórmula molecular",
      example: "H2SO4",
    }),
  }).openapi({
    description: "Dados para cadastro de novo produto químico",
  })
);

export const AtualizarProdutoQuimicoSchema = registry.register(
  "AtualizarProdutoQuimicoInput",
  z.object({
    formula: z.string().min(1, "A fórmula molecular atualizada é obrigatória").openapi({
      description: "Nova fórmula molecular",
      example: "H2SO4 Concentrado",
    }),
  }).openapi({
    description: "Dados para atualização de produto químico",
  })
);
