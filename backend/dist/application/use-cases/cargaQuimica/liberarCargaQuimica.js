"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiberarCargaQuimica = void 0;
class LiberarCargaQuimica {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute(id) {
        return this.repository.liberar(id);
    }
}
exports.LiberarCargaQuimica = LiberarCargaQuimica;
