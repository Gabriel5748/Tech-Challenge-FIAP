import { ICargaQuimicaRepository } from "../../../src/domain/interfaces/iCargaQuimicaRepository.ts";

export class bloquearCargaQuimica {
  constructor(private repository: ICargaQuimicaRepository) {}
  async execute(id: number) {
    return this.repository.bloquear(id);
  }
}
