import type { ClasseRisco } from "../entities/enums.js";

export interface RegistrarCargaQuimicaInput {
    produtoQuimicoId: number;
    quantidade: number;
    unidadeMedida: string;
    classeRisco: ClasseRisco;
    responsavelTecnicoId: number;
    areaArmazenamentoId: number;
    dataRegistro: Date;
}
