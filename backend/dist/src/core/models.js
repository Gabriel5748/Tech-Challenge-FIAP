"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CargaQuimicaModel = exports.ProdutoQuimicoModel = exports.GrupoPermissaoModel = exports.UsuarioGrupoModel = exports.PermissaoModel = exports.GrupoModel = exports.UsuarioModel = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../../infrastructure/frameworks/database");
class UsuarioModel extends sequelize_1.Model {
    id;
    nomeCompleto;
    email;
    dataDeContratacao;
    periodoTurno;
    status;
    createdAt;
    updatedAt;
}
exports.UsuarioModel = UsuarioModel;
UsuarioModel.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    nomeCompleto: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        field: 'nome_completo',
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    dataDeContratacao: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        field: 'data_de_contratacao',
    },
    periodoTurno: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        field: 'periodo_turno',
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('ativo', 'inativo'),
        allowNull: false,
        defaultValue: 'ativo',
    },
}, {
    sequelize: database_1.sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    timestamps: true,
    underscored: true,
});
class GrupoModel extends sequelize_1.Model {
    id;
    nome;
    descricao;
    createdAt;
    updatedAt;
}
exports.GrupoModel = GrupoModel;
GrupoModel.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    nome: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    descricao: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    modelName: 'Grupo',
    tableName: 'grupos',
    timestamps: true,
    underscored: true,
});
class PermissaoModel extends sequelize_1.Model {
    id;
    nomePermissao;
    descricao;
    createdAt;
    updatedAt;
}
exports.PermissaoModel = PermissaoModel;
PermissaoModel.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    nomePermissao: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        field: 'nome_permissao',
    },
    descricao: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    modelName: 'Permissao',
    tableName: 'permissoes',
    timestamps: true,
    underscored: true,
});
class UsuarioGrupoModel extends sequelize_1.Model {
    id;
    usuarioId;
    grupoId;
}
exports.UsuarioGrupoModel = UsuarioGrupoModel;
UsuarioGrupoModel.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    usuarioId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        field: 'usuario_fk',
        references: {
            model: 'usuarios',
            key: 'id',
        },
    },
    grupoId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        field: 'grupo_fk',
        references: {
            model: 'grupos',
            key: 'id',
        },
    },
}, {
    sequelize: database_1.sequelize,
    modelName: 'UsuarioGrupo',
    tableName: 'usuario_grupo',
    timestamps: true,
    underscored: true,
});
class GrupoPermissaoModel extends sequelize_1.Model {
    id;
    grupoId;
    permissaoId;
}
exports.GrupoPermissaoModel = GrupoPermissaoModel;
GrupoPermissaoModel.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    grupoId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        field: 'grupo_fk',
        references: {
            model: 'grupos',
            key: 'id',
        },
    },
    permissaoId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        field: 'permissao_fk',
        references: {
            model: 'permissoes',
            key: 'id',
        },
    },
}, {
    sequelize: database_1.sequelize,
    modelName: 'GrupoPermissao',
    tableName: 'grupo_permissao',
    timestamps: true,
    underscored: true,
});
class ProdutoQuimicoModel extends sequelize_1.Model {
    id;
    nome;
    formula;
    descricao;
    numeroONU;
    classeRisco;
    grupoCompatibilidade;
    ativo;
    createdAt;
    updatedAt;
}
exports.ProdutoQuimicoModel = ProdutoQuimicoModel;
ProdutoQuimicoModel.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    formula: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    descricao: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    numeroONU: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        field: 'numero_onu',
    },
    classeRisco: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        field: 'classe_risco',
    },
    grupoCompatibilidade: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        field: 'grupo_compatibilidade',
    },
    ativo: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
}, {
    sequelize: database_1.sequelize,
    modelName: 'ProdutoQuimico',
    tableName: 'produto_quimico',
    timestamps: true,
    underscored: true,
});
class CargaQuimicaModel extends sequelize_1.Model {
    id;
    nome;
    formula;
    produtoQuimicoId;
    quantidade;
    unidadeMedida;
    origem;
    destino;
    responsavelTecnico;
    documentacaoObrigatoria;
    status;
    dataEntrada;
    createdAt;
    updatedAt;
}
exports.CargaQuimicaModel = CargaQuimicaModel;
CargaQuimicaModel.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    formula: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    produtoQuimicoId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        field: 'produto_quimico_id',
        references: {
            model: 'produto_quimico',
            key: 'id',
        },
    },
    quantidade: {
        type: sequelize_1.DataTypes.DECIMAL,
        allowNull: true,
    },
    unidadeMedida: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        field: 'unidade_medida',
    },
    origem: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    destino: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    responsavelTecnico: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        field: 'responsavel_tecnico',
    },
    documentacaoObrigatoria: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: true,
        field: 'documentacao_obrigatoria',
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pendente',
    },
    dataEntrada: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        field: 'data_entrada',
    },
}, {
    sequelize: database_1.sequelize,
    modelName: 'CargaQuimica',
    tableName: 'carga_quimica',
    timestamps: true,
    underscored: true,
});
/* =========================================================
 * ASSOCIATIONS
 * ========================================================= */
UsuarioModel.belongsToMany(GrupoModel, {
    through: UsuarioGrupoModel,
    foreignKey: 'usuarioId',
    otherKey: 'grupoId',
    as: 'grupos',
});
GrupoModel.belongsToMany(UsuarioModel, {
    through: UsuarioGrupoModel,
    foreignKey: 'grupoId',
    otherKey: 'usuarioId',
    as: 'usuarios',
});
GrupoModel.belongsToMany(PermissaoModel, {
    through: GrupoPermissaoModel,
    foreignKey: 'grupoId',
    otherKey: 'permissaoId',
    as: 'permissoes',
});
PermissaoModel.belongsToMany(GrupoModel, {
    through: GrupoPermissaoModel,
    foreignKey: 'permissaoId',
    otherKey: 'grupoId',
    as: 'grupos',
});
CargaQuimicaModel.belongsTo(ProdutoQuimicoModel, {
    foreignKey: 'produtoQuimicoId',
    as: 'produtoQuimico',
});
ProdutoQuimicoModel.hasMany(CargaQuimicaModel, {
    foreignKey: 'produtoQuimicoId',
    as: 'cargas',
});
