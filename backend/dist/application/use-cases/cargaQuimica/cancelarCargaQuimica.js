"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelarCargaQuimica = void 0;
class CancelarCargaQuimica {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute(id) {
        return this.repository.cancelar(id);
    }
}
exports.CancelarCargaQuimica = CancelarCargaQuimica;
