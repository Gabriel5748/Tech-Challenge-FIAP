import { IProdutoQuimicoRepository } from "../../../src/domain/interfaces/IProdutoQuimicoRepository";

export class ListarProdutosQuimicos {
  constructor(private repository: IProdutoQuimicoRepository) {}
  async execute() {
    return this.repository.listar();
  }
}
