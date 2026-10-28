export interface ICargaQuimicaRepository {
  registrar(dados: any, formula?: string): Promise<any>;
  buscarPorIdentificador(identificador: string | number): Promise<any[]>;
  listar(): Promise<any[]>;
  atualizarStatus(id: number, status: string): Promise<any[]>;
  bloquear(id: number): Promise<any[]>;
  liberar(id: number): Promise<any[]>;
  cancelar(id: number): Promise<any[]>;
}
