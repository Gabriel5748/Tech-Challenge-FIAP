import { IGrupoRepository } from "../../src/domain/interfaces/grupoRepository";
import { IUsuarioRepository } from "../../src/domain/interfaces/usuarioRepository";

export class AtribuirUsuarioGrupoUseCase {
  constructor(
    private usuarioRepo: IUsuarioRepository,
    private grupoRepo: IGrupoRepository
  ) {}

  async execute(usuarioId: string, grupoId: string): Promise<void> {
    const usuario = await this.usuarioRepo.buscarPorId(usuarioId);
    const grupo = await this.grupoRepo.buscarPorId(grupoId);

    if (!usuario || !grupo) {
      throw new Error('Usuário ou Grupo não encontrado.');
    }

    usuario.adicionarGrupo(grupo);

    if (!usuario.pertenceAoMenosUmGrupo()) {
      throw new Error('O usuário precisa pertencer a pelo menos um grupo.');
    }

    await this.usuarioRepo.atualizar(usuario);
  }
}
