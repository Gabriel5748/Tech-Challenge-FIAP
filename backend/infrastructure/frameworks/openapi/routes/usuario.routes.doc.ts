import { registry, jsonContent, errorResponse, successMessageResponse, z } from "../registry";
import {
  UsuarioSchema,
  NovoUsuarioSchema,
  AtualizarUsuarioSchema,
  AtribuirGrupoSchema,
} from "../schemas";

export function registerUsuarioRoutesDoc() {
  registry.registerPath({
    method: "get",
    path: "/api/usuarios",
    tags: ["Usuários"],
    summary: "Listar todos os usuários",
    description: "Retorna a listagem de todos os usuários registrados no sistema, com seus respectivos grupos.",
    responses: {
      200: jsonContent(z.array(UsuarioSchema), "Lista de usuários obtida com sucesso"),
      500: errorResponse("Erro interno ao listar usuários"),
    },
  });

  registry.registerPath({
    method: "get",
    path: "/api/usuarios/{id}",
    tags: ["Usuários"],
    summary: "Buscar usuário por ID",
    description: "Obtém os detalhes de um usuário pelo seu identificador único (UUID).",
    request: {
      params: z.object({
        id: z.string().openapi({
          description: "Identificador UUID do usuário",
          example: "d290f1ee-6c54-4b01-90e6-d701748f0851",
        }),
      }),
    },
    responses: {
      200: jsonContent(UsuarioSchema, "Usuário encontrado com sucesso"),
      400: errorResponse("ID do usuário inválido ou não fornecido"),
      404: errorResponse("Usuário não encontrado"),
      500: errorResponse("Erro interno ao buscar usuário"),
    },
  });

  registry.registerPath({
    method: "post",
    path: "/api/usuarios",
    tags: ["Usuários"],
    summary: "Cadastrar novo usuário",
    description: "Registra um novo colaborador/usuário no sistema QuimiPort.",
    request: {
      body: {
        content: {
          "application/json": {
            schema: NovoUsuarioSchema,
          },
        },
      },
    },
    responses: {
      201: jsonContent(
        z.object({
          mensagem: z.string().openapi({ example: "Usuário cadastrado com sucesso." }),
          usuario: UsuarioSchema,
        }),
        "Usuário cadastrado com sucesso"
      ),
      400: errorResponse("Campos obrigatórios ausentes ou inválidos"),
      409: errorResponse("E-mail já cadastrado por outro usuário"),
      500: errorResponse("Erro interno ao cadastrar usuário"),
    },
  });

  registry.registerPath({
    method: "put",
    path: "/api/usuarios/{id}",
    tags: ["Usuários"],
    summary: "Atualizar usuário existente",
    description: "Atualiza os dados cadastrais de um usuário identificado por seu UUID.",
    request: {
      params: z.object({
        id: z.string().openapi({
          description: "Identificador UUID do usuário",
          example: "d290f1ee-6c54-4b01-90e6-d701748f0851",
        }),
      }),
      body: {
        content: {
          "application/json": {
            schema: AtualizarUsuarioSchema,
          },
        },
      },
    },
    responses: {
      200: jsonContent(
        z.object({
          mensagem: z.string().openapi({ example: "Usuário atualizado com sucesso." }),
          usuario: UsuarioSchema,
        }),
        "Usuário atualizado com sucesso"
      ),
      400: errorResponse("ID ou dados inválidos"),
      404: errorResponse("Usuário não encontrado para atualização"),
      409: errorResponse("E-mail já está em uso por outro usuário"),
      500: errorResponse("Erro interno ao atualizar usuário"),
    },
  });

  registry.registerPath({
    method: "delete",
    path: "/api/usuarios/{id}",
    tags: ["Usuários"],
    summary: "Deletar usuário",
    description: "Remove um usuário do sistema a partir do seu ID.",
    request: {
      params: z.object({
        id: z.string().openapi({
          description: "Identificador UUID do usuário",
          example: "d290f1ee-6c54-4b01-90e6-d701748f0851",
        }),
      }),
    },
    responses: {
      204: {
        description: "Usuário deletado com sucesso (sem corpo de retorno)",
      },
      400: errorResponse("ID inválido"),
      404: errorResponse("Usuário não encontrado"),
      500: errorResponse("Erro interno ao deletar usuário"),
    },
  });

  registry.registerPath({
    method: "post",
    path: "/api/usuarios/{id}/grupos",
    tags: ["Usuários"],
    summary: "Atribuir grupo ao usuário",
    description: "Vincula um grupo de permissões ao usuário identificado.",
    request: {
      params: z.object({
        id: z.string().openapi({
          description: "Identificador UUID do usuário",
          example: "d290f1ee-6c54-4b01-90e6-d701748f0851",
        }),
      }),
      body: {
        content: {
          "application/json": {
            schema: AtribuirGrupoSchema,
          },
        },
      },
    },
    responses: {
      200: successMessageResponse("Grupo atribuído com sucesso"),
      400: errorResponse("Campos inválidos ou erro ao atribuir"),
      404: errorResponse("Usuário ou Grupo não encontrado"),
      500: errorResponse("Erro interno"),
    },
  });
}
