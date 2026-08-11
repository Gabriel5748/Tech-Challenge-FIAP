import type { ClasseRisco, StatusCarga, StatusDocumento, ResultadoInspecao } from "./enums.js";
import { DocumentoCarga } from "./documentacao.js";
import { Inspecao } from "./inspecao.js";

export class CargaQuimica {
    id: number;
    produtoQuimicoId: number;
    quantidade: number;
    unidadeMedida: string;
    classeRisco: ClasseRisco;
    responsavelTecnicoId: number;
    status: StatusCarga;
    areaArmazenamentoId: number;
    dataRegistro: Date;
    documentos: DocumentoCarga[];
    inspecoes: Inspecao[];
    historicoStatus: Array<{ status: StatusCarga; data: Date; motivo?: string }>;

    constructor(
        id: number,
        produtoQuimicoId: number,
        quantidade: number,
        unidadeMedida: string,
        classeRisco: ClasseRisco,
        responsavelTecnicoId: number,
        status: StatusCarga,
        areaArmazenamentoId: number,
        dataRegistro: Date,
        documentos: DocumentoCarga[] = [],
        inspecoes: Inspecao[] = [],
    ) {
        if (!produtoQuimicoId || produtoQuimicoId <= 0) {
            throw new Error("Carga deve possuir um produto químico associado.");
        }

        if (quantidade <= 0) {
            throw new Error("Quantidade da carga deve ser maior que zero.");
        }

        if (!unidadeMedida?.trim()) {
            throw new Error("Unidade de medida é obrigatória.");
        }

        if (!classeRisco) {
            throw new Error("Classificação de risco da carga é obrigatória.");
        }

        if (!responsavelTecnicoId || responsavelTecnicoId <= 0) {
            throw new Error("Carga deve possuir responsável técnico informado.");
        }

        if (!areaArmazenamentoId || areaArmazenamentoId <= 0) {
            throw new Error("Carga deve possuir área de armazenamento definida.");
        }

        this.id = id;
        this.produtoQuimicoId = produtoQuimicoId;
        this.quantidade = quantidade;
        this.unidadeMedida = unidadeMedida;
        this.classeRisco = classeRisco;
        this.responsavelTecnicoId = responsavelTecnicoId;
        this.status = status;
        this.areaArmazenamentoId = areaArmazenamentoId;
        this.dataRegistro = dataRegistro;
        this.documentos = documentos;
        this.inspecoes = inspecoes;
        this.historicoStatus = [{ status, data: dataRegistro }];
    }

    adicionarDocumento(documento: DocumentoCarga): void {
        if (this.status === StatusCarga.Cancelada) {
            throw new Error("Não é possível adicionar documento a carga cancelada.");
        }

        this.documentos.push(documento);
    }

    registrarInspecao(inspecao: Inspecao): void {
        if (this.status === StatusCarga.Cancelada) {
            throw new Error("Não é possível adicionar inspeção a carga cancelada.");
        }

        this.inspecoes.push(inspecao);
    }

    todasDocumentacoesValidadas(): boolean {
        return this.documentos.length > 0 && this.documentos.every((documento) => documento.status === StatusDocumento.Validado);
    }

    get ultimaInspecao(): Inspecao | undefined {
        return this.inspecoes.slice().sort((a, b) => b.data.getTime() - a.data.getTime())[0];
    }

    atualizarStatus(novoStatus: StatusCarga, motivo?: string): void {
        if (this.status === StatusCarga.Cancelada && novoStatus !== StatusCarga.Cancelada) {
            throw new Error("Carga cancelada não pode ser alterada para outro status.");
        }

        if (novoStatus === StatusCarga.Liberada) {
            if (!this.todasDocumentacoesValidadas()) {
                throw new Error("Uma carga não pode ser liberada enquanto houver documentação obrigatória pendente ou não validada.");
            }

            const ultimo = this.ultimaInspecao;
            if (!ultimo || ultimo.resultado !== ResultadoInspecao.Aprovado) {
                throw new Error("Uma carga só pode ser liberada após a inspeção ter sido aprovada.");
            }
        }

        this.status = novoStatus;
        this.historicoStatus.push({ status: novoStatus, data: new Date(), motivo });
    }

    bloquear(motivo: string): void {
        if (!motivo?.trim()) {
            throw new Error("Motivo para bloqueio deve ser informado.");
        }

        this.atualizarStatus(StatusCarga.Bloqueada, motivo);
    }

    liberar(): void {
        this.atualizarStatus(StatusCarga.Liberada);
    }

    cancelar(): void {
        this.atualizarStatus(StatusCarga.Cancelada);
    }

    validarCompatibilidadeArea(classesRiscoAceitas: string[]): void {
        if (!classesRiscoAceitas.includes(this.classeRisco)) {
            throw new Error("A classe de risco da carga não é compatível com a área de armazenamento designada.");
        }
    }
}
