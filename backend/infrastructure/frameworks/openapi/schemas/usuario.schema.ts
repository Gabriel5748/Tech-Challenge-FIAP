import { registry, z } from "../registry";

export const GrupoSchema = registry.register(
  "Grupo",
  z.object({
    id: z.string().openapi({
      description: "Identificador do grupo",
      example: "b1a7d6e4-3209-4ce1-8fa1-7f9cb814041b",
    }),
    nome: z.string().openapi({
      description: "Nome do grupo de permissões",
      example: "Operadores",
    }),
    descricao: z.string().openapi({
      description: "Descrição das atribuições do grupo",
      example: "Operadores portuários responsáveis pela movimentação",
    }),
  }).openapi({
    description: "Grupo de acesso e permissões",
  })
);

export const NovoGrupoSchema = registry.register(
  "NovoGrupoInput",
  z.object({
    nome: z.string().min(1, "O nome do grupo é obrigatório").openapi({
      description: "Nome do grupo de permissões",
      example: "Operadores",
    }),
    descricao: z.string().optional().openapi({
      description: "Descrição das atribuições do grupo",
      example: "Operadores portuários responsáveis pela movimentação",
    }),
  }).openapi({
    description: "Dados para cadastro de um novo grupo",
  })
);

export const UsuarioSchema = registry.register(
  "Usuario",
  z.object({
    id: z.string().openapi({
      description: "Identificador único do usuário (UUID)",
      example: "d290f1ee-6c54-4b01-90e6-d701748f0851",
    }),
    nomeCompleto: z.string().openapi({
      description: "Nome completo do usuário",
      example: "Gabriel Santos",
    }),
    email: z.string().openapi({
      description: "Endereço de e-mail único do usuário",
      example: "gabriel@exemplo.com",
    }),
    dataDeContratacao: z.union([z.string(), z.date()]).openapi({
      description: "Data de contratação do colaborador",
      example: "2026-01-15T00:00:00.000Z",
    }),
    periodoTurno: z.string().openapi({
      description: "Turno de trabalho",
      example: "Manhã",
    }),
    status: z.enum(["ativo", "inativo"]).openapi({
      description: "Status do usuário no sistema",
      example: "ativo",
    }),
    grupos: z.array(GrupoSchema).optional().openapi({
      description: "Lista de grupos aos quais o usuário pertence",
    }),
  }).openapi({
    description: "Entidade de Usuário do QuimiPort",
  })
);

export const NovoUsuarioSchema = registry.register(
  "NovoUsuarioInput",
  z.object({
    nomeCompleto: z.string().min(1, "O nome completo é obrigatório").openapi({
      description: "Nome completo do usuário",
      example: "Gabriel Santos",
    }),
    email: z.string().openapi({
      description: "E-mail corporativo válido",
      example: "gabriel@exemplo.com",
    }),
    dataDeContratacao: z.string().min(1, "A data de contratação é obrigatória").openapi({
      description: "Data de contratação em formato ISO ou YYYY-MM-DD",
      example: "2026-01-15",
    }),
    periodoTurno: z.string().min(1, "O período do turno é obrigatório").openapi({
      description: "Turno designado (ex: Manhã, Tarde, Noite)",
      example: "Manhã",
    }),
    status: z.enum(["ativo", "inativo"]).optional().default("ativo").openapi({
      description: "Status inicial do usuário",
      example: "ativo",
    }),
  }).openapi({
    description: "Dados para cadastro de um novo usuário (vínculo com grupos feito via /api/usuarios/{id}/grupos)",
  })
);

export const AtualizarUsuarioSchema = registry.register(
  "AtualizarUsuarioInput",
  z.object({
    nomeCompleto: z.string().optional().openapi({
      example: "Gabriel Santos Atualizado",
    }),
    email: z.string().optional().openapi({
      example: "gabriel.novo@exemplo.com",
    }),
    dataDeContratacao: z.string().optional().openapi({
      example: "2026-01-15",
    }),
    periodoTurno: z.string().optional().openapi({
      example: "Tarde",
    }),
    status: z.enum(["ativo", "inativo"]).optional().openapi({
      example: "ativo",
    }),
  }).openapi({
    description: "Dados para atualização de um usuário existente",
  })
);

export const AtribuirGrupoSchema = registry.register(
  "AtribuirGrupoInput",
  z.object({
    grupoId: z.string().min(1, "O campo grupoId é obrigatório").openapi({
      description: "Identificador do grupo a ser vinculado ao usuário",
      example: "b1a7d6e4-3209-4ce1-8fa1-7f9cb814041b",
    }),
  }).openapi({
    description: "Identificador do grupo para vinculação",
  })
);
