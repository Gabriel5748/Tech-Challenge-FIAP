import { IProdutoQuimicoRepository } from "../../../src/domain/interfaces/IProdutoQuimicoRepository";
import { ProdutoQuimicoModel } from "../../../src/core/models";

export class ProdutoQuimicoRepository implements IProdutoQuimicoRepository {
  async criar(dados: any, formulaParam?: string): Promise<any> {
    let created;
    if (typeof dados === "string") {
      created = await ProdutoQuimicoModel.create({
        nome: dados,
        formula: formulaParam || "",
        ativo: true,
      });
    } else {
      created = await ProdutoQuimicoModel.create({
        nome: dados.nome,
        formula: dados.formula,
        descricao: dados.descricao,
        numeroONU: dados.numeroONU ?? dados.numero_onu,
        classeRisco: dados.classeRisco ?? dados.classe_risco,
        grupoCompatibilidade: dados.grupoCompatibilidade ?? dados.grupo_compatibilidade,
        ativo: dados.ativo !== undefined ? dados.ativo : true,
      });
    }
    return created.toJSON();
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
    let updateData: any = {};

    if (typeof dados === "string") {
      updateData = { formula: dados };
    } else {
      if (dados.nome !== undefined) updateData.nome = dados.nome;
      if (dados.formula !== undefined) updateData.formula = dados.formula;
      if (dados.descricao !== undefined) updateData.descricao = dados.descricao;
      if (dados.numeroONU !== undefined || dados.numero_onu !== undefined) {
        updateData.numeroONU = dados.numeroONU ?? dados.numero_onu;
      }
      if (dados.classeRisco !== undefined || dados.classe_risco !== undefined) {
        updateData.classeRisco = dados.classeRisco ?? dados.classe_risco;
      }
      if (dados.grupoCompatibilidade !== undefined || dados.grupo_compatibilidade !== undefined) {
        updateData.grupoCompatibilidade = dados.grupoCompatibilidade ?? dados.grupo_compatibilidade;
      }
      if (dados.ativo !== undefined) updateData.ativo = dados.ativo;
    }

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
