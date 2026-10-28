import { ICargaQuimicaRepository } from "../../../src/domain/interfaces/iCargaQuimicaRepository";
import {
  possuiDocumentacaoObrigatoriaValida,
  validarTransicaoDeStatus,
} from "../../../src/domain/entities/statusCarga";

export class AtualizarStatusDaCarga {
  constructor(private repository: ICargaQuimicaRepository) {}

  async execute(id: number, status: string) {
    const cargas = await this.repository.buscarPorIdentificador(id);

    if (!cargas || cargas.length === 0) {
      throw new Error("Carga química não encontrada.");
    }

    const carga = cargas[0];
    const novoStatus = validarTransicaoDeStatus(carga.status, status);

    if (
      novoStatus === "Liberada" &&
      !possuiDocumentacaoObrigatoriaValida(carga.documentacaoObrigatoria)
    ) {
      throw new Error("Uma carga não pode ser liberada sem documentação obrigatória.");
    }

    return this.repository.atualizarStatus(id, novoStatus);
  }
}
