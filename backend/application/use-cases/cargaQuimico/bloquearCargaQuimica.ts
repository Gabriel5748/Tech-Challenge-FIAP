import { ICargaQuimicaRepository } from "../../../src/domain/interfaces/iCargaQuimicaRepository";
import { validarTransicaoDeStatus } from "../../../src/domain/entities/statusCarga";

export class BloquearCargaQuimica {
  constructor(private repository: ICargaQuimicaRepository) {}

  async execute(id: number) {
    const cargas = await this.repository.buscarPorIdentificador(id);

    if (!cargas || cargas.length === 0) {
      throw new Error("Carga química não encontrada.");
    }

    const carga = cargas[0];
    validarTransicaoDeStatus(carga.status, "Bloqueada");

    return this.repository.bloquear(id);
  }
}
