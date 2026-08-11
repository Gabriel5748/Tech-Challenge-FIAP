import type { ClasseRisco } from "../entities/enums.js";

export interface CadastrarProdutoQuimicoInput {
    nome: string;
    classeRisco: ClasseRisco;
    fichaSegurancaUrl?: string;
    ativo?: boolean;
}
