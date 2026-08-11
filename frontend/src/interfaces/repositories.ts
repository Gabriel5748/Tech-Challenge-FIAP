import type { CargaQuimica } from "../entities/cargaQuimica.js";
import type { ProdutoQuimico } from "../entities/produtoQuimico.js";
import type { User } from "../entities/user.js";
import type { Group } from "../entities/group.js";
import type { AreaArmazenamento } from "../entities/areaArmazenamento.js";

export interface CargaQuimicaRepository {
    salvar(carga: CargaQuimica): Promise<void>;
    buscarPorId(cargaId: number): Promise<CargaQuimica | null>;
    deletar(cargaId: number): Promise<void>;
    listarTodos(): Promise<CargaQuimica[]>;
}

export interface ProdutoQuimicoRepository {
    salvar(produto: ProdutoQuimico): Promise<void>;
    buscarPorId(produtoId: number): Promise<ProdutoQuimico | null>;
    listarAtivos(): Promise<ProdutoQuimico[]>;
}

export interface UsuarioRepository {
    salvar(usuario: User): Promise<void>;
    buscarPorId(usuarioId: number): Promise<User | null>;
}

export interface GrupoRepository {
    salvar(grupo: Group): Promise<void>;
    buscarPorId(grupoId: number): Promise<Group | null>;
}

export interface AreaArmazenamentoRepository {
    buscarPorId(areaId: number): Promise<AreaArmazenamento | null>;
    listarAtivas(): Promise<AreaArmazenamento[]>;
}
