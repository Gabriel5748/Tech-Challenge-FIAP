import type { Request, Response } from "express";
import { IGrupoRepository } from "../../../../src/domain/interfaces/grupoRepository";
import { Grupos } from "../../../../src/domain/entities/grupos";
import { logger } from "../../../../infrastructure/logger";

export class GrupoController {
  constructor(private readonly grupoRepository: IGrupoRepository) {}

  private getLogger(req: Request) {
    return (req as any).log || logger;
  }

  async listar(req: Request, res: Response) {
    try {
      const grupos = await this.grupoRepository.listarTodos();
      return res.status(200).json(grupos);
    } catch (error: any) {
      this.getLogger(req).error({ error }, "Erro ao listar grupos");
      return res.status(500).json({
        erro: "Erro interno ao listar grupos",
        detalhes: error.message,
      });
    }
  }

  async buscarPorId(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ erro: "ID do grupo não informado." });
    }

    try {
      const grupo = await this.grupoRepository.buscarPorId(String(id));
      if (!grupo) {
        return res.status(404).json({ erro: "Grupo não encontrado." });
      }
      return res.status(200).json(grupo);
    } catch (error: any) {
      this.getLogger(req).error({ error, id }, "Erro ao buscar grupo");
      return res.status(500).json({
        erro: "Erro interno ao buscar grupo",
        detalhes: error.message,
      });
    }
  }

  async cadastrar(req: Request, res: Response) {
    const { nome, descricao } = req.body;

    if (!nome || typeof nome !== "string" || !nome.trim()) {
      return res.status(400).json({ erro: "O nome do grupo é obrigatório." });
    }

    try {
      const novoGrupo = new Grupos(
        "",
        nome.trim(),
        descricao ? String(descricao).trim() : ""
      );

      await this.grupoRepository.salvar(novoGrupo);

      const todos = await this.grupoRepository.listarTodos();
      const grupoCriado = todos.find(g => g.nome === nome.trim()) || novoGrupo;

      return res.status(201).json({
        mensagem: "Grupo cadastrado com sucesso.",
        grupo: grupoCriado,
      });
    } catch (error: any) {
      this.getLogger(req).error({ error, body: req.body }, "Erro ao cadastrar grupo");
      return res.status(400).json({
        erro: error.message || "Erro ao cadastrar grupo",
      });
    }
  }
}

export default GrupoController;
