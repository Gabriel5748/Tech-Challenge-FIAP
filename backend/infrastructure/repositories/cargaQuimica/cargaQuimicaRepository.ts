import { ICargaQuimicaRepository } from "../../../src/domain/interfaces/iCargaQuimicaRepository";
import { pool } from "../../database/database";

export class CargaQuimicaRepository implements ICargaQuimicaRepository {
  async registrar(nome: string, formula: string) {
    await pool.query(
      `INSERT INTO carga_quimica (nome, formula)
       VALUES ($1, $2)`,
      [nome, formula],
    );
  }

  async buscarPorIdentificador(nome: string) {
    const resultado = await pool.query(
      `SELECT nome, formula FROM carga_quimica WHERE nome = $1`,
      [nome],
    );
    return resultado.rows;
  }

  async listar() {
    const resultado = await pool.query(
      `SELECT nome, formula FROM carga_quimica`,
      [],
    );
    return resultado.rows;
  }

  async atualizarStatus(id: number, status: string) {
    const resultado = await pool.query(
      `UPDATE carga_quimica SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id],
    );
    return resultado.rows;
  }

  async bloquear(id: number) {
    const resultado = await pool.query(
      `update carga_quimica set status = 'bloqueado' WHERE id = $1`,
      [id],
    );
    return resultado.rows;
  }

  async liberar(id: number) {
    const resultado = await pool.query(
      `update carga_quimica set status = 'liberado' WHERE id = $1`,
      [id],
    );
    return resultado.rows;
  }

  async cancelar(id: number) {
    const resultado = await pool.query(
      `update carga_quimica set status = 'cancelado' WHERE id = $1`,
      [id],
    );
    return resultado.rows;
  }
}
