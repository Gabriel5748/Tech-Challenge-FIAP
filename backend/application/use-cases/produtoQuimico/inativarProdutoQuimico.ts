import { IProdutoQuimicoRepository } from "../../../src/domain/interfaces/IProdutoQuimicoRepository";

export class InativarProdutoQuimico {
  constructor(private repository: IProdutoQuimicoRepository) {}

  async execute(id: number) {
    const produtos = await this.repository.buscarPorIdentificador(id);

    if (!produtos || produtos.length === 0) {
      throw new Error("Produto químico não encontrado.");
    }

    // Regra 4.6 e 4.16: Inativa o produto químico no sistema
    return this.repository.inativar(id);
  }
}
