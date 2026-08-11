export class Permissao {
    id: number;
    nome: string;
    descricao: string;

    constructor(id: number, nome: string, descricao: string) {
        if (!nome?.trim()) {
            throw new Error("Uma permissão não pode ser cadastrada sem nome.");
        }

        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
    }
}
