export interface ICargaQuimicaRepository {
  registrar(nome: string, formula: string): Promise<void>;
  buscarPorIdentificador(nome: string): Promise<any[]>;
  listar(): Promise<any[]>;
  atualizarStatus(status: string, id: number): Promise<any[]>;
  bloquear(id: number): Promise<any[]>;
  liberar(id: number): Promise<any[]>;
  cancelar(id: number): Promise<any[]>;
}
