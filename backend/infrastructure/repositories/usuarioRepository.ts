import { IUsuarioRepository } from "../../src/domain/interfaces/usuarioRepository";
import { GrupoModel, PermissaoModel, UsuarioModel } from "../../src/core/models";
import { Grupos } from "../../src/domain/entities/grupos";
import { Permissoes } from "../../src/domain/entities/permissoes";
import { Usuario } from "../../src/domain/entities/usuarios";

export class UsuarioRepository implements IUsuarioRepository {
  async buscarPorId(id: string): Promise<Usuario | null> {
    const resultado = await UsuarioModel.findByPk(id, {
      include: [
        {
          model: GrupoModel,
          as: 'grupos',
          include: [{ model: PermissaoModel, as: 'permissoes' }],
        },
      ],
    });

    if (!resultado) return null;

    const gruposDomain = ((resultado as any).grupos || []).map((g: any) => {
      const permissoesDomain = (g.permissoes || []).map(
        (p: any) => new Permissoes(p.id, p.nomePermissao, p.descricao)
      );
      return new Grupos(g.id, g.nome, g.descricao, permissoesDomain);
    });

    return new Usuario(
      resultado.id,
      resultado.nomeCompleto,
      resultado.email,
      resultado.dataDeContratacao,
      resultado.periodoTurno,
      resultado.status,
      gruposDomain
    );
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    const resultado = await UsuarioModel.findOne({
      where: { email },
      include: [
        {
          model: GrupoModel,
          as: 'grupos',
          include: [{ model: PermissaoModel, as: 'permissoes' }],
        },
      ],
    });

    if (!resultado) return null;

    const gruposDomain = ((resultado as any).grupos || []).map((g: any) => {
      const permissoesDomain = (g.permissoes || []).map(
        (p: any) => new Permissoes(p.id, p.nomePermissao, p.descricao)
      );
      return new Grupos(g.id, g.nome, g.descricao, permissoesDomain);
    });

    return new Usuario(
      resultado.id,
      resultado.nomeCompleto,
      resultado.email,
      resultado.dataDeContratacao,
      resultado.periodoTurno,
      resultado.status,
      gruposDomain
    );
  }

  async listarTodos(): Promise<Usuario[]> {
    const resultados = await UsuarioModel.findAll({
      include: [
        {
          model: GrupoModel,
          as: 'grupos',
          include: [{ model: PermissaoModel, as: 'permissoes' }],
        },
      ],
    });

    return resultados.map((resultado: any) => {
      const gruposDomain = (resultado.grupos || []).map((g: any) => {
        const permissoesDomain = (g.permissoes || []).map(
          (p: any) => new Permissoes(p.id, p.nomePermissao, p.descricao)
        );
        return new Grupos(g.id, g.nome, g.descricao, permissoesDomain);
      });

      return new Usuario(
        resultado.id,
        resultado.nomeCompleto,
        resultado.email,
        resultado.dataDeContratacao,
        resultado.periodoTurno,
        resultado.status,
        gruposDomain
      );
    });
  }

  async salvar(usuario: Usuario): Promise<void> {
    const dados: any = {
      nomeCompleto: usuario.nomeCompleto,
      email: usuario.email,
      dataDeContratacao: usuario.dataDeContratacao,
      periodoTurno: usuario.periodoTurno,
      status: usuario.status,
    };

    if (usuario.id) {
      dados.id = usuario.id;
    }

    const usuarioModel = await UsuarioModel.create(dados);

    const grupos = usuario.getGrupos();
    if (grupos.length > 0) {
      await (usuarioModel as any).setGrupos(grupos.map((g) => g.id));
    }
  }

  async atualizar(usuario: Usuario): Promise<void> {
    await UsuarioModel.update(
      {
        nomeCompleto: usuario.nomeCompleto,
        email: usuario.email,
        dataDeContratacao: usuario.dataDeContratacao,
        periodoTurno: usuario.periodoTurno,
        status: usuario.status,
      },
      {
        where: { id: usuario.id },
      }
    );

    const usuarioModel = await UsuarioModel.findByPk(usuario.id);
    if (usuarioModel) {
      const gruposIds = usuario.getGrupos().map((g) => g.id);
      await (usuarioModel as any).setGrupos(gruposIds);
    }
  }

  async deletar(id: string): Promise<void> {
    await UsuarioModel.destroy({
      where: { id },
    });
  }
}
