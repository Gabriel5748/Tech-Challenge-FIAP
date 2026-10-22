import { IProdutoQuimicoRepository } from "../../../src/domain/interfaces/IProdutoQuimicoRepository";

export class InativarProdutoQuimico {
  constructor(private repository: IProdutoQuimicoRepository) {}
  async execute(id: number) {
    return this.repository.inativar(id);
  }
}
