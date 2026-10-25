"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permissoes = void 0;
class Permissoes {
    id;
    nomePermissao;
    descricao;
    constructor(id, nomePermissao, descricao) {
        this.id = id;
        this.nomePermissao = nomePermissao;
        this.descricao = descricao;
        if (!nomePermissao || nomePermissao.trim() === '') {
            throw new Error('Uma permissão não pode ser cadastrada sem nome.'); // Regra 4.17
        }
    }
}
exports.Permissoes = Permissoes;
