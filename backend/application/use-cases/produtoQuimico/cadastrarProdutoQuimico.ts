import { IProdutoQuimicoRepository } from "../../../src/domain/interfaces/IProdutoQuimicoRepository";

export class CadastrarProdutoQuimico {
  constructor(private repository: IProdutoQuimicoRepository) {}
  async execute(nome: string, formula: string) {
    const nomeFormatado = nome.trim();

    if (!nomeFormatado) {
      throw new Error("Nome obrigatório");
    }

    return this.repository.criar(nomeFormatado, formula);
  }
}
