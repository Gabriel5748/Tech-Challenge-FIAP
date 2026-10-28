import { ICargaQuimicaRepository } from "../../../src/domain/interfaces/iCargaQuimicaRepository";
import { IProdutoQuimicoRepository } from "../../../src/domain/interfaces/IProdutoQuimicoRepository";
import { normalizarStatusCarga } from "../../../src/domain/entities/statusCarga";

export interface RegistrarCargaInput {
  codigo?: string;
  nome?: string;
  formula?: string;
  produtoQuimicoId?: number;
  produto_quimico_id?: number;
  quantidade?: number;
  unidadeMedida?: string;
  unidade_medida?: string;
  origem?: string;
  destino?: string;
  responsavelTecnico?: string;
  responsavel_tecnico?: string;
  documentacaoObrigatoria?: any;
  documentacao_obrigatoria?: any;
  status?: string;
  dataEntrada?: string | Date;
  data_entrada?: string | Date;
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

    const produtoId = Number(input.produtoQuimicoId ?? input.produto_quimico_id);
    if (!produtoId || isNaN(produtoId) || produtoId <= 0) {
      throw new Error(
        "Uma carga química não pode ser registrada sem produto químico associado.",
      );
    }

    let produtoAssociado: any = null;
    if (this.produtoQuimicoRepository) {
      const produtos =
        await this.produtoQuimicoRepository.buscarPorIdentificador(produtoId);

      if (!produtos || produtos.length === 0) {
        throw new Error(
          "Produto químico associado não encontrado no sistema.",
        );
      }

      produtoAssociado = produtos[0];
      if (produtoAssociado.ativo === false) {
        throw new Error(
          "Uma carga química não pode ser registrada com produto químico inativo.",
        );
      }
    }

    const quantidadeNum = Number(input.quantidade);
    if (input.quantidade === undefined || input.quantidade === null || isNaN(quantidadeNum) || quantidadeNum <= 0) {
      throw new Error("A quantidade da carga deve ser maior que zero.");
    }

    const responsavel = (input.responsavelTecnico ?? input.responsavel_tecnico)?.trim();
    if (!responsavel) {
      throw new Error("Toda carga deve possuir responsável técnico informado.");
    }

    const codigoFormatado = input.codigo?.trim() || `CRG-${Date.now()}`;
    const nomeCarga = input.nome?.trim() || produtoAssociado?.nome || codigoFormatado;
    const formulaCarga = input.formula?.trim() || produtoAssociado?.formula || "";
    const unidadeMedida = (input.unidadeMedida ?? input.unidade_medida)?.trim();
    const documentacao = input.documentacaoObrigatoria ?? input.documentacao_obrigatoria;
    const dataEntrada = input.dataEntrada ?? input.data_entrada ?? new Date();

    const statusInicial = input.status ? normalizarStatusCarga(input.status) : "Registrada";
    if (!statusInicial) {
      throw new Error("Status inicial da carga inválido.");
    }

    return this.repository.registrar({
      codigo: codigoFormatado,
      nome: nomeCarga,
      formula: formulaCarga,
      produtoQuimicoId: produtoId,
      quantidade: quantidadeNum,
      unidadeMedida,
      origem: input.origem?.trim(),
      destino: input.destino?.trim(),
      responsavelTecnico: responsavel,
      documentacaoObrigatoria: documentacao,
      status: statusInicial,
      dataEntrada,
    });
  }
}
