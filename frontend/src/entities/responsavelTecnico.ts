import { User } from "./user.js";
import type { StatusUsuario } from "./enums.js";

export class ResponsavelTecnico extends User {
    registroProfissional: string;
    especialidade: string;

    constructor(
        id: number,
        nomeCompleto: string,
        email: string,
        registroProfissional: string,
        especialidade: string,
        status: StatusUsuario,
    ) {
        super(id, nomeCompleto, email, status, []);
        if (!registroProfissional?.trim()) {
            throw new Error("O responsável técnico precisa ter registro profissional definido.");
        }

        this.registroProfissional = registroProfissional;
        this.especialidade = especialidade;
    }
}
