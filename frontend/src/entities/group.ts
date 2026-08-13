import type { Permissao } from "./permission.js";

export class Group {
    id: number;
    nome: string;
    descricao: string;
    permissoes: Permissao[];

    constructor(id: number, nome: string, descricao: string, permissoes: Permissao[]) {
        if (!nome?.trim()) {
            throw new Error("Nome do grupo é obrigatório.");
        }

        if (!permissoes || permissoes.length === 0) {
            throw new Error("Um grupo deve possuir ao menos uma permissão associada.");
        }

        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.permissoes = permissoes;
    }
}
