"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrarCargaQuimica = void 0;
class RegistrarCargaQuimica {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute(nome, formula) {
        return this.repository.registrar(nome, formula);
    }
}
exports.RegistrarCargaQuimica = RegistrarCargaQuimica;
