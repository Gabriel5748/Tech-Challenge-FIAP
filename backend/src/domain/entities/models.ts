import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';

// ==========================================
// 1. PRODUTO QUÍMICO
// ==========================================
export class ProdutoQuimico extends Model {}
ProdutoQuimico.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  classeDeRisco: { type: DataTypes.STRING, allowNull: false, field: 'classe_de_risco' },
  fichaDeSeguranca: { type: DataTypes.STRING, allowNull: true, field: 'ficha_de_seguranca' },
  ativo: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
}, { sequelize, modelName: 'ProdutoQuimico', tableName: 'produtos_quimicos', timestamps: true });

// ==========================================
// 2. ÁREA DE ARMAZENAMENTO
// ==========================================
export class AreaArmazenamento extends Model {}
AreaArmazenamento.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  identificacaoSetor: { type: DataTypes.STRING, allowNull: false, field: 'identificacao_setor' },
  capacidade: { type: DataTypes.DOUBLE, allowNull: false },
  restricoesDeCompatibilidade: { type: DataTypes.TEXT, allowNull: true, field: 'restricoes_de_compatibilidade' },
}, { sequelize, modelName: 'AreaArmazenamento', tableName: 'areas_armazenamento', timestamps: true });

// ==========================================
// 3. RESPONSÁVEL TÉCNICO
// ==========================================
export class ResponsavelTecnico extends Model {}
ResponsavelTecnico.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  crq: { type: DataTypes.STRING, allowNull: false, unique: true },
}, { sequelize, modelName: 'ResponsavelTecnico', tableName: 'responsaveis_tecnicos', timestamps: true });

// ==========================================
// 4. CARGA QUÍMICA (Raiz do Agregado)
// ==========================================
export class CargaQuimica extends Model {}
CargaQuimica.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  quantidadeValor: { type: DataTypes.DOUBLE, allowNull: false, field: 'quantidade_valor' },
  quantidadeUnidade: { type: DataTypes.STRING, allowNull: false, field: 'quantidade_unidade' },
  classificacaoDeRisco: { type: DataTypes.STRING, allowNull: false, field: 'classificacao_de_risco' },
  statusAtual: { type: DataTypes.STRING, defaultValue: 'REGISTRADA', allowNull: false, field: 'status_atual' },
  origem: { type: DataTypes.STRING, allowNull: false },
  destino: { type: DataTypes.STRING, allowNull: false },
}, { sequelize, modelName: 'CargaQuimica', tableName: 'cargas_quimicas', timestamps: true });

// Relacionamentos da Carga Química
CargaQuimica.belongsTo(ProdutoQuimico, { foreignKey: 'produtoQuimicoId', as: 'produtoQuimico' });
ProdutoQuimico.hasMany(CargaQuimica, { foreignKey: 'produtoQuimicoId', as: 'cargas' });

CargaQuimica.belongsTo(ResponsavelTecnico, { foreignKey: 'responsavelTecnicoId', as: 'responsavelTecnico' });
ResponsavelTecnico.hasMany(CargaQuimica, { foreignKey: 'responsavelTecnicoId', as: 'cargas' });

CargaQuimica.belongsTo(AreaArmazenamento, { foreignKey: 'areaArmazenamentoId', as: 'areaArmazenamento' });
AreaArmazenamento.hasMany(CargaQuimica, { foreignKey: 'areaArmazenamentoId', as: 'cargas' });

// ==========================================
// 5. DOCUMENTO DA CARGA
// ==========================================
export class DocumentoCarga extends Model {}
DocumentoCarga.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  tipoDeDocumento: { type: DataTypes.STRING, allowNull: false, field: 'tipo_de_documento' },
  status: { type: DataTypes.STRING, defaultValue: 'PENDENTE', allowNull: false }, // PENDENTE, ANEXADO, VALIDADO
  dataDeAnexacao: { type: DataTypes.DATE, allowNull: true, field: 'data_de_anexacao' },
}, { sequelize, modelName: 'DocumentoCarga', tableName: 'documentos_carga', timestamps: true });

