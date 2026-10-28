import { ICargaQuimicaRepository } from "../../../src/domain/interfaces/iCargaQuimicaRepository";
import { validarTransicaoDeStatus } from "../../../src/domain/entities/statusCarga";

export class CancelarCargaQuimica {
  constructor(private repository: ICargaQuimicaRepository) {}

  async execute(id: number) {
    const cargas = await this.repository.buscarPorIdentificador(id);

    if (!cargas || cargas.length === 0) {
      throw new Error("Carga química não encontrada.");
    }

    const carga = cargas[0];
    validarTransicaoDeStatus(carga.status, "Cancelada");

    return this.repository.cancelar(id);
  }
}
