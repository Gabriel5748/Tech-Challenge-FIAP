import { ICargaQuimicaRepository } from "../../../src/domain/interfaces/iCargaQuimicaRepository";
import { CargaQuimicaModel } from "../../../src/core/models";

export class CargaQuimicaRepository implements ICargaQuimicaRepository {
  async registrar(nome: string, formula: string): Promise<void> {
    await CargaQuimicaModel.create({
      nome,
      formula,
      status: "pendente",
    });
  }

  async buscarPorIdentificador(identificador: string | number): Promise<any[]> {
    const isId =
      typeof identificador === "number" ||
      (!isNaN(Number(identificador)) &&
        String(Number(identificador)) === String(identificador).trim());

    const where = isId
      ? { id: Number(identificador) }
      : { nome: String(identificador) };

    const registros = await CargaQuimicaModel.findAll({
      where,
    });

    return registros.map((r) => r.toJSON());
  }

  async listar(): Promise<any[]> {
    const registros = await CargaQuimicaModel.findAll();
    return registros.map((r) => r.toJSON());
  }

  async atualizarStatus(id: number, status: string): Promise<any[]> {
    const [afetados] = await CargaQuimicaModel.update(
      { status },
      { where: { id } }
    );

    if (afetados === 0) {
      return [];
    }

    const atualizado = await CargaQuimicaModel.findByPk(id);
    return atualizado ? [atualizado.toJSON()] : [];
  }

  async bloquear(id: number): Promise<any[]> {
    return this.atualizarStatus(id, "bloqueado");
  }

  async liberar(id: number): Promise<any[]> {
    return this.atualizarStatus(id, "liberado");
  }

  async cancelar(id: number): Promise<any[]> {
    return this.atualizarStatus(id, "cancelado");
  }
}
