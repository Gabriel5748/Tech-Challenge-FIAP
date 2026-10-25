"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CadastrarExemplo = void 0;
class CadastrarExemplo {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute(nome, idade) {
        const nomeFormatado = nome.trim();
        if (!nomeFormatado) {
            throw new Error("Nome obrigatório");
        }
        return this.repository.salvar(nomeFormatado, idade);
    }
}
exports.CadastrarExemplo = CadastrarExemplo;
