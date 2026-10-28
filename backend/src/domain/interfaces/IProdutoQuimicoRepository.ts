export interface IProdutoQuimicoRepository {
  criar(dados: any, formula?: string): Promise<any>;
  buscarPorIdentificador(id: number): Promise<any[]>;
  listar(): Promise<any[]>;
  atualizar(dados: any, id: number): Promise<any[]>;
  inativar(id: number): Promise<any[]>;
}
