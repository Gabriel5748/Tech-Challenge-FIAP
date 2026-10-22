import { IProdutoQuimicoRepository } from "../../../src/domain/interfaces/IProdutoQuimicoRepository";

export class AtualizarProdutoQuimico {
  constructor(private repository: IProdutoQuimicoRepository) {}

  async execute(formula: string, id: number) {
    const formulaFormatada = formula.trim();

    if (!formulaFormatada) {
      throw new Error("Fórmula obrigatória");
    }

    return this.repository.atualizar(formulaFormatada, id);
  }
}