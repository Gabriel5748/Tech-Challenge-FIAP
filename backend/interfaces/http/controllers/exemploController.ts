import type { Request, Response } from "express";
import { BuscarExemplo } from "../../../application/use-cases/BuscarExemplo";
import { CadastrarExemplo } from "../../../application/use-cases/CadastrarExemplo";

export class ExemploController {
  constructor(
    private cadastrarExemplo: CadastrarExemplo,
    private buscarExemplo: BuscarExemplo,
  ) {}
  async cadastrar(req: Request, res: Response) {
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
    } catch (erro) {
      console.error(erro);

      return res.status(500).json({
        erro: "Erro ao cadastrar dados",
      });
    }
  }

  async buscar(req: Request, res: Response) {
    const { nome } = req.body;

    if (typeof nome !== "string") {
      return res.status(400).json({
        erro: "Conteúdo inválido",
      });
    }

    try {
      const resultado = await this.buscarExemplo.execute(nome);
      return res.status(200).json(resultado);
    } catch (erro) {
      console.error(erro);

      return res.status(500).json({
        erro: "Erro ao consultar dados",
      });
    }
  }
}
