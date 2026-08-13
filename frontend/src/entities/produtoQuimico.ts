import type { ClasseRisco } from "./enums.js";

export class ProdutoQuimico {
    id: number;
    nome: string;
    classeRisco: ClasseRisco;
    fichaSegurancaUrl?: string;
    ativo: boolean;

    constructor(id: number, nome: string, classeRisco: ClasseRisco, ativo: boolean, fichaSegurancaUrl?: string) {
        if (!nome?.trim()) {
            throw new Error("Produto químico não pode ser cadastrado sem nome.");
        }

        if (!classeRisco) {
            throw new Error("Produto químico não pode ser cadastrado sem classe de risco.");
        }

        this.id = id;
        this.nome = nome;
        this.classeRisco = classeRisco;
        this.ativo = ativo;
        this.fichaSegurancaUrl = fichaSegurancaUrl;
    }

    inativar(): void {
        this.ativo = false;
    }

    ativar(): void {
        this.ativo = true;
    }
}
