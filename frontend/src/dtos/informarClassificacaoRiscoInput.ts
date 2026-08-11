import type { ClasseRisco } from "../entities/enums.js";

export interface InformarClassificacaoRiscoInput {
    cargaId: number;
    classeRisco: ClasseRisco;
}
