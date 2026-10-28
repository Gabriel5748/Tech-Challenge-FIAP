import { IProdutoQuimicoRepository } from "../../../src/domain/interfaces/IProdutoQuimicoRepository";

export interface AtualizarProdutoInput {
  nome?: string;
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

export class AtualizarProdutoQuimico {
  constructor(private repository: IProdutoQuimicoRepository) {}

  async execute(dadosOuFormula: string | AtualizarProdutoInput, id: number) {
    const input: AtualizarProdutoInput =
      typeof dadosOuFormula === "string"
        ? { formula: dadosOuFormula }
        : dadosOuFormula;

    const updatePayload: any = {};

    if (input.nome !== undefined) {
      const nomeFormatado = String(input.nome).trim();
      if (!nomeFormatado) {
        throw new Error("O nome do produto químico não pode ser vazio.");
      }
      updatePayload.nome = nomeFormatado;
    }

    if (input.formula !== undefined) {
      updatePayload.formula = String(input.formula).trim();
    }

    if (input.descricao !== undefined) {
      updatePayload.descricao = String(input.descricao).trim();
    }

    if (input.numeroONU !== undefined || input.numero_onu !== undefined) {
      updatePayload.numeroONU = String(input.numeroONU ?? input.numero_onu).trim();
    }

    if (input.classeRisco !== undefined || input.classe_risco !== undefined) {
      const classeFormatada = String(input.classeRisco ?? input.classe_risco).trim();
      if (!classeFormatada) {
        throw new Error("A classe de risco do produto químico não pode ser vazia.");
      }
      updatePayload.classeRisco = classeFormatada;
    }

    if (input.grupoCompatibilidade !== undefined || input.grupo_compatibilidade !== undefined) {
      updatePayload.grupoCompatibilidade = String(
        input.grupoCompatibilidade ?? input.grupo_compatibilidade
      ).trim();
    }

    if (input.status !== undefined) {
      const statusLower = String(input.status).trim().toLowerCase();
      if (statusLower !== "ativo" && statusLower !== "inativo") {
        throw new Error("Status inválido. Valores permitidos: ativo ou inativo.");
      }
      updatePayload.ativo = statusLower === "ativo";
    } else if (input.ativo !== undefined) {
      if (typeof input.ativo !== "boolean") {
        throw new Error("Status inválido.");
      }
      updatePayload.ativo = input.ativo;
    }

    if (Object.keys(updatePayload).length === 0) {
      throw new Error("Nenhum dado válido informado para atualização.");
    }

    return this.repository.atualizar(updatePayload, id);
  }
}
