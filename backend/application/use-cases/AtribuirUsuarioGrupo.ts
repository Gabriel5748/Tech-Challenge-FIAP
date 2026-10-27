import { IGrupoRepository } from "../../src/domain/interfaces/grupoRepository";
import { IUsuarioRepository } from "../../src/domain/interfaces/usuarioRepository";

export class AtribuirUsuarioGrupoUseCase {
  constructor(
    private usuarioRepo: IUsuarioRepository,
    private grupoRepo: IGrupoRepository
  ) {}

  async execute(usuarioId: string, grupoId: string): Promise<void> {
    const usuario = await this.usuarioRepo.buscarPorId(usuarioId);
    if (!usuario) {
      throw new Error('Usuário não encontrado.');
    }

    const grupo = await this.grupoRepo.buscarPorId(grupoId);
    if (!grupo) {
      throw new Error('Grupo não encontrado.');
    }

    const jaVinculado = usuario.getGrupos().some(g => g.id === grupoId);
    
    if (jaVinculado) {
      throw new Error('Usuário já pertence a este grupo.');
    }
    
    await this.usuarioRepo.adicionarGrupo(usuarioId, grupoId);
  }
}
