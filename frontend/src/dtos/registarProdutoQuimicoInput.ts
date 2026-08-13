import type { ClasseRisco } from "../entities/enums.js";

export interface RegistarProdutoQuimicoInput {
    nome: string;
    classeRisco: ClasseRisco;
    fichaSegurancaUrl?: string;
    ativo?: boolean;
}
