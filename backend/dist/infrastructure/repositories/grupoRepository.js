"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrupoRepository = void 0;
const models_1 = require("../../src/core/models");
const grupos_1 = require("../../src/domain/entities/grupos");
const permissoes_1 = require("../../src/domain/entities/permissoes");
class GrupoRepository {
    async salvar(grupo) {
        const grupoModel = await models_1.GrupoModel.create({
            id: grupo.id,
            nome: grupo.nome,
            descricao: grupo.descricao,
        });
        const permissoes = grupo.getPermissoes();
        if (permissoes.length > 0) {
            await grupoModel.addPermissoes(permissoes.map(p => p.id));
        }
    }
    async buscarPorId(id) {
        const registro = await models_1.GrupoModel.findByPk(id, {
            include: [
                {
                    model: models_1.PermissaoModel,
                    as: 'permissoes',
                },
            ],
        });
        if (!registro)
            return null;
        const permissoesDomain = registro.permissoes.map((p) => new permissoes_1.Permissoes(p.id, p.nomePermissao, p.descricao));
        return new grupos_1.Grupos(registro.id, registro.nome, registro.descricao, permissoesDomain);
    }
    async listarPorIds(ids) {
        const registros = await models_1.GrupoModel.findAll({
            where: {
                id: ids,
            },
            include: [
                {
                    model: models_1.PermissaoModel,
                    as: 'permissoes',
                },
            ],
        });
        return registros.map((registro) => {
            const permissoesDomain = registro.permissoes.map((p) => new permissoes_1.Permissoes(p.id, p.nomePermissao, p.descricao));
            return new grupos_1.Grupos(registro.id, registro.nome, registro.descricao, permissoesDomain);
        });
    }
    async listarTodos() {
        const registros = await models_1.GrupoModel.findAll({
            include: [
                {
                    model: models_1.PermissaoModel,
                    as: 'permissoes',
                },
            ],
        });
        return registros.map((registro) => {
            const permissoesDomain = registro.permissoes.map((p) => new permissoes_1.Permissoes(p.id, p.nomePermissao, p.descricao));
            return new grupos_1.Grupos(registro.id, registro.nome, registro.descricao, permissoesDomain);
        });
    }
    async atualizar(grupo) {
        await models_1.GrupoModel.update({
            nome: grupo.nome,
            descricao: grupo.descricao,
        }, {
            where: { id: grupo.id },
        });
        const grupoModel = await models_1.GrupoModel.findByPk(grupo.id);
        if (grupoModel) {
            const permissoesIds = grupo.getPermissoes().map(p => p.id);
            await grupoModel.setPermissoes(permissoesIds);
        }
    }
    async deletar(id) {
        await models_1.GrupoModel.destroy({
            where: { id },
        });
    }
}
exports.GrupoRepository = GrupoRepository;
