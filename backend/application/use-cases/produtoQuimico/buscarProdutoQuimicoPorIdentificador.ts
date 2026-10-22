import { IProdutoQuimicoRepository } from "../../../src/domain/interfaces/IProdutoQuimicoRepository";

export class BuscarProdutoQuimicoPorIdentificador {
  constructor(private repository: IProdutoQuimicoRepository) {}
  async execute(id: number) {
    return this.repository.buscarPorIdentificador(id);
  }
}
