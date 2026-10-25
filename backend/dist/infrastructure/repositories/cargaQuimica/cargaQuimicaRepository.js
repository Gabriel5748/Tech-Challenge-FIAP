"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CargaQuimicaRepository = void 0;
const database_1 = require("../../database/database");
class CargaQuimicaRepository {
    async registrar(nome, formula) {
        await database_1.pool.query(`INSERT INTO carga_quimica (nome, formula)
       VALUES ($1, $2)`, [nome, formula]);
    }
    async buscarPorIdentificador(nome) {
        const resultado = await database_1.pool.query(`SELECT nome, formula FROM carga_quimica WHERE nome = $1`, [nome]);
        return resultado.rows;
    }
    async listar() {
        const resultado = await database_1.pool.query(`SELECT nome, formula FROM carga_quimica`, []);
        return resultado.rows;
    }
    async atualizarStatus(id, status) {
        const resultado = await database_1.pool.query(`UPDATE carga_quimica SET status = $1 WHERE id = $2 RETURNING *`, [status, id]);
        return resultado.rows;
    }
    async bloquear(id) {
        const resultado = await database_1.pool.query(`update carga_quimica set status = 'bloqueado' WHERE id = $1`, [id]);
        return resultado.rows;
    }
    async liberar(id) {
        const resultado = await database_1.pool.query(`update carga_quimica set status = 'liberado' WHERE id = $1`, [id]);
        return resultado.rows;
    }
    async cancelar(id) {
        const resultado = await database_1.pool.query(`update carga_quimica set status = 'cancelado' WHERE id = $1`, [id]);
        return resultado.rows;
    }
}
exports.CargaQuimicaRepository = CargaQuimicaRepository;
