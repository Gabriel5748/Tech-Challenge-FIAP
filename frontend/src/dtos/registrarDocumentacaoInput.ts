import type { User } from "../entities/user.js";

export interface RegistrarDocumentacaoInput {
    responsavel: User,
    dataAnexacao: Date,
    cargaId: number
}