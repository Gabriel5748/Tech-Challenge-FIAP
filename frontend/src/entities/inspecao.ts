import type { ResultadoInspecao } from "./enums.js";

export class Inspecao {
    id: number;
    data: Date;
    responsavelTecnicoId: number;
    resultado: ResultadoInspecao;
    observacoes?: string;

    constructor(
        id: number,
        data: Date,
        responsavelTecnicoId: number,
        resultado: ResultadoInspecao,
        observacoes?: string,
    ) {
        if (!data) {
            throw new Error("Data da inspeção é obrigatória.");
        }

        if (!responsavelTecnicoId || responsavelTecnicoId <= 0) {
            throw new Error("Responsável técnico da inspeção deve ser informado.");
        }

        this.id = id;
        this.data = data;
        this.responsavelTecnicoId = responsavelTecnicoId;
        this.resultado = resultado;
        this.observacoes = observacoes;
    }
}
