import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';

// ==========================================
// 1. PRODUTO QUÍMICO
// ==========================================
export class ProdutoQuimico extends Model {}
ProdutoQuimico.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  classe_de_risco: { type: DataTypes.STRING, allowNull: false },
  ficha_de_seguranca: { type: DataTypes.STRING, allowNull: true },
  ativo: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
}, { sequelize, modelName: 'ProdutoQuimico', tableName: 'produtos_quimicos', timestamps: true, underscored: true });

// ==========================================
// 2. ÁREA DE ARMAZENAMENTO
// ==========================================
export class AreaArmazenamento extends Model {}
AreaArmazenamento.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  identificacao_setor: { type: DataTypes.STRING, allowNull: false },
  capacidade: { type: DataTypes.DOUBLE, allowNull: false },
  restricoes_de_compatibilidade: { type: DataTypes.TEXT, allowNull: true },
}, { sequelize, modelName: 'AreaArmazenamento', tableName: 'areas_armazenamento', timestamps: true, underscored: true });

// ==========================================
// 3. RESPONSÁVEL TÉCNICO
// ==========================================
export class ResponsavelTecnico extends Model {}
ResponsavelTecnico.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  crq: { type: DataTypes.STRING, allowNull: false, unique: true },
}, { sequelize, modelName: 'ResponsavelTecnico', tableName: 'responsaveis_tecnicos', timestamps: true, underscored: true });

// ==========================================
// 4. CARGA QUÍMICA (Raiz do Agregado)
// ==========================================
export class CargaQuimica extends Model {}
CargaQuimica.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  quantidade_valor: { type: DataTypes.DOUBLE, allowNull: false },
  quantidade_unidade: { type: DataTypes.STRING, allowNull: false },
  classificacao_de_risco: { type: DataTypes.STRING, allowNull: false },
  status_atual: { type: DataTypes.STRING, defaultValue: 'REGISTRADA', allowNull: false },
  origem: { type: DataTypes.STRING, allowNull: false },
  destino: { type: DataTypes.STRING, allowNull: false },
  produto_quimico_id: { type: DataTypes.INTEGER, allowNull: false },
  responsavel_tecnico_id: { type: DataTypes.INTEGER, allowNull: false },
  area_armazenamento_id: { type: DataTypes.INTEGER, allowNull: false },
}, { sequelize, modelName: 'CargaQuimica', tableName: 'cargas_quimicas', timestamps: true, underscored: true });

// Relacionamentos da Carga Química
CargaQuimica.belongsTo(ProdutoQuimico, { foreignKey: 'produto_quimico_id', as: 'produtoQuimico' });
ProdutoQuimico.hasMany(CargaQuimica, { foreignKey: 'produto_quimico_id', as: 'cargas' });

CargaQuimica.belongsTo(ResponsavelTecnico, { foreignKey: 'responsavel_tecnico_id', as: 'responsavelTecnico' });
ResponsavelTecnico.hasMany(CargaQuimica, { foreignKey: 'responsavel_tecnico_id', as: 'cargas' });

CargaQuimica.belongsTo(AreaArmazenamento, { foreignKey: 'area_armazenamento_id', as: 'areaArmazenamento' });
AreaArmazenamento.hasMany(CargaQuimica, { foreignKey: 'area_armazenamento_id', as: 'cargas' });

// ==========================================
// 5. DOCUMENTO DA CARGA
// ==========================================
export class DocumentoCarga extends Model {}
DocumentoCarga.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  tipo_de_documento: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'PENDENTE', allowNull: false }, // PENDENTE, ANEXADO, VALIDADO
  data_de_anexacao: { type: DataTypes.DATE, allowNull: true },
  carga_id: { type: DataTypes.INTEGER, allowNull: false },
}, { sequelize, modelName: 'DocumentoCarga', tableName: 'documentos_carga', timestamps: true, underscored: true });

CargaQuimica.hasMany(DocumentoCarga, { foreignKey: 'carga_id', as: 'documentos', onDelete: 'CASCADE' });
DocumentoCarga.belongsTo(CargaQuimica, { foreignKey: 'carga_id', as: 'carga' });

// ==========================================
// 6. INSPEÇÃO
// ==========================================
export class Inspecao extends Model {}
Inspecao.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  data_realizacao: { type: DataTypes.DATE, allowNull: false },
  inspetor_responsavel: { type: DataTypes.STRING, allowNull: false },
  resultado: { type: DataTypes.STRING, allowNull: false }, // APROVADA, REPROVADA
  finalizada: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
  carga_id: { type: DataTypes.INTEGER, allowNull: false },
}, { sequelize, modelName: 'Inspecao', tableName: 'inspecoes', timestamps: true, underscored: true });

CargaQuimica.hasMany(Inspecao, { foreignKey: 'carga_id', as: 'inspecoes', onDelete: 'CASCADE' });
Inspecao.belongsTo(CargaQuimica, { foreignKey: 'carga_id', as: 'carga' });

// ==========================================
// 7. SEGURANÇA: USUÁRIO, GRUPO E PERMISSÃO
// ==========================================
export class Usuario extends Model {}
Usuario.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nome_completo: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  data_de_contratacao: { type: DataTypes.DATEONLY, allowNull: true },
  periodo_turno: { type: DataTypes.STRING, allowNull: true },
  status: { type: DataTypes.STRING, defaultValue: 'ATIVO', allowNull: false },
}, { sequelize, modelName: 'Usuario', tableName: 'usuarios', timestamps: true, underscored: true });

export class Credencial extends Model {}
Credencial.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  login: { type: DataTypes.STRING, allowNull: false, unique: true },
  senha_hash: { type: DataTypes.STRING, allowNull: false },
  usuario_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
}, { sequelize, modelName: 'Credencial', tableName: 'credenciais', timestamps: true, underscored: true });

Usuario.hasOne(Credencial, { foreignKey: 'usuario_id', as: 'credencial', onDelete: 'CASCADE' });
Credencial.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

export class Grupo extends Model {}
Grupo.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nome: { type: DataTypes.STRING, allowNull: false, unique: true },
  descricao: { type: DataTypes.TEXT, allowNull: true },
}, { sequelize, modelName: 'Grupo', tableName: 'grupos', timestamps: true, underscored: true });

export class Permissao extends Model {}
Permissao.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nome_permissao: { type: DataTypes.STRING, allowNull: false, unique: true },
  descricao: { type: DataTypes.TEXT, allowNull: true },
}, { sequelize, modelName: 'Permissao', tableName: 'permissoes', timestamps: true, underscored: true });

// Tabelas Associativas N:N
export const UsuarioGrupo = sequelize.define('UsuarioGrupo', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  data_atribuicao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  usuario_id: { type: DataTypes.INTEGER, allowNull: false },
  grupo_id: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'usuario_grupo', timestamps: false, underscored: true });

Usuario.belongsToMany(Grupo, { through: UsuarioGrupo, foreignKey: 'usuario_id', as: 'grupos' });
Grupo.belongsToMany(Usuario, { through: UsuarioGrupo, foreignKey: 'grupo_id', as: 'usuarios' });

export const GrupoPermissao = sequelize.define('GrupoPermissao', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  data_atribuicao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  grupo_id: { type: DataTypes.INTEGER, allowNull: false },
  permissao_id: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'grupo_permissao', timestamps: false, underscored: true });

Grupo.belongsToMany(Permissao, { through: GrupoPermissao, foreignKey: 'grupo_id', as: 'permissoes' });
Permissao.belongsToMany(Grupo, { through: GrupoPermissao, foreignKey: 'permissao_id', as: 'grupos' });