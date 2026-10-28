import { ICargaQuimicaRepository } from "../../../src/domain/interfaces/iCargaQuimicaRepository";

export class BuscarCargaQuimicaPorIdentificador {
  constructor(private repository: ICargaQuimicaRepository) {}

  async execute(identificador: string | number) {
    return this.repository.buscarPorIdentificador(identificador);
  }
}
