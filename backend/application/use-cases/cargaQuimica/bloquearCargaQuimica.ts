import { ICargaQuimicaRepository } from "../../../src/domain/interfaces/iCargaQuimicaRepository";

export class BloquearCargaQuimica {
  constructor(private repository: ICargaQuimicaRepository) {}

  async execute(id: number) {
    const cargas = await this.repository.buscarPorIdentificador(id);

    if (!cargas || cargas.length === 0) {
      throw new Error("Carga química não encontrada.");
    }

    const carga = cargas[0];

    // Regra: Carga cancelada não pode ser bloqueada
    if (carga.status === "cancelado") {
      throw new Error("Carga cancelada não pode sofrer alteração para bloqueada.");
    }

    return this.repository.bloquear(id);
  }
}
