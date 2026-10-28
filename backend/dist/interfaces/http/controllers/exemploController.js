"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExemploController = void 0;
class ExemploController {
    cadastrarExemplo;
    buscarExemplo;
    constructor(cadastrarExemplo, buscarExemplo) {
        this.cadastrarExemplo = cadastrarExemplo;
        this.buscarExemplo = buscarExemplo;
    }
    async cadastrar(req, res) {
        const { nome, idade } = req.body;
        if (typeof nome !== "string" || !Number.isInteger(idade)) {
            return res.status(400).json({
                erro: "Conteúdo inválido",
            });
        }
        try {
            await this.cadastrarExemplo.execute(nome, idade);
            return res.status(201).json({
                mensagem: "Cadastro realizado com sucesso",
            });
        }
        catch (erro) {
            console.error(erro);
            return res.status(500).json({
                erro: "Erro ao cadastrar dados",
            });
        }
    }
    async buscar(req, res) {
        const { nome } = req.body;
        if (typeof nome !== "string") {
            return res.status(400).json({
                erro: "Conteúdo inválido",
            });
        }
        try {
            const resultado = await this.buscarExemplo.execute(nome);
            return res.status(200).json(resultado);
        }
        catch (erro) {
            console.error(erro);
            return res.status(500).json({
                erro: "Erro ao consultar dados",
            });
        }
    }
}
exports.ExemploController = ExemploController;