CargaQuimica.hasMany(DocumentoCarga, { foreignKey: 'cargaId', as: 'documentos', onDelete: 'CASCADE' });
DocumentoCarga.belongsTo(CargaQuimica, { foreignKey: 'cargaId', as: 'carga' });

// ==========================================
// 6. INSPEÇÃO
// ==========================================
export class Inspecao extends Model {}
Inspecao.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  dataRealizacao: { type: DataTypes.DATE, allowNull: false, field: 'data_realizacao' },
  inspetorResponsavel: { type: DataTypes.STRING, allowNull: false, field: 'inspetor_responsavel' },
  resultado: { type: DataTypes.STRING, allowNull: false }, // APROVADA, REPROVADA
  finalizada: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
}, { sequelize, modelName: 'Inspecao', tableName: 'inspecoes', timestamps: true });

CargaQuimica.hasMany(Inspecao, { foreignKey: 'cargaId', as: 'inspecoes', onDelete: 'CASCADE' });
Inspecao.belongsTo(CargaQuimica, { foreignKey: 'cargaId', as: 'carga' });

// ==========================================
// 7. SEGURANÇA: USUÁRIO, GRUPO E PERMISSÃO
// ==========================================
export class Usuario extends Model {}
Usuario.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  nomeCompleto: { type: DataTypes.STRING, allowNull: false, field: 'nome_completo' },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  dataDeContratacao: { type: DataTypes.DATEONLY, allowNull: true, field: 'data_de_contratacao' },
  periodoTurno: { type: DataTypes.STRING, allowNull: true, field: 'periodo_turno' },
  status: { type: DataTypes.STRING, defaultValue: 'ATIVO', allowNull: false },
}, { sequelize, modelName: 'Usuario', tableName: 'usuarios', timestamps: true });

export class Credencial extends Model {}
Credencial.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  login: { type: DataTypes.STRING, allowNull: false, unique: true },
  senhaHash: { type: DataTypes.STRING, allowNull: false, field: 'senha_hash' },
}, { sequelize, modelName: 'Credencial', tableName: 'credenciais', timestamps: true });

Usuario.hasOne(Credencial, { foreignKey: 'usuarioId', as: 'credencial', onDelete: 'CASCADE' });
Credencial.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

export class Grupo extends Model {}
Grupo.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  nome: { type: DataTypes.STRING, allowNull: false, unique: true },
  descricao: { type: DataTypes.TEXT, allowNull: true },
}, { sequelize, modelName: 'Grupo', tableName: 'grupos', timestamps: true });

export class Permissao extends Model {}
Permissao.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  nomePermissao: { type: DataTypes.STRING, allowNull: false, unique: true, field: 'nome_permissao' },
  descricao: { type: DataTypes.TEXT, allowNull: true },
}, { sequelize, modelName: 'Permissao', tableName: 'permissoes', timestamps: true });

// Tabelas Associativas N:N
export const UsuarioGrupo = sequelize.define('UsuarioGrupo', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  dataAtribuicao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'data_atribuicao' }
}, { tableName: 'usuario_grupo', timestamps: false });

Usuario.belongsToMany(Grupo, { through: UsuarioGrupo, foreignKey: 'usuarioId', as: 'grupos' });
Grupo.belongsToMany(Usuario, { through: UsuarioGrupo, foreignKey: 'grupoId', as: 'usuarios' });

export const GrupoPermissao = sequelize.define('GrupoPermissao', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  dataAtribuicao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'data_atribuicao' }
}, { tableName: 'grupo_permissao', timestamps: false });

Grupo.belongsToMany(Permissao, { through: GrupoPermissao, foreignKey: 'grupoId', as: 'permissoes' });
Permissao.belongsToMany(Grupo, { through: GrupoPermissao, foreignKey: 'permissaoId', as: 'grupos' });