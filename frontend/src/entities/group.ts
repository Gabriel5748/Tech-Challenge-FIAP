import type { Permissao } from "./permission.js";

export class Group {
    name: string;
    descricao: string;
    permissoes: Permissao[];

    constructor(name: string,descricao: string, permissoes: Permissao[]) {
        this.name = name;
        this.descricao = descricao;
        this.permissoes = permissoes;
    };
};