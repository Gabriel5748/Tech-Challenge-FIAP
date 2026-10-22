import { ICargaQuimicaRepository } from "../../../src/domain/interfaces/iCargaQuimicaRepository.ts";

export class liberarCargaQuimica {
  constructor(private repository: ICargaQuimicaRepository) {}
  async execute(id: number) {
    return this.repository.liberar(id);
  }
}
