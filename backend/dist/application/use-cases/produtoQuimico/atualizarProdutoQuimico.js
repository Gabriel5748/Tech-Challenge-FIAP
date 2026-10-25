"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtualizarProdutoQuimico = void 0;
class AtualizarProdutoQuimico {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute(formula, id) {
        const formulaFormatada = formula.trim();
        if (!formulaFormatada) {
            throw new Error("Fórmula obrigatória");
        }
        return this.repository.atualizar(formulaFormatada, id);
    }
}
exports.AtualizarProdutoQuimico = AtualizarProdutoQuimico;
