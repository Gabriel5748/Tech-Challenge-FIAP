import type { StatusUsuario } from "./enums.js";
import type { Group } from "./group.js";

export class User {
    id: number;
    nomeCompleto: string;
    email: string;
    status: StatusUsuario;
    grupos: Group[];

    constructor(id: number, nomeCompleto: string, email: string, status: StatusUsuario, grupos: Group[]) {
        if (!nomeCompleto?.trim()) {
            throw new Error("Nome completo do usuário é obrigatório.");
        }

        if (!email?.trim()) {
            throw new Error("Email do usuário é obrigatório.");
        }

        if (!grupos || grupos.length === 0) {
            throw new Error("Todo usuário deve pertencer a pelo menos um grupo.");
        }

        this.id = id;
        this.nomeCompleto = nomeCompleto;
        this.email = email;
        this.status = status;
        this.grupos = grupos;
    }
}
