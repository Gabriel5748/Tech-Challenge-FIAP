import { IProdutoQuimicoRepository } from "../../../src/domain/interfaces/IProdutoQuimicoRepository";
import { pool } from "../../database/database";

export class ProdutoQuimicoRepository implements IProdutoQuimicoRepository {
  async criar(nome: string, formula: string) {
    await pool.query(
      `INSERT INTO produto_quimico (nome, formula)
       VALUES ($1, $2)`,
      [nome, formula],
    );
  }

  async buscarPorIdentificador(id: number) {
    const resultado = await pool.query(
      `SELECT nome, formula FROM produto_quimico WHERE id = $1`,
      [id],
    );
    return resultado.rows;
  }

  async listar() {
    const resultado = await pool.query(`SELECT * FROM produto_quimico`, []);
    return resultado.rows;
  }

  async atualizar(formula: string, id: number) {
    const resultado = await pool.query(
      `UPDATE produto_quimico SET formula = $1 WHERE id = $2 RETURNING *`,
      [formula, id],
    );
    return resultado.rows;
  }

  async inativar(id: number) {
    const resultado = await pool.query(
      `UPDATE produto_quimico SET ativo = false WHERE id = $1 RETURNING *`,
      [id],
    );
    return resultado.rows;
  }
}
