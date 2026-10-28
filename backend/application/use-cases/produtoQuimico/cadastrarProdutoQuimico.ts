import { IProdutoQuimicoRepository } from "../../../src/domain/interfaces/IProdutoQuimicoRepository";

export interface CadastrarProdutoInput {
  nome: string;
  formula?: string;
  descricao?: string;
  numeroONU?: string;
  numero_onu?: string;
  classeRisco?: string;
  classe_risco?: string;
  grupoCompatibilidade?: string;
  grupo_compatibilidade?: string;
  status?: string;
  ativo?: boolean;
}

export class CadastrarProdutoQuimico {
  constructor(private repository: IProdutoQuimicoRepository) {}

  async execute(nomeOuInput: string | CadastrarProdutoInput, formulaParam?: string) {
    const input: CadastrarProdutoInput =
      typeof nomeOuInput === "string"
        ? { nome: nomeOuInput, formula: formulaParam }
        : nomeOuInput;

    const nomeFormatado = input.nome?.trim();
    if (!nomeFormatado) {
      throw new Error("Um produto químico não pode ser cadastrado sem nome.");
    }

    const classeRiscoFormatada = (input.classeRisco ?? input.classe_risco)?.trim();
    if (!classeRiscoFormatada) {
      throw new Error("Um produto químico não pode ser cadastrado sem classe de risco.");
    }

    let ativo = true;
    if (input.status !== undefined) {
      const statusLower = String(input.status).trim().toLowerCase();
      if (statusLower !== "ativo" && statusLower !== "inativo") {
        throw new Error("Um produto químico não pode ser cadastrado com status inválido.");
      }
      ativo = statusLower === "ativo";
    } else if (input.ativo !== undefined) {
      if (typeof input.ativo !== "boolean") {
        throw new Error("Um produto químico não pode ser cadastrado com status inválido.");
      }
      ativo = input.ativo;
    }

    return this.repository.criar({
      nome: nomeFormatado,
      formula: input.formula?.trim() || undefined,
      descricao: input.descricao?.trim() || undefined,
      numeroONU: (input.numeroONU ?? input.numero_onu)?.trim() || undefined,
      classeRisco: classeRiscoFormatada,
      grupoCompatibilidade: (input.grupoCompatibilidade ?? input.grupo_compatibilidade)?.trim() || undefined,
      ativo,
    });
  }
}
