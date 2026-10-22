import { ICargaQuimicaRepository } from "../../../src/domain/interfaces/iCargaQuimicaRepository.ts";

export class ListarCargasQuimicas {
  constructor(private repository: ICargaQuimicaRepository) {}
  async execute() {
    return this.repository.listar();
  }
}
