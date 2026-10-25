"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Carga = void 0;
class Carga {
    identificador;
    codigoCarga;
    produtoQuimicoId;
    quantidade;
    unidadeMedida;
    origem;
    destino;
    responsavelTecnico;
    documentacaoObrigatoria;
    status;
    dataEntrada;
    dataCriacao;
    dataAtualizacao;
    constructor(identificador, codigoCarga, produtoQuimicoId, quantidade, unidadeMedida, origem, destino, responsavelTecnico, documentacaoObrigatoria, status, dataEntrada, dataCriacao, dataAtualizacao) {
        this.identificador = identificador;
        this.codigoCarga = codigoCarga;
        this.produtoQuimicoId = produtoQuimicoId;
        this.quantidade = quantidade;
        this.unidadeMedida = unidadeMedida;
        this.origem = origem;
        this.destino = destino;
        this.responsavelTecnico = responsavelTecnico;
        this.documentacaoObrigatoria = documentacaoObrigatoria;
        this.status = status;
        this.dataEntrada = dataEntrada;
        this.dataCriacao = dataCriacao;
        this.dataAtualizacao = dataAtualizacao;
    }
}
exports.Carga = Carga;
