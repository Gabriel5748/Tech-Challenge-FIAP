export class AreaArmazenamento {
setor: string;
    capacidade: number;
    classesRiscoAceitas: string[];
    ativa: boolean;
    descricao: string;

    constructor(setor: string, capacidade: number, classesRiscoAceitas: string[], ativa: boolean, descricao: string) {
        this.setor = setor;
        this.capacidade = capacidade;
        this.classesRiscoAceitas = classesRiscoAceitas;
        this.ativa = ativa;
        this.descricao = descricao;
    };
};