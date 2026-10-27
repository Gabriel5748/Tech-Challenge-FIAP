import { ICargaQuimicaRepository } from "../../../src/domain/interfaces/iCargaQuimicaRepository";

export class LiberarCargaQuimica {
  constructor(private repository: ICargaQuimicaRepository) {}

  async execute(id: number) {
    const cargas = await this.repository.buscarPorIdentificador(id);

    if (!cargas || cargas.length === 0) {
      throw new Error("Carga química não encontrada.");
    }

    const carga = cargas[0];

    // Regra 4.20: Carga cancelada não pode ser liberada
    if (carga.status === "cancelado") {
      throw new Error("Carga cancelada não pode ser liberada (Regra 4.20).");
    }

    // Regra 4.4: Uma carga não pode ser liberada enquanto houver documentação obrigatória pendente ou não validada
    if (carga.documentacaoObrigatoria && Array.isArray(carga.documentacaoObrigatoria)) {
      const temDocumentoPendente = carga.documentacaoObrigatoria.some(
        (doc: any) => typeof doc === "object" && doc.status && doc.status !== "validado"
      );

      if (temDocumentoPendente) {
        throw new Error(
          "Uma carga não pode ser liberada enquanto houver documentação obrigatória pendente ou não validada (Regra 4.4)."
        );
      }
    }

    return this.repository.liberar(id);
  }
}
