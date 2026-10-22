import { Grupos } from "../../../src/domain/entities/grupos";

export interface IGrupoRepository {
  salvar(grupo: Grupos): Promise<void>;
  buscarPorId(id: string): Promise<Grupos | null>;
  listarPorIds(ids: string[]): Promise<Grupos[]>;
  listarTodos(): Promise<Grupos[]>;
  atualizar(grupo: Grupos): Promise<void>;
  deletar(id: string): Promise<void>;
}