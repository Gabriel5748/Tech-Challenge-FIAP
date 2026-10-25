"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListarProdutosQuimicos = void 0;
class ListarProdutosQuimicos {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute() {
        return this.repository.listar();
    }
}
exports.ListarProdutosQuimicos = ListarProdutosQuimicos;
