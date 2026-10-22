import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../infrastructure/frameworks/database'

interface UsuarioAttributes {
  id: string;
  nomeCompleto: string;
  email: string;
  dataDeContratacao: Date;
  periodoTurno: string;
  status: 'ativo' | 'inativo';
}

interface UsuarioCreationAttributes extends Optional<UsuarioAttributes, 'id'> {}

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
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    nomeCompleto: { type: DataTypes.STRING, allowNull: false, field: 'nome_completo' },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    dataDeContratacao: { type: DataTypes.DATE, allowNull: false, field: 'data_de_contratacao' },
    periodoTurno: { type: DataTypes.STRING, allowNull: false, field: 'periodo_turno' },
    status: { type: DataTypes.ENUM('ativo', 'inativo'), allowNull: false },
  },
  { sequelize, modelName: 'Usuario', tableName: 'usuarios', timestamps: true }
);

interface GrupoAttributes {
  id: string;
  nome: string;
  descricao: string;
}

interface GrupoCreationAttributes extends Optional<GrupoAttributes, 'id'> {}

export class GrupoModel extends Model<GrupoAttributes, GrupoCreationAttributes> implements GrupoAttributes {
  public id!: string;
  public nome!: string;
  public descricao!: string;
}

GrupoModel.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    nome: { type: DataTypes.STRING, allowNull: false },
    descricao: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, modelName: 'Grupo', tableName: 'grupos', timestamps: true }
);

interface PermissaoAttributes {
  id: string;
  nomePermissao: string;
  descricao: string;
}

interface PermissaoCreationAttributes extends Optional<PermissaoAttributes, 'id'> {}

export class PermissaoModel extends Model<PermissaoAttributes, PermissaoCreationAttributes> implements PermissaoAttributes {
  public id!: string;
  public nomePermissao!: string;
  public descricao!: string;
}

PermissaoModel.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    nomePermissao: { type: DataTypes.STRING, allowNull: false, field: 'nome_permissao' },
    descricao: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, modelName: 'Permissao', tableName: 'permissoes', timestamps: true }
);

export class UsuarioGrupoModel extends Model {
  public id!: string;
  public usuarioId!: string;
  public grupoId!: string;
}

UsuarioGrupoModel.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    usuarioId: { type: DataTypes.UUID, allowNull: false, field: 'usuario_fk' },
    grupoId: { type: DataTypes.UUID, allowNull: false, field: 'grupo_fk' },
  },
  { sequelize, modelName: 'UsuarioGrupo', tableName: 'usuario_grupo', timestamps: false }
);

export class GrupoPermissaoModel extends Model {
  public id!: string;
  public grupoId!: string;
  public permissaoId!: string;
}

GrupoPermissaoModel.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    grupoId: { type: DataTypes.UUID, allowNull: false, field: 'grupo_fk' },
    permissaoId: { type: DataTypes.UUID, allowNull: false, field: 'permissao_fk' },
  },
  { sequelize, modelName: 'GrupoPermissao', tableName: 'grupo_permissao', timestamps: false }
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