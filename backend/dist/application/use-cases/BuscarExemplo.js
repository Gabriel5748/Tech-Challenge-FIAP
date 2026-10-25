"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuscarExemplo = void 0;
class BuscarExemplo {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute(nome) {
        const nomeFormatado = nome.trim();
        if (!nomeFormatado) {
            throw new Error("Nome obrigatório");
        }
        return this.repository.buscar(nomeFormatado);
    }
}
exports.BuscarExemplo = BuscarExemplo;
