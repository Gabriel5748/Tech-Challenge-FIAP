export interface IProdutoQuimicoRepository {
  criar(nome: string, formula: string): Promise<void>;
  buscarPorIdentificador(id: number): Promise<any[]>;
  listar(): Promise<any[]>;
  atualizar(formula: string, id: number): Promise<any[]>;
  inativar(id: number): Promise<any[]>;
}
