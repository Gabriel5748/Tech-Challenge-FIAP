export class CargaQuimica {
    produtoQuimicoId: number;
    quantidade: number;
    classeRisco: string;
    responsavelTecnicoId: number;
    status: string;
    areaArmazenamentoId: number;
    dataRegistro: Date;

    constructor(produtoQuimicoId: number, quantidade: number, classeRisco: string, responsavelTecnicoId: number, status: string, areaArmazenamentoId: number, dataRegistro: Date) {
        this.produtoQuimicoId = produtoQuimicoId;
        this.quantidade = quantidade;
        this.classeRisco = classeRisco;
        this.responsavelTecnicoId = responsavelTecnicoId;
        this.status = status;
        this.areaArmazenamentoId = areaArmazenamentoId;
        this.dataRegistro = dataRegistro;
    };
};