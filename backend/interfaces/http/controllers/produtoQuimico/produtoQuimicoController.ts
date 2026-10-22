import type { Request, Response } from "express";
import { AtualizarProdutoQuimico } from "../../../../application/use-cases/produtoQuimico/atualizarProdutoQuimico";
import { BuscarProdutoQuimicoPorIdentificador } from "../../../../application/use-cases/produtoQuimico/buscarProdutoQuimicoPorIdentificador";
import { CadastrarProdutoQuimico } from "../../../../application/use-cases/produtoQuimico/cadastrarProdutoQuimico";
import { InativarProdutoQuimico } from "../../../../application/use-cases/produtoQuimico/inativarProdutoQuimico";
import { ListarProdutosQuimicos } from "../../../../application/use-cases/produtoQuimico/listarProdutoQuimico";

function parseId(value: unknown): number | null {
  if (typeof value !== "string") {
    return null;
  }

  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export class ProdutoQuimicoController {
  constructor(
    private cadastrarProdutoQuimico: CadastrarProdutoQuimico,
    private buscarProdutoQuimico: BuscarProdutoQuimicoPorIdentificador,
    private listarProdutosQuimicos: ListarProdutosQuimicos,
    private atualizarProdutoQuimico: AtualizarProdutoQuimico,
    private inativarProdutoQuimico: InativarProdutoQuimico,
  ) {}

  async cadastrar(req: Request, res: Response) {
    const { nome, formula } = req.body;

    if (
      typeof nome !== "string" ||
      !nome.trim() ||
      typeof formula !== "string" ||
      !formula.trim()
    ) {
      return res.status(400).json({
        erro: "Nome e fórmula são obrigatórios",
      });
    }

    try {
      await this.cadastrarProdutoQuimico.execute(nome, formula);

      return res.status(201).json({
        mensagem: "Produto químico cadastrado com sucesso",
      });
    } catch (erro) {
      console.error(erro);

      return res.status(500).json({
        erro: "Erro ao cadastrar produto químico",
      });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      const resultado = await this.listarProdutosQuimicos.execute();
      return res.status(200).json(resultado);
    } catch (erro) {
      console.error(erro);

      return res.status(500).json({
        erro: "Erro ao listar produtos químicos",
      });
    }
  }

  async buscar(req: Request, res: Response) {
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
    } catch (erro) {
      console.error(erro);

      return res.status(500).json({
        erro: "Erro ao consultar produto químico",
      });
    }
  }

  async atualizar(req: Request, res: Response) {
    const id = parseId(req.params.id);
    const { formula } = req.body;

    if (id === null || typeof formula !== "string" || !formula.trim()) {
      return res.status(400).json({
        erro: "Identificador e fórmula válida são obrigatórios",
      });
    }

    try {
      const resultado = await this.atualizarProdutoQuimico.execute(
        formula,
        id,
      );

      if (resultado.length === 0) {
        return res.status(404).json({
          erro: "Produto químico não encontrado",
        });
      }

      return res.status(200).json(resultado[0]);
    } catch (erro) {
      console.error(erro);

      return res.status(500).json({
        erro: "Erro ao atualizar produto químico",
      });
    }
  }

  async inativar(req: Request, res: Response) {
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
    } catch (erro) {
      console.error(erro);

      return res.status(500).json({
        erro: "Erro ao inativar produto químico",
      });
    }
  }
}
