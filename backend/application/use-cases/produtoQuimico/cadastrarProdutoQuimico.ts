import { IProdutoQuimicoRepository } from "../../../src/domain/interfaces/IProdutoQuimicoRepository";

export class CadastrarProdutoQuimico {
  constructor(private repository: IProdutoQuimicoRepository) {}

  async execute(nome: string, formula: string) {
    const nomeFormatado = nome?.trim();
    const formulaFormatada = formula?.trim();

    // Regra 4.14: Produto químico não pode ser cadastrado sem nome
    if (!nomeFormatado) {
      throw new Error("Produto químico não pode ser cadastrado sem nome (Regra 4.14).");
    }

    if (!formulaFormatada) {
      throw new Error("Fórmula do produto químico é obrigatória.");
    }

    return this.repository.criar(nomeFormatado, formulaFormatada);
  }
}
