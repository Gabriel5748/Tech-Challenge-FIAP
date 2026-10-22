import { ICargaQuimicaRepository } from "../../../src/domain/interfaces/iCargaQuimicaRepository";

export class RegistrarCargaQuimica {
  constructor(private repository: ICargaQuimicaRepository) {}

  async execute(nome: string, formula: string) {
    return this.repository.registrar(nome, formula);
  }
}