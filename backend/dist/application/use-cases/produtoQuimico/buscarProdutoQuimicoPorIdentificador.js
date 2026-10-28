"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuscarProdutoQuimicoPorIdentificador = void 0;
class BuscarProdutoQuimicoPorIdentificador {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute(id) {
        return this.repository.buscarPorIdentificador(id);
    }
}
exports.BuscarProdutoQuimicoPorIdentificador = BuscarProdutoQuimicoPorIdentificador;
