import { ICargaQuimicaRepository } from "../../../src/domain/interfaces/iCargaQuimicaRepository";

export class LiberarCargaQuimica {
  constructor(private repository: ICargaQuimicaRepository) {}
  async execute(id: number) {
    return this.repository.liberar(id);
  }
}
