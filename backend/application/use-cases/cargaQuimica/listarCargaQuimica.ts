import { ICargaQuimicaRepository } from "../../../src/domain/interfaces/iCargaQuimicaRepository";

export class ListarCargaQuimica {
  constructor(private repository: ICargaQuimicaRepository) {}
  async execute() {
    return this.repository.listar();
  }
}
