import { ICargaQuimicaRepository } from "../../../src/domain/interfaces/iCargaQuimicaRepository";

export class CancelarCargaQuimica {
  constructor(private repository: ICargaQuimicaRepository) {}

  async execute(id: number) {
    const cargas = await this.repository.buscarPorIdentificador(id);

    if (!cargas || cargas.length === 0) {
      throw new Error("Carga química não encontrada.");
    }

    const carga = cargas[0];

    // Regra: Não cancelar carga que já foi cancelada
    if (carga.status === "cancelado") {
      throw new Error("Carga química já se encontra cancelada.");
    }

    return this.repository.cancelar(id);
  }
}
