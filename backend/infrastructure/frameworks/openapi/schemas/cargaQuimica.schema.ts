import { registry, z } from "../registry";
import { ProdutoQuimicoSchema } from "./produtoQuimico.schema";

export const StatusCargaEnum = z.enum([
  "Registrada",
  "Em análise",
  "Em inspeção",
  "Liberada",
  "Bloqueada",
  "Em movimentação",
  "Finalizada",
  "Cancelada",
]);

export const CargaQuimicaSchema = registry.register(
  "CargaQuimica",
  z.object({
    id: z.number().int().openapi({
      description: "Identificador único da carga química",
      example: 1,
    }),
    codigo: z.string().optional().openapi({
      description: "Código de identificação da carga",
      example: "CRG-2026-001",
    }),
    nome: z.string().openapi({
      description: "Nome da carga química",
      example: "Ácido Clorídrico",
    }),
    formula: z.string().optional().openapi({
      description: "Fórmula química correspondente",
      example: "HCl",
    }),
    produtoQuimicoId: z.number().int().optional().openapi({
      description: "Identificador do produto químico associado",
      example: 1,
    }),
    produtoQuimico: ProdutoQuimicoSchema.optional().openapi({
      description: "Dados completos do produto químico associado",
    }),
    quantidade: z.number().openapi({
      description: "Quantidade da carga (deve ser maior que zero)",
      example: 250.5,
    }),
    unidadeMedida: z.string().optional().openapi({
      description: "Unidade de medida (ex: kg, L, ton)",
      example: "L",
    }),
    origem: z.string().optional().openapi({
      description: "Local ou porto de origem",
      example: "Porto de Santos",
    }),
    destino: z.string().optional().openapi({
      description: "Local ou porto de destino",
      example: "Terminal Químico B",
    }),
    responsavelTecnico: z.string().openapi({
      description: "Nome do responsável técnico habilitado",
      example: "Eng. Roberto Faria (CRQ 12345)",
    }),
    documentacaoObrigatoria: z.any().optional().openapi({
      description: "Documentos fiscais, FISPQ e licenças ambientais",
      example: [{ tipo: "FISPQ", status: "validado" }, { tipo: "Licença Ambiental", status: "validado" }],
    }),
    status: StatusCargaEnum.openapi({
      description: "Status atual da carga no fluxo operacional",
      example: "Registrada",
    }),
    dataEntrada: z.union([z.string(), z.date()]).optional().openapi({
      description: "Data e hora de entrada no porto",
      example: "2026-10-27T20:00:00.000Z",
    }),
    createdAt: z.union([z.string(), z.date()]).optional().openapi({
      description: "Data de criação do registro",
      example: "2026-10-27T20:00:00.000Z",
    }),
    updatedAt: z.union([z.string(), z.date()]).optional().openapi({
      description: "Data de última atualização",
      example: "2026-10-27T20:00:00.000Z",
    }),
  }).openapi({
    description: "Entidade de Carga Química do QuimiPort",
  })
);

export const NovaCargaSchema = registry.register(
  "NovaCargaInput",
  z.object({
    codigo: z.string().optional().openapi({
      description: "Código da carga (gerado automaticamente se omitido)",
      example: "CRG-2026-001",
    }),
    produtoQuimicoId: z.number().int().min(1, "O produto químico associado é obrigatório").openapi({
      description: "ID do produto químico previamente cadastrado e ativo",
      example: 1,
    }),
    quantidade: z.number().positive("A quantidade deve ser maior que zero").openapi({
      description: "Quantidade total da carga",
      example: 500,
    }),
    responsavelTecnico: z.string().min(1, "O responsável técnico é obrigatório").openapi({
      description: "Nome do responsável técnico",
      example: "Eng. Carlos Drumond",
    }),
    unidadeMedida: z.string().optional().openapi({
      description: "Unidade de medida",
      example: "L",
    }),
    origem: z.string().optional().openapi({
      description: "Origem da carga",
      example: "Terminal A",
    }),
    destino: z.string().optional().openapi({
      description: "Destino da carga",
      example: "Armazém 4",
    }),
    documentacaoObrigatoria: z.any().optional().openapi({
      description: "Documentação obrigatória da carga",
      example: [{ tipo: "FISPQ", status: "validado" }],
    }),
    status: StatusCargaEnum.optional().default("Registrada").openapi({
      description: "Status inicial da carga",
      example: "Registrada",
    }),
  }).openapi({
    description: "Dados para cadastro de nova carga química",
  })
);

export const AtualizarStatusCargaSchema = registry.register(
  "AtualizarStatusCargaInput",
  z.object({
    status: StatusCargaEnum.openapi({
      description: "Novo status da carga respeitando a máquina de estados",
      example: "Em análise",
    }),
  }).openapi({
    description: "Status permitido para transição da carga química",
  })
);
