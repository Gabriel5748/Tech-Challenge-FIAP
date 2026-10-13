import { IExemploRepository } from "../../src/domain/interfaces/IExemploRepository.ts";
import { pool } from "../database/database.ts";

export class ExemploRepository implements IExemploRepository {
  async salvar(nome: string, idade: number) {
    await pool.query(
      `INSERT INTO exemplo (nome, idade)
       VALUES ($1, $2)`,
      [nome, idade],
    );
  }

  async buscar(nome: string) {
    const resultado = await pool.query(
      `SELECT nome, idade FROM exemplo WHERE nome = $1`,
      [nome],
    );
    return resultado.rows;
  }
}
