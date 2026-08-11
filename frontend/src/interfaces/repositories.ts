import { CargaQuimica } from "../entities/cargaQuimica.js";

export interface CargaQuimicaRepository {
    salvar(carga: CargaQuimica): Promise<void>;
    deletar(cargaId: Number): Promise<void>;
};