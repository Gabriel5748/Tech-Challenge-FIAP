import type { ClasseRisco } from "./enums.js";

export class AreaArmazenamento {
    id: number;
    setor: string;
    capacidade: number;
    classesRiscoAceitas: ClasseRisco[];
    ativa: boolean;
    descricao: string;

    constructor(
        id: number,
        setor: string,
        capacidade: number,
        classesRiscoAceitas: ClasseRisco[],
        ativa: boolean,
        descricao: string,
    ) {
        if (!setor?.trim()) {
            throw new Error("Setor da área de armazenamento é obrigatório.");
        }

        if (capacidade <= 0) {
            throw new Error("Capacidade da área de armazenamento deve ser maior que zero.");
        }

        if (!classesRiscoAceitas || classesRiscoAceitas.length === 0) {
            throw new Error("A área de armazenamento deve aceitar ao menos uma classe de risco.");
        }

        this.id = id;
        this.setor = setor;
        this.capacidade = capacidade;
        this.classesRiscoAceitas = classesRiscoAceitas;
        this.ativa = ativa;
        this.descricao = descricao;
    }

    aceitaClasseRisco(classe: ClasseRisco): boolean {
        return this.classesRiscoAceitas.includes(classe);
    }
}
