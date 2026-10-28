"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdutoQuimico = void 0;
class ProdutoQuimico {
    identificador;
    nome;
    descricao;
    numeroONU;
    classeRisco;
    grupoCompatibilidade;
    status;
    dataCriacao;
    dataAtualizacao;
    constructor(identificador, nome, descricao, numeroONU, classeRisco, grupoCompatibilidade, status, dataCriacao, dataAtualizacao) {
        this.identificador = identificador;
        this.nome = nome;
        this.descricao = descricao;
        this.numeroONU = numeroONU;
        this.classeRisco = classeRisco;
        this.grupoCompatibilidade = grupoCompatibilidade;
        this.status = status;
        this.dataCriacao = dataCriacao;
        this.dataAtualizacao = dataAtualizacao;
    }
}
exports.ProdutoQuimico = ProdutoQuimico;
