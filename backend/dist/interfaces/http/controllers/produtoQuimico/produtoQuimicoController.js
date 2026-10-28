"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdutoQuimicoController = void 0;
function parseId(value) {
    if (typeof value !== "string") {
        return null;
    }
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
}
class ProdutoQuimicoController {
    cadastrarProdutoQuimico;
    buscarProdutoQuimico;
    listarProdutosQuimicos;
    atualizarProdutoQuimico;
    inativarProdutoQuimico;
    constructor(cadastrarProdutoQuimico, buscarProdutoQuimico, listarProdutosQuimicos, atualizarProdutoQuimico, inativarProdutoQuimico) {
        this.cadastrarProdutoQuimico = cadastrarProdutoQuimico;
        this.buscarProdutoQuimico = buscarProdutoQuimico;
        this.listarProdutosQuimicos = listarProdutosQuimicos;
        this.atualizarProdutoQuimico = atualizarProdutoQuimico;
        this.inativarProdutoQuimico = inativarProdutoQuimico;
    }
    async cadastrar(req, res) {
        const { nome, formula } = req.body;
        if (typeof nome !== "string" ||
            !nome.trim() ||
            typeof formula !== "string" ||
            !formula.trim()) {
            return res.status(400).json({
                erro: "Nome e fórmula são obrigatórios",
            });
        }
        try {
            await this.cadastrarProdutoQuimico.execute(nome, formula);
            return res.status(201).json({
                mensagem: "Produto químico cadastrado com sucesso",
            });
        }
        catch (erro) {
            console.error(erro);
            return res.status(500).json({
                erro: "Erro ao cadastrar produto químico",
            });
        }
    }
    async listar(req, res) {
        try {
            const resultado = await this.listarProdutosQuimicos.execute();
            return res.status(200).json(resultado);
        }
        catch (erro) {
            console.error(erro);
            return res.status(500).json({
                erro: "Erro ao listar produtos químicos",
            });
        }
    }
    async buscar(req, res) {
        const id = parseId(req.params.id);
        if (id === null) {
            return res.status(400).json({
                erro: "Identificador inválido",
            });
        }
        try {
            const resultado = await this.buscarProdutoQuimico.execute(id);
            if (resultado.length === 0) {
                return res.status(404).json({
                    erro: "Produto químico não encontrado",
                });
            }
            return res.status(200).json(resultado[0]);
        }
        catch (erro) {
            console.error(erro);
            return res.status(500).json({
                erro: "Erro ao consultar produto químico",
            });
        }
    }
    async atualizar(req, res) {
        const id = parseId(req.params.id);
        const { formula } = req.body;
        if (id === null || typeof formula !== "string" || !formula.trim()) {
            return res.status(400).json({
                erro: "Identificador e fórmula válida são obrigatórios",
            });
        }
        try {
            const resultado = await this.atualizarProdutoQuimico.execute(formula, id);
            if (resultado.length === 0) {
                return res.status(404).json({
                    erro: "Produto químico não encontrado",
                });
            }
            return res.status(200).json(resultado[0]);
        }
        catch (erro) {
            console.error(erro);
            return res.status(500).json({
                erro: "Erro ao atualizar produto químico",
            });
        }
    }
    async inativar(req, res) {
        const id = parseId(req.params.id);
        if (id === null) {
            return res.status(400).json({
                erro: "Identificador inválido",
            });
        }
        try {
            const resultado = await this.inativarProdutoQuimico.execute(id);
            if (resultado.length === 0) {
                return res.status(404).json({
                    erro: "Produto químico não encontrado",
                });
            }
            return res.status(200).json(resultado[0]);
        }
        catch (erro) {
            console.error(erro);
            return res.status(500).json({
                erro: "Erro ao inativar produto químico",
            });
        }
    }
}
exports.ProdutoQuimicoController = ProdutoQuimicoController;
