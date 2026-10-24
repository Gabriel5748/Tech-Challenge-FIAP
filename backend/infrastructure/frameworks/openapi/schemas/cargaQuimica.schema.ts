import { registry, z } from "../registry";

export const CargaQuimicaSchema = registry.register(
  "CargaQuimica",
  z.object({
    id: z.number().int().openapi({
      description: "Identificador único da carga química",
      example: 1,
    }),
    nome: z.string().openapi({
      description: "Nome da carga química",
      example: "Ácido Clorídrico",
    }),
    formula: z.string().openapi({
      description: "Fórmula química correspondente",
      example: "HCl",
    }),
    status: z.enum(["bloqueado", "liberado", "cancelado"]).openapi({
      description: "Status atual da carga",
      example: "liberado",
    }),
  }).openapi({
    description: "Entidade de Carga Química",
  })
);

export const NovaCargaSchema = registry.register(
  "NovaCargaInput",
  z.object({
    nome: z.string().min(1, "O nome da carga química é obrigatório").openapi({
      description: "Nome da carga química",
      example: "Ácido Clorídrico",
    }),
    formula: z.string().min(1, "A fórmula é obrigatória").openapi({
      description: "Fórmula molecular da carga",
      example: "HCl",
    }),
  }).openapi({
    description: "Dados para cadastro de nova carga química",
  })
);

export const AtualizarStatusCargaSchema = registry.register(
  "AtualizarStatusCargaInput",
  z.object({
    status: z.enum(["bloqueado", "liberado", "cancelado"]).openapi({
      description: "Novo status da carga",
      example: "liberado",
    }),
  }).openapi({
    description: "Status permitido para atualização da carga química",
  })
);
