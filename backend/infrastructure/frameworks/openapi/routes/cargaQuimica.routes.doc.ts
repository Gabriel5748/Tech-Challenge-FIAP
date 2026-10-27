import { registry, jsonContent, errorResponse, successMessageResponse, z } from "../registry";
import {
  CargaQuimicaSchema,
  NovaCargaSchema,
  AtualizarStatusCargaSchema,
} from "../schemas";

export function registerCargaQuimicaRoutesDoc() {
  registry.registerPath({
    method: "post",
    path: "/api/cargas",
    tags: ["Cargas Químicas"],
    summary: "Cadastrar nova carga química",
    description: "Registra uma nova carga química informando o nome e fórmula química.",
    request: {
      body: {
        content: {
          "application/json": {
            schema: NovaCargaSchema,
          },
        },
      },
    },
    responses: {
      201: jsonContent(
        z.object({
          mensagem: z.string().openapi({ example: "Cadastro realizado com sucesso" }),
          carga: CargaQuimicaSchema,
        }),
        "Cadastro realizado com sucesso"
      ),
      400: errorResponse("Conteúdo inválido (nome ou fórmula inválidos)"),
      500: errorResponse("Erro ao cadastrar dados"),
    },
  });

  registry.registerPath({
    method: "get",
    path: "/api/cargas",
    tags: ["Cargas Químicas"],
    summary: "Listar ou buscar cargas químicas por nome",
    description: "Retorna todas as cargas químicas cadastradas ou filtra através do parâmetro opcional de busca por nome.",
    request: {
      query: z.object({
        nome: z.string().optional().openapi({
          description: "Nome ou termo de busca da carga química (opcional)",
          example: "Ácido Clorídrico",
        }),
      }),
    },
    responses: {
      200: jsonContent(z.array(CargaQuimicaSchema), "Carga química encontrada"),
      400: errorResponse("Conteúdo inválido (parâmetro 'nome' ausente ou incorreto)"),
      404: errorResponse("Carga química não encontrada"),
      500: errorResponse("Erro ao consultar dados"),
    },
  });

  registry.registerPath({
    method: "patch",
    path: "/api/cargas/{id}/status",
    tags: ["Cargas Químicas"],
    summary: "Atualizar status da carga química",
    description: "Altera o status de controle da carga química identificada pelo ID.",
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({
          description: "Identificador numérico da carga química",
          example: 1,
        }),
      }),
      body: {
        content: {
          "application/json": {
            schema: AtualizarStatusCargaSchema,
          },
        },
      },
    },
    responses: {
      200: jsonContent(z.array(CargaQuimicaSchema), "Status atualizado com sucesso"),
      400: errorResponse("Identificador ou status inválido"),
      404: errorResponse("Carga química não encontrada"),
      500: errorResponse("Erro ao atualizar status da carga"),
    },
  });
}
