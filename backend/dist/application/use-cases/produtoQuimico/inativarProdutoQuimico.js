"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InativarProdutoQuimico = void 0;
class InativarProdutoQuimico {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute(id) {
        return this.repository.inativar(id);
    }
}
exports.InativarProdutoQuimico = InativarProdutoQuimico;
