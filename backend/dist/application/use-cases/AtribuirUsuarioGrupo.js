"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtribuirUsuarioGrupoUseCase = void 0;
class AtribuirUsuarioGrupoUseCase {
    usuarioRepo;
    grupoRepo;
    constructor(usuarioRepo, grupoRepo) {
        this.usuarioRepo = usuarioRepo;
        this.grupoRepo = grupoRepo;
    }
    async execute(usuarioId, grupoId) {
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
exports.AtribuirUsuarioGrupoUseCase = AtribuirUsuarioGrupoUseCase;
