import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../infrastructure/frameworks/database';

export interface UsuarioAttributes {
  id: string;
  nomeCompleto: string;
  email: string;
  dataDeContratacao: Date;
  periodoTurno: string;
  status: 'ativo' | 'inativo';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UsuarioCreationAttributes extends Optional<UsuarioAttributes, 'id'> {}

export class UsuarioModel extends Model<UsuarioAttributes, UsuarioCreationAttributes> implements UsuarioAttributes {
  public id!: string;
  public nomeCompleto!: string;
  public email!: string;
  public dataDeContratacao!: Date;
  public periodoTurno!: string;
  public status!: 'ativo' | 'inativo';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UsuarioModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nomeCompleto: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'nome_completo',
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    dataDeContratacao: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'data_de_contratacao',
    },
    periodoTurno: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'periodo_turno',
    },
    status: {
      type: DataTypes.ENUM('ativo', 'inativo'),
      allowNull: false,
      defaultValue: 'ativo',
    },
  },
  {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    timestamps: true,
    underscored: true,
  }
);

export interface GrupoAttributes {
  id: string;
  nome: string;
  descricao: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GrupoCreationAttributes extends Optional<GrupoAttributes, 'id'> {}

export class GrupoModel extends Model<GrupoAttributes, GrupoCreationAttributes> implements GrupoAttributes {
  public id!: string;
  public nome!: string;
  public descricao!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

GrupoModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Grupo',
    tableName: 'grupos',
    timestamps: true,
    underscored: true,
  }
);

export interface PermissaoAttributes {
  id: string;
  nomePermissao: string;
  descricao: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PermissaoCreationAttributes extends Optional<PermissaoAttributes, 'id'> {}

export class PermissaoModel extends Model<PermissaoAttributes, PermissaoCreationAttributes> implements PermissaoAttributes {
  public id!: string;
  public nomePermissao!: string;
  public descricao!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PermissaoModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nomePermissao: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'nome_permissao',
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Permissao',
    tableName: 'permissoes',
    timestamps: true,
    underscored: true,
  }
);

export interface UsuarioGrupoAttributes {
  id: string;
  usuarioId: string;
  grupoId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UsuarioGrupoCreationAttributes extends Optional<UsuarioGrupoAttributes, 'id'> {}

export class UsuarioGrupoModel extends Model<UsuarioGrupoAttributes, UsuarioGrupoCreationAttributes> implements UsuarioGrupoAttributes {
  public id!: string;
  public usuarioId!: string;
  public grupoId!: string;
}

UsuarioGrupoModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    usuarioId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'usuario_fk',
      references: {
        model: 'usuarios',
        key: 'id',
      },
    },
    grupoId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'grupo_fk',
      references: {
        model: 'grupos',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'UsuarioGrupo',
    tableName: 'usuario_grupo',
    timestamps: true,
    underscored: true,
  }
);

export interface GrupoPermissaoAttributes {
  id: string;
  grupoId: string;
  permissaoId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GrupoPermissaoCreationAttributes extends Optional<GrupoPermissaoAttributes, 'id'> {}

export class GrupoPermissaoModel extends Model<GrupoPermissaoAttributes, GrupoPermissaoCreationAttributes> implements GrupoPermissaoAttributes {
  public id!: string;
  public grupoId!: string;
  public permissaoId!: string;
}

GrupoPermissaoModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    grupoId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'grupo_fk',
      references: {
        model: 'grupos',
        key: 'id',
      },
    },
    permissaoId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'permissao_fk',
      references: {
        model: 'permissoes',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'GrupoPermissao',
    tableName: 'grupo_permissao',
    timestamps: true,
    underscored: true,
  }
);

export interface ProdutoQuimicoAttributes {
  id: number;
  nome: string;
  formula?: string;
  descricao?: string;
  numeroONU?: string;
  classeRisco?: string;
  grupoCompatibilidade?: string;
  ativo: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProdutoQuimicoCreationAttributes extends Optional<ProdutoQuimicoAttributes, 'id' | 'ativo'> {}

export class ProdutoQuimicoModel extends Model<ProdutoQuimicoAttributes, ProdutoQuimicoCreationAttributes> implements ProdutoQuimicoAttributes {
  public id!: number;
  public nome!: string;
  public formula?: string;
  public descricao?: string;
  public numeroONU?: string;
  public classeRisco?: string;
  public grupoCompatibilidade?: string;
  public ativo!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ProdutoQuimicoModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    formula: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    numeroONU: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'numero_onu',
    },
    classeRisco: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'classe_risco',
    },
    grupoCompatibilidade: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'grupo_compatibilidade',
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'ProdutoQuimico',
    tableName: 'produto_quimico',
    timestamps: true,
    underscored: true,
  }
);

export interface CargaQuimicaAttributes {
  id: number;
  codigo?: string;
  nome: string;
  formula?: string;
  produtoQuimicoId?: number;
  quantidade?: number;
  unidadeMedida?: string;
  origem?: string;
  destino?: string;
  responsavelTecnico?: string;
  documentacaoObrigatoria?: any;
  status: string;
  dataEntrada?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CargaQuimicaCreationAttributes extends Optional<CargaQuimicaAttributes, 'id' | 'status'> {}

export class CargaQuimicaModel extends Model<CargaQuimicaAttributes, CargaQuimicaCreationAttributes> implements CargaQuimicaAttributes {
  public id!: number;
  public codigo?: string;
  public nome!: string;
  public formula?: string;
  public produtoQuimicoId?: number;
  public quantidade?: number;
  public unidadeMedida?: string;
  public origem?: string;
  public destino?: string;
  public responsavelTecnico?: string;
  public documentacaoObrigatoria?: any;
  public status!: string;
  public dataEntrada?: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CargaQuimicaModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    codigo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    formula: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    produtoQuimicoId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'produto_quimico_id',
      references: {
        model: 'produto_quimico',
        key: 'id',
      },
    },
    quantidade: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    unidadeMedida: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'unidade_medida',
    },
    origem: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    destino: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    responsavelTecnico: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'responsavel_tecnico',
    },
    documentacaoObrigatoria: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'documentacao_obrigatoria',
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Registrada',
    },
    dataEntrada: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'data_entrada',
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'CargaQuimica',
    tableName: 'carga_quimica',
    timestamps: true,
    underscored: true,
  }
);

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
