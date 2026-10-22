export interface IProdutoQuimicoRepository {
  salvar(nome: string, formula: string): Promise<void>;
  buscar(nome: string): Promise<any[]>;
}
