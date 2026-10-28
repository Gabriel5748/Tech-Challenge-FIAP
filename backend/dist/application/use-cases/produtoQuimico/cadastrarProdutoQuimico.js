"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CadastrarProdutoQuimico = void 0;
class CadastrarProdutoQuimico {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute(nome, formula) {
        const nomeFormatado = nome.trim();
        if (!nomeFormatado) {
            throw new Error("Nome obrigatório");
        }
        return this.repository.criar(nomeFormatado, formula);
    }
}
exports.CadastrarProdutoQuimico = CadastrarProdutoQuimico;
