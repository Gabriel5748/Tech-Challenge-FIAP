"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListarCargaQuimica = void 0;
class ListarCargaQuimica {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute() {
        return this.repository.listar();
    }
}
exports.ListarCargaQuimica = ListarCargaQuimica;
