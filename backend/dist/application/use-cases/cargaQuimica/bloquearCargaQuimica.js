"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BloquearCargaQuimica = void 0;
class BloquearCargaQuimica {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute(id) {
        return this.repository.bloquear(id);
    }
}
exports.BloquearCargaQuimica = BloquearCargaQuimica;
