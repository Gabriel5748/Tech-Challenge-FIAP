import { registry, z } from "../registry";

export const ErroResponseSchema = registry.register(
  "ErroResponse",
  z.object({
    erro: z.string().openapi({
      description: "Mensagem descritiva do erro",
      example: "Dados de requisição inválidos",
    }),
    detalhes: z.string().optional().openapi({
      description: "Informações adicionais sobre o erro",
      example: "O campo 'nome' é obrigatório",
    }),
  }).openapi({
    description: "Estrutura padrão para respostas de erro",
  })
);

export const MensagemSucessoSchema = registry.register(
  "MensagemSucesso",
  z.object({
    mensagem: z.string().openapi({
      description: "Mensagem informativa de sucesso",
      example: "Operação realizada com sucesso.",
    }),
  }).openapi({
    description: "Estrutura padrão para confirmação de operações",
  })
);

export const StatusApiSchema = registry.register(
  "StatusApi",
  z.object({
    message: z.string().openapi({ example: "Bem-vindo à API do QuimiPort!" }),
    status: z.string().openapi({ example: "online" }),
    ambiente: z.string().openapi({ example: "development" }),
    documentacao: z.string().openapi({ example: "/api/docs" }),
  }).openapi({
    description: "Status de saúde e informações gerais da API",
  })
);
