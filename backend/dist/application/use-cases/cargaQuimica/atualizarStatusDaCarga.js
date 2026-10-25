"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtualizarStatusDaCarga = void 0;
class AtualizarStatusDaCarga {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute(id, status) {
        return this.repository.atualizarStatus(id, status);
    }
}
exports.AtualizarStatusDaCarga = AtualizarStatusDaCarga;
