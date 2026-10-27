import { ICargaQuimicaRepository } from "../../../src/domain/interfaces/iCargaQuimicaRepository";
import { IProdutoQuimicoRepository } from "../../../src/domain/interfaces/IProdutoQuimicoRepository";

export interface RegistrarCargaInput {
  nome: string;
  formula: string;
  produtoQuimicoId?: number;
  quantidade?: number;
  unidadeMedida?: string;
  origem?: string;
  destino?: string;
  responsavelTecnico?: string;
  classeRisco?: string;
}

export class RegistrarCargaQuimica {
  constructor(
    private repository: ICargaQuimicaRepository,
    private produtoQuimicoRepository?: IProdutoQuimicoRepository,
  ) {}

  async execute(
    nomeOuInput: string | RegistrarCargaInput,
    formulaParam?: string,
  ) {
    const input: RegistrarCargaInput =
      typeof nomeOuInput === "string"
        ? { nome: nomeOuInput, formula: formulaParam || "" }
        : nomeOuInput;

    if (!input.nome || !input.nome.trim()) {
      throw new Error("Nome da carga química é obrigatório.");
    }

    if (!input.formula || !input.formula.trim()) {
      throw new Error("Fórmula da carga química é obrigatória.");
    }

    // Regra 4.8: Quantidade da carga deve ser registrada com valor maior que zero
    if (input.quantidade !== undefined && input.quantidade <= 0) {
      throw new Error(
        "Quantidade da carga deve ser registrada com valor maior que zero (Regra 4.8).",
      );
    }

    // Regra 4.5 e 4.6 / 4.16: Validar se produto associado existe e está ativo
    if (input.produtoQuimicoId && this.produtoQuimicoRepository) {
      const produtos =
        await this.produtoQuimicoRepository.buscarPorIdentificador(
          input.produtoQuimicoId,
        );

      if (!produtos || produtos.length === 0) {
        throw new Error(
          "Produto químico associado não encontrado no sistema (Regra 4.5).",
        );
      }

      const produto = produtos[0];
      if (produto.ativo === false) {
        throw new Error(
          "Carga não pode ser registrada com produto químico inativo (Regras 4.6 e 4.16).",
        );
      }
    }

    return this.repository.registrar(input as any);
  }
}
