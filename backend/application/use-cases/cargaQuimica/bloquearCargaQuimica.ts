import { ICargaQuimicaRepository } from "../../../src/domain/interfaces/iCargaQuimicaRepository";

export class BloquearCargaQuimica {
  constructor(private repository: ICargaQuimicaRepository) {}
  async execute(id: number) {
    return this.repository.bloquear(id);
  }
}
