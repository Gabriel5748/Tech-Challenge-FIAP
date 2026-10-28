"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioRepository = void 0;
const models_1 = require("../../src/core/models");
const grupos_1 = require("../../src/domain/entities/grupos");
const permissoes_1 = require("../../src/domain/entities/permissoes");
const usuarios_1 = require("../../src/domain/entities/usuarios");
class UsuarioRepository {
    async buscarPorId(id) {
        const resultado = await models_1.UsuarioModel.findByPk(id, {
            include: [
                {
                    model: models_1.GrupoModel,
                    as: 'grupos',
                    include: [{ model: models_1.PermissaoModel, as: 'permissoes' }],
                },
            ],
        });
        if (!resultado)
            return null;
        const gruposDomain = (resultado.grupos || []).map((g) => {
            const permissoesDomain = (g.permissoes || []).map((p) => new permissoes_1.Permissoes(p.id, p.nomePermissao, p.descricao));
            return new grupos_1.Grupos(g.id, g.nome, g.descricao, permissoesDomain);
        });
        return new usuarios_1.Usuario(resultado.id, resultado.nomeCompleto, resultado.email, resultado.dataDeContratacao, resultado.periodoTurno, resultado.status, gruposDomain);
    }
    async buscarPorEmail(email) {
        const resultado = await models_1.UsuarioModel.findOne({
            where: { email },
            include: [
                {
                    model: models_1.GrupoModel,
                    as: 'grupos',
                    include: [{ model: models_1.PermissaoModel, as: 'permissoes' }],
                },
            ],
        });
        if (!resultado)
            return null;
        const gruposDomain = (resultado.grupos || []).map((g) => {
            const permissoesDomain = (g.permissoes || []).map((p) => new permissoes_1.Permissoes(p.id, p.nomePermissao, p.descricao));
            return new grupos_1.Grupos(g.id, g.nome, g.descricao, permissoesDomain);
        });
        return new usuarios_1.Usuario(resultado.id, resultado.nomeCompleto, resultado.email, resultado.dataDeContratacao, resultado.periodoTurno, resultado.status, gruposDomain);
    }
    async listarTodos() {
        const resultados = await models_1.UsuarioModel.findAll({
            include: [
                {
                    model: models_1.GrupoModel,
                    as: 'grupos',
                    include: [{ model: models_1.PermissaoModel, as: 'permissoes' }],
                },
            ],
        });
        return resultados.map((resultado) => {
            const gruposDomain = (resultado.grupos || []).map((g) => {
                const permissoesDomain = (g.permissoes || []).map((p) => new permissoes_1.Permissoes(p.id, p.nomePermissao, p.descricao));
                return new grupos_1.Grupos(g.id, g.nome, g.descricao, permissoesDomain);
            });
            return new usuarios_1.Usuario(resultado.id, resultado.nomeCompleto, resultado.email, resultado.dataDeContratacao, resultado.periodoTurno, resultado.status, gruposDomain);
        });
    }
    async salvar(usuario) {
        const dados = {
            nomeCompleto: usuario.nomeCompleto,
            email: usuario.email,
            dataDeContratacao: usuario.dataDeContratacao,
            periodoTurno: usuario.periodoTurno,
            status: usuario.status,
        };
        if (usuario.id) {
            dados.id = usuario.id;
        }
        const usuarioModel = await models_1.UsuarioModel.create(dados);
        const grupos = usuario.getGrupos();
        if (grupos.length > 0) {
            await usuarioModel.setGrupos(grupos.map((g) => g.id));
        }
    }
    async atualizar(usuario) {
        await models_1.UsuarioModel.update({
            nomeCompleto: usuario.nomeCompleto,
            email: usuario.email,
            dataDeContratacao: usuario.dataDeContratacao,
            periodoTurno: usuario.periodoTurno,
            status: usuario.status,
        }, {
            where: { id: usuario.id },
        });
        const usuarioModel = await models_1.UsuarioModel.findByPk(usuario.id);
        if (usuarioModel) {
            const gruposIds = usuario.getGrupos().map((g) => g.id);
            await usuarioModel.setGrupos(gruposIds);
        }
    }
    async deletar(id) {
        await models_1.UsuarioModel.destroy({
            where: { id },
        });
    }
}
exports.UsuarioRepository = UsuarioRepository;
