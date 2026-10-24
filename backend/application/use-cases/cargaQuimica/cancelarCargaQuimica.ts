import { ICargaQuimicaRepository } from "../../../src/domain/interfaces/iCargaQuimicaRepository";

export class CancelarCargaQuimica {
  constructor(private repository: ICargaQuimicaRepository) {}
  async execute(id: number) {
    return this.repository.cancelar(id);
  }
}
