import { ICargaQuimicaRepository } from "../../../src/domain/interfaces/iCargaQuimicaRepository";

export class BuscarCargaQuimicaPorIdentificador {
  constructor(private repository: ICargaQuimicaRepository) {}

  async execute(nome: string) {
    return this.repository.buscarPorIdentificador(nome);
  }
}