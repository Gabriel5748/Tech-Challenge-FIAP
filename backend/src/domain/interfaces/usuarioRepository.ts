import { Usuario } from "../entities/usuarios";

export interface IUsuarioRepository {
  salvar(usuario: Usuario): Promise<void>;
  buscarPorId(id: string): Promise<Usuario | null>;
  buscarPorEmail(email: string): Promise<Usuario | null>;
  listarTodos(): Promise<Usuario[]>;
  atualizar(usuario: Usuario): Promise<void>;
  adicionarGrupo(usuarioId: string, grupoId: string): Promise<void>;
  deletar(id: string): Promise<void>;
}
