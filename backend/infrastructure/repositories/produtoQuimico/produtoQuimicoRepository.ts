import { IProdutoQuimicoRepository } from "../../../src/domain/interfaces/IProdutoQuimicoRepository";
import { ProdutoQuimicoModel } from "../../../src/core/models";

export class ProdutoQuimicoRepository implements IProdutoQuimicoRepository {
  async criar(nome: string, formula: string): Promise<void> {
    await ProdutoQuimicoModel.create({
      nome,
      formula,
      ativo: true,
    });
  }

  async buscarPorIdentificador(id: number): Promise<any[]> {
    const registro = await ProdutoQuimicoModel.findByPk(id);
    return registro ? [registro.toJSON()] : [];
  }

  async listar(): Promise<any[]> {
    const registros = await ProdutoQuimicoModel.findAll();
    return registros.map((r) => r.toJSON());
  }

  async atualizar(formula: string, id: number): Promise<any[]> {
    const [afetados] = await ProdutoQuimicoModel.update(
      { formula },
      { where: { id } }
    );

    if (afetados === 0) {
      return [];
    }

    const atualizado = await ProdutoQuimicoModel.findByPk(id);
    return atualizado ? [atualizado.toJSON()] : [];
  }

  async inativar(id: number): Promise<any[]> {
    const [afetados] = await ProdutoQuimicoModel.update(
      { ativo: false },
      { where: { id } }
    );

    if (afetados === 0) {
      return [];
    }

    const inativado = await ProdutoQuimicoModel.findByPk(id);
    return inativado ? [inativado.toJSON()] : [];
  }
}
