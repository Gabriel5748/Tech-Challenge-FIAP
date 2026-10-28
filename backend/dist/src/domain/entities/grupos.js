"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grupos = void 0;
class Grupos {
    id;
    nome;
    descricao;
    permissoes;
    constructor(id, nome, descricao, permissoes = []) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.permissoes = permissoes;
        if (!nome || nome.trim() === '') {
            throw new Error('O grupo precisa ter um nome.');
        }
    }
    adicionarPermissao(permissao) {
        this.permissoes.push(permissao);
    }
    getPermissoes() {
        return this.permissoes;
    }
    possuiPermissoes() {
        return this.permissoes.length > 0;
    }
}
exports.Grupos = Grupos;
