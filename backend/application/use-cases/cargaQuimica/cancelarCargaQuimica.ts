import { ICargaQuimicaRepository } from "../../../src/domain/interfaces/iCargaQuimicaRepository.ts";

export class cancelarCargaQuimica {
  constructor(private repository: ICargaQuimicaRepository) {}
  async execute(id: number) {
    return this.repository.cancelar(id);
  }
}
