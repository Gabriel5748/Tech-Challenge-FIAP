import { IGrupoRepository } from "../../src/domain/interfaces/grupoRepository";
import { GrupoModel, PermissaoModel } from "../../src/core/models";
import { Grupos } from "../../src/domain/entities/grupos";
import { Permissoes } from "../../src/domain/entities/permissoes";

export class GrupoRepository implements IGrupoRepository {
  async salvar(grupo: Grupos): Promise<void> {
    const dados: any = {
      nome: grupo.nome,
      descricao: grupo.descricao,
    };

    const grupoModel = await GrupoModel.create(dados);

    const permissoes = grupo.getPermissoes();
    if (permissoes.length > 0) {
      await (grupoModel as any).addPermissoes(permissoes.map(p => p.id));
    }
  }

  async buscarPorId(id: string): Promise<Grupos | null> {
    const registro = await GrupoModel.findByPk(id, {
      include: [
        {
          model: PermissaoModel,
          as: 'permissoes',
        },
      ],
    });

    if (!registro) return null;

    const permissoesDomain = ((registro as any).permissoes || []).map(
      (p: any) => new Permissoes(p.id, p.nomePermissao, p.descricao)
    );

    return new Grupos(
      registro.id,
      registro.nome,
      registro.descricao,
      permissoesDomain
    );
  }

  async listarPorIds(ids: string[]): Promise<Grupos[]> {
    const registros = await GrupoModel.findAll({
      where: {
        id: ids,
      },
      include: [
        {
          model: PermissaoModel,
          as: 'permissoes',
        },
      ],
    });

    return registros.map((registro: any) => {
      const permissoesDomain = (registro.permissoes || []).map(
        (p: any) => new Permissoes(p.id, p.nomePermissao, p.descricao)
      );

      return new Grupos(
        registro.id,
        registro.nome,
        registro.descricao,
        permissoesDomain
      );
    });
  }

  async listarTodos(): Promise<Grupos[]> {
    const registros = await GrupoModel.findAll({
      include: [
        {
          model: PermissaoModel,
          as: 'permissoes',
        },
      ],
    });

    return registros.map((registro: any) => {
      const permissoesDomain = (registro.permissoes || []).map(
        (p: any) => new Permissoes(p.id, p.nomePermissao, p.descricao)
      );

      return new Grupos(
        registro.id,
        registro.nome,
        registro.descricao,
        permissoesDomain
      );
    });
  }

  async atualizar(grupo: Grupos): Promise<void> {
    await GrupoModel.update(
      {
        nome: grupo.nome,
        descricao: grupo.descricao,
      },
      {
        where: { id: grupo.id },
      }
    );

    const grupoModel = await GrupoModel.findByPk(grupo.id);
    if (grupoModel) {
      const permissoesIds = grupo.getPermissoes().map(p => p.id);
      await (grupoModel as any).setPermissoes(permissoesIds);
    }
  }

  async deletar(id: string): Promise<void> {
    await GrupoModel.destroy({
      where: { id },
    });
  }
}
