export interface IExemploRepository {
  salvar(nome: string, idade: number): Promise<void>;
  buscar(nome: string): Promise<any[]>;
}
