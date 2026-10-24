import { ICargaQuimicaRepository } from "../../../src/domain/interfaces/iCargaQuimicaRepository";

export class AtualizarStatusDaCarga {
  constructor(private repository: ICargaQuimicaRepository) {}
  async execute(id: number, status: string) {
    return this.repository.atualizarStatus(id, status);
  }
}
