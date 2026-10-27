import { IProdutoQuimicoRepository } from "../../../src/domain/interfaces/IProdutoQuimicoRepository";
import { ProdutoQuimicoModel } from "../../../src/core/models";

export class ProdutoQuimicoRepository implements IProdutoQuimicoRepository {
  async criar(dados: any, formulaParam?: string): Promise<void> {
    if (typeof dados === "string") {
      await ProdutoQuimicoModel.create({
        nome: dados,
        formula: formulaParam || "",
        ativo: true,
      });
    } else {
      await ProdutoQuimicoModel.create({
        nome: dados.nome,
        formula: dados.formula,
        descricao: dados.descricao,
        numeroONU: dados.numeroONU || dados.numero_onu,
        classeRisco: dados.classeRisco || dados.classe_risco,
        grupoCompatibilidade: dados.grupoCompatibilidade || dados.grupo_compatibilidade,
        ativo: dados.ativo !== undefined ? dados.ativo : true,
      });
    }
  }

  async buscarPorIdentificador(id: number): Promise<any[]> {
    const registro = await ProdutoQuimicoModel.findByPk(id);
    return registro ? [registro.toJSON()] : [];
  }

  async listar(): Promise<any[]> {
    const registros = await ProdutoQuimicoModel.findAll();
    return registros.map((r) => r.toJSON());
  }

  async atualizar(dados: any, id: number): Promise<any[]> {
    const updateData = typeof dados === "string" ? { formula: dados } : dados;

    const [afetados] = await ProdutoQuimicoModel.update(updateData, {
      where: { id },
    });

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
