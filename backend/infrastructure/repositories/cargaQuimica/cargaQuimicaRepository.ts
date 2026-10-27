import { ICargaQuimicaRepository } from "../../../src/domain/interfaces/iCargaQuimicaRepository";
import { CargaQuimicaModel, ProdutoQuimicoModel } from "../../../src/core/models";

export class CargaQuimicaRepository implements ICargaQuimicaRepository {
  async registrar(dados: any, formulaParam?: string): Promise<any> {
    let created;
    if (typeof dados === "string") {
      created = await CargaQuimicaModel.create({
        nome: dados,
        formula: formulaParam || "",
        status: "pendente",
      });
    } else {
      created = await CargaQuimicaModel.create({
        nome: dados.nome,
        formula: dados.formula,
        produtoQuimicoId: dados.produtoQuimicoId,
        quantidade: dados.quantidade,
        unidadeMedida: dados.unidadeMedida,
        origem: dados.origem,
        destino: dados.destino,
        responsavelTecnico: dados.responsavelTecnico,
        documentacaoObrigatoria: dados.documentacaoObrigatoria,
        status: dados.status || "pendente",
      });
    }
    return created.toJSON();
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
      include: [
        {
          model: ProdutoQuimicoModel,
          as: "produtoQuimico",
        },
      ],
    });

    return registros.map((r) => r.toJSON());
  }

  async listar(): Promise<any[]> {
    const registros = await CargaQuimicaModel.findAll({
      include: [
        {
          model: ProdutoQuimicoModel,
          as: "produtoQuimico",
        },
      ],
    });
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

    const atualizado = await CargaQuimicaModel.findByPk(id, {
      include: [
        {
          model: ProdutoQuimicoModel,
          as: "produtoQuimico",
        },
      ],
    });
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
