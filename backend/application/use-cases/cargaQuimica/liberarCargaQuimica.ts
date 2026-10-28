import { ICargaQuimicaRepository } from "../../../src/domain/interfaces/iCargaQuimicaRepository";
import {
  possuiDocumentacaoObrigatoriaValida,
  validarTransicaoDeStatus,
} from "../../../src/domain/entities/statusCarga";

export class LiberarCargaQuimica {
  constructor(private repository: ICargaQuimicaRepository) {}

  async execute(id: number) {
    const cargas = await this.repository.buscarPorIdentificador(id);

    if (!cargas || cargas.length === 0) {
      throw new Error("Carga química não encontrada.");
    }

    const carga = cargas[0];
    validarTransicaoDeStatus(carga.status, "Liberada");

    if (!possuiDocumentacaoObrigatoriaValida(carga.documentacaoObrigatoria)) {
      throw new Error("Uma carga não pode ser liberada sem documentação obrigatória.");
    }

    return this.repository.liberar(id);
  }
}
