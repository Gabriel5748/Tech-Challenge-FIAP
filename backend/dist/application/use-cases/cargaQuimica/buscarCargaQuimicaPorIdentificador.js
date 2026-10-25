"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuscarCargaQuimicaPorIdentificador = void 0;
class BuscarCargaQuimicaPorIdentificador {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute(nome) {
        return this.repository.buscarPorIdentificador(nome);
    }
}
exports.BuscarCargaQuimicaPorIdentificador = BuscarCargaQuimicaPorIdentificador;
