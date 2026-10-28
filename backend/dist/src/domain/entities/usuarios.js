"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
class Usuario {
    id;
    nomeCompleto;
    email;
    dataDeContratacao;
    periodoTurno;
    status;
    grupos;
    constructor(id, nomeCompleto, email, dataDeContratacao, periodoTurno, status, grupos = []) {
        this.id = id;
        this.nomeCompleto = nomeCompleto;
        this.email = email;
        this.dataDeContratacao = dataDeContratacao;
        this.periodoTurno = periodoTurno;
        this.status = status;
        this.grupos = grupos;
    }
    adicionarGrupo(grupo) {
        this.grupos.push(grupo);
    }
    getGrupos() {
        return this.grupos;
    }
    pertenceAoMenosUmGrupo() {
        return this.grupos.length > 0;
    }
}
exports.Usuario = Usuario;
