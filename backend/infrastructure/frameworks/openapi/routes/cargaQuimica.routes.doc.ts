import { registry, jsonContent, errorResponse, z } from "../registry";
import {
  CargaQuimicaSchema,
  NovaCargaSchema,
  AtualizarStatusCargaSchema,
} from "../schemas";

export function registerCargaQuimicaRoutesDoc() {
  registry.registerPath({
    method: "post",
    path: "/api/cargas-quimicas",
    tags: ["Cargas Químicas"],
    summary: "Registrar carga química",
    description: "Registra uma nova carga química associando obrigatoriamente a um produto químico ativo.",
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
        "Carga registrada com sucesso"
      ),
      400: errorResponse("Dados inválidos ou regras de negócio violadas"),
      500: errorResponse("Erro ao cadastrar dados"),
    },
  });

  registry.registerPath({
    method: "get",
    path: "/api/cargas-quimicas",
    tags: ["Cargas Químicas"],
    summary: "Listar cargas químicas",
    description: "Retorna todas as cargas químicas cadastradas ou filtra pelo termo de busca no nome.",
    request: {
      query: z.object({
        nome: z.string().optional().openapi({
          description: "Nome ou termo de busca da carga química (opcional)",
          example: "Ácido Clorídrico",
        }),
      }),
    },
    responses: {
      200: jsonContent(z.array(CargaQuimicaSchema), "Lista de cargas químicas obtida com sucesso"),
      400: errorResponse("Parâmetros inválidos"),
      500: errorResponse("Erro ao consultar dados"),
    },
  });

  registry.registerPath({
    method: "get",
    path: "/api/cargas-quimicas/{id}",
    tags: ["Cargas Químicas"],
    summary: "Buscar carga química por identificador",
    description: "Busca e retorna os detalhes de uma carga química específica a partir do seu ID numérico.",
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({
          description: "Identificador numérico da carga química",
          example: 1,
        }),
      }),
    },
    responses: {
      200: jsonContent(CargaQuimicaSchema, "Carga química encontrada com sucesso"),
      400: errorResponse("Identificador inválido"),
      404: errorResponse("Carga química não encontrada"),
      500: errorResponse("Erro ao consultar dados"),
    },
  });

  registry.registerPath({
    method: "patch",
    path: "/api/cargas-quimicas/{id}/status",
    tags: ["Cargas Químicas"],
    summary: "Atualizar status da carga química",
    description: "Atualiza o status da carga conforme a máquina de estados permitida.",
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
      200: jsonContent(CargaQuimicaSchema, "Status atualizado com sucesso"),
      400: errorResponse("Transição de status inválida ou documentação pendente"),
      404: errorResponse("Carga química não encontrada"),
      500: errorResponse("Erro ao atualizar status da carga"),
    },
  });

  registry.registerPath({
    method: "patch",
    path: "/api/cargas-quimicas/{id}/bloquear",
    tags: ["Cargas Químicas"],
    summary: "Bloquear carga química",
    description: "Realiza a transição da carga química para o status 'Bloqueada'.",
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({
          description: "Identificador numérico da carga química",
          example: 1,
        }),
      }),
    },
    responses: {
      200: jsonContent(CargaQuimicaSchema, "Carga química bloqueada com sucesso"),
      400: errorResponse("Carga não pode ser bloqueada"),
      404: errorResponse("Carga química não encontrada"),
      500: errorResponse("Erro ao atualizar status da carga"),
    },
  });

  registry.registerPath({
    method: "patch",
    path: "/api/cargas-quimicas/{id}/liberar",
    tags: ["Cargas Químicas"],
    summary: "Liberar carga química",
    description: "Realiza a transição da carga química para o status 'Liberada' validando a documentação obrigatória.",
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({
          description: "Identificador numérico da carga química",
          example: 1,
        }),
      }),
    },
    responses: {
      200: jsonContent(CargaQuimicaSchema, "Carga química liberada com sucesso"),
      400: errorResponse("Documentação obrigatória pendente ou transição inválida"),
      404: errorResponse("Carga química não encontrada"),
      500: errorResponse("Erro ao atualizar status da carga"),
    },
  });

  registry.registerPath({
    method: "patch",
    path: "/api/cargas-quimicas/{id}/cancelar",
    tags: ["Cargas Químicas"],
    summary: "Cancelar carga química",
    description: "Realiza a transição da carga química para o estado terminal 'Cancelada'.",
    request: {
      params: z.object({
        id: z.coerce.number().int().openapi({
          description: "Identificador numérico da carga química",
          example: 1,
        }),
      }),
    },
    responses: {
      200: jsonContent(CargaQuimicaSchema, "Carga química cancelada com sucesso"),
      400: errorResponse("Carga em estado terminal ou transição não permitida"),
      404: errorResponse("Carga química não encontrada"),
      500: errorResponse("Erro ao atualizar status da carga"),
    },
  });
}
