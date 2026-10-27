import { ICargaQuimicaRepository } from "../../../src/domain/interfaces/iCargaQuimicaRepository";

export class AtualizarStatusDaCarga {
  constructor(private repository: ICargaQuimicaRepository) {}

  async execute(id: number, status: string) {
    const cargas = await this.repository.buscarPorIdentificador(id);

    if (!cargas || cargas.length === 0) {
      throw new Error("Carga química não encontrada.");
    }

    const carga = cargas[0];

    // Regra 4.20: Carga cancelada não pode ser liberada
    if (carga.status === "cancelado" && status === "liberado") {
      throw new Error("Carga cancelada não pode ser liberada (Regra 4.20).");
    }

    // Regra: Não permitir reabrir carga cancelada para outros status arbitrários
    if (carga.status === "cancelado" && status !== "cancelado") {
      throw new Error("Carga cancelada não pode ter seu status alterado.");
    }

    return this.repository.atualizarStatus(id, status);
  }
}
