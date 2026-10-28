"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdutoQuimicoRepository = void 0;
const database_1 = require("../../database/database");
class ProdutoQuimicoRepository {
    async criar(nome, formula) {
        await database_1.pool.query(`INSERT INTO produto_quimico (nome, formula)
       VALUES ($1, $2)`, [nome, formula]);
    }
    async buscarPorIdentificador(id) {
        const resultado = await database_1.pool.query(`SELECT * FROM produto_quimico WHERE id = $1`, [id]);
        return resultado.rows;
    }
    async listar() {
        const resultado = await database_1.pool.query(`SELECT * FROM produto_quimico`, []);
        return resultado.rows;
    }
    async atualizar(formula, id) {
        const resultado = await database_1.pool.query(`UPDATE produto_quimico SET formula = $1 WHERE id = $2 RETURNING *`, [formula, id]);
        return resultado.rows;
    }
    async inativar(id) {
        const resultado = await database_1.pool.query(`UPDATE produto_quimico SET ativo = false WHERE id = $1 RETURNING *`, [id]);
        return resultado.rows;
    }
}
exports.ProdutoQuimicoRepository = ProdutoQuimicoRepository;
