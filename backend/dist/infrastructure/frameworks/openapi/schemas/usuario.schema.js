"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtribuirGrupoSchema = exports.AtualizarUsuarioSchema = exports.NovoUsuarioSchema = exports.UsuarioSchema = exports.GrupoSchema = void 0;
const registry_1 = require("../registry");
exports.GrupoSchema = registry_1.registry.register("Grupo", registry_1.z.object({
    id: registry_1.z.string().openapi({
        description: "Identificador do grupo",
        example: "b1a7d6e4-3209-4ce1-8fa1-7f9cb814041b",
    }),
    nome: registry_1.z.string().openapi({
        description: "Nome do grupo de permissões",
        example: "Operadores",
    }),
    descricao: registry_1.z.string().openapi({
        description: "Descrição das atribuições do grupo",
        example: "Operadores portuários responsáveis pela movimentação",
    }),
}).openapi({
    description: "Grupo de acesso e permissões",
}));
exports.UsuarioSchema = registry_1.registry.register("Usuario", registry_1.z.object({
    id: registry_1.z.string().openapi({
        description: "Identificador único do usuário (UUID)",
        example: "d290f1ee-6c54-4b01-90e6-d701748f0851",
    }),
    nomeCompleto: registry_1.z.string().openapi({
        description: "Nome completo do usuário",
        example: "Gabriel Santos",
    }),
    email: registry_1.z.string().openapi({
        description: "Endereço de e-mail único do usuário",
        example: "gabriel@exemplo.com",
    }),
    dataDeContratacao: registry_1.z.union([registry_1.z.string(), registry_1.z.date()]).openapi({
        description: "Data de contratação do colaborador",
        example: "2026-01-15T00:00:00.000Z",
    }),
    periodoTurno: registry_1.z.string().openapi({
        description: "Turno de trabalho",
        example: "Manhã",
    }),
    status: registry_1.z.enum(["ativo", "inativo"]).openapi({
        description: "Status do usuário no sistema",
        example: "ativo",
    }),
    grupos: registry_1.z.array(exports.GrupoSchema).optional().openapi({
        description: "Lista de grupos aos quais o usuário pertence",
    }),
}).openapi({
    description: "Entidade de Usuário do QuimiPort",
}));
exports.NovoUsuarioSchema = registry_1.registry.register("NovoUsuarioInput", registry_1.z.object({
    nomeCompleto: registry_1.z.string().min(1, "O nome completo é obrigatório").openapi({
        description: "Nome completo do usuário",
        example: "Gabriel Santos",
    }),
    email: registry_1.z.string().openapi({
        description: "E-mail corporativo válido",
        example: "gabriel@exemplo.com",
    }),
    dataDeContratacao: registry_1.z.string().min(1, "A data de contratação é obrigatória").openapi({
        description: "Data de contratação em formato ISO ou YYYY-MM-DD",
        example: "2026-01-15",
    }),
    periodoTurno: registry_1.z.string().min(1, "O período do turno é obrigatório").openapi({
        description: "Turno designado (ex: Manhã, Tarde, Noite)",
        example: "Manhã",
    }),
    status: registry_1.z.enum(["ativo", "inativo"]).optional().default("ativo").openapi({
        description: "Status inicial do usuário",
        example: "ativo",
    }),
    gruposIds: registry_1.z.array(registry_1.z.string()).optional().openapi({
        description: "Lista opcional de IDs dos grupos para associação imediata",
        example: ["b1a7d6e4-3209-4ce1-8fa1-7f9cb814041b"],
    }),
}).openapi({
    description: "Dados para cadastro de um novo usuário",
}));
exports.AtualizarUsuarioSchema = registry_1.registry.register("AtualizarUsuarioInput", registry_1.z.object({
    nomeCompleto: registry_1.z.string().optional().openapi({
        example: "Gabriel Santos Atualizado",
    }),
    email: registry_1.z.string().optional().openapi({
        example: "gabriel.novo@exemplo.com",
    }),
    dataDeContratacao: registry_1.z.string().optional().openapi({
        example: "2026-01-15",
    }),
    periodoTurno: registry_1.z.string().optional().openapi({
        example: "Tarde",
    }),
    status: registry_1.z.enum(["ativo", "inativo"]).optional().openapi({
        example: "ativo",
    }),
    gruposIds: registry_1.z.array(registry_1.z.string()).optional().openapi({
        example: ["b1a7d6e4-3209-4ce1-8fa1-7f9cb814041b"],
    }),
}).openapi({
    description: "Dados para atualização de um usuário existente",
}));
exports.AtribuirGrupoSchema = registry_1.registry.register("AtribuirGrupoInput", registry_1.z.object({
    grupoId: registry_1.z.string().min(1, "O campo grupoId é obrigatório").openapi({
        description: "Identificador do grupo a ser vinculado ao usuário",
        example: "b1a7d6e4-3209-4ce1-8fa1-7f9cb814041b",
    }),
}).openapi({
    description: "Identificador do grupo para vinculação",
}));
