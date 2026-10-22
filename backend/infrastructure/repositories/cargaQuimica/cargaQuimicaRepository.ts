import { IExemploRepository } from "../../../src/domain/interfaces/IexemploRepository";
import { pool } from "../../database/database";

export class CargaQuimicaRepository implements IExemploRepository {
  async salvar(nome: string, formula: string) {
    await pool.query(
      `INSERT INTO carga_quimica (nome, formula)
       VALUES ($1, $2)`,
      [nome, formula],
    );
  }

  async buscar(nome: string) {
    const resultado = await pool.query(
      `SELECT nome, formula FROM carga_quimica WHERE nome = $1`,
      [nome],
    );
    return resultado.rows;
  }
}
