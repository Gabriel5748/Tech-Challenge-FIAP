import type { Request, Response } from "express";
import { AtualizarStatusDaCarga } from "../../../../application/use-cases/cargaQuimica/atualizarStatusDaCarga";
import { BloquearCargaQuimica } from "../../../../application/use-cases/cargaQuimica/bloquearCargaQuimica";
import { BuscarCargaQuimicaPorIdentificador } from "../../../../application/use-cases/cargaQuimica/buscarCargaQuimicaPorIdentificador";
import { CancelarCargaQuimica } from "../../../../application/use-cases/cargaQuimica/cancelarCargaQuimica";
import { LiberarCargaQuimica } from "../../../../application/use-cases/cargaQuimica/liberarCargaQuimica";
import { ListarCargaQuimica } from "../../../../application/use-cases/cargaQuimica/listarCargaQuimica";
import { RegistrarCargaQuimica } from "../../../../application/use-cases/cargaQuimica/registrarCargaQuimica";
import { logger } from "../../../../infrastructure/logger";

export class CargaQuimicaController {
  constructor(
    private registrarCargaQuimica: RegistrarCargaQuimica,
    private buscarCargaQuimica: BuscarCargaQuimicaPorIdentificador,
    private atualizarStatusCargaQuimica: AtualizarStatusDaCarga,
    private buscarCargaQuimicaPorIdentificador: BuscarCargaQuimicaPorIdentificador,
    private bloquearCargaQuimica: BloquearCargaQuimica,
    private liberarCargaQuimica: LiberarCargaQuimica,
    private cancelarCargaQuimica: CancelarCargaQuimica,
    private listarCargaQuimicaUseCase?: ListarCargaQuimica,
  ) {}

  private getLogger(req: Request) {
    return (req as any).log || logger;
  }

  async cadastrar(req: Request, res: Response) {
    const {
      nome,
      formula,
      produtoQuimicoId,
      quantidade,
      unidadeMedida,
      origem,
      destino,
      responsavelTecnico,
      documentacaoObrigatoria,
    } = req.body;

    if (typeof nome !== "string" || !nome.trim() || typeof formula !== "string" || !formula.trim()) {
      return res.status(400).json({
        erro: "Nome e fórmula da carga química são obrigatórios.",
      });
    }

    try {
      const cargaCriada = await this.registrarCargaQuimica.execute({
        nome: nome.trim(),
        formula: formula.trim(),
        produtoQuimicoId: produtoQuimicoId ? Number(produtoQuimicoId) : undefined,
        quantidade: quantidade !== undefined ? Number(quantidade) : undefined,
        unidadeMedida,
        origem,
        destino,
        responsavelTecnico,
        documentacaoObrigatoria,
      });

      return res.status(201).json({
        mensagem: "Cadastro realizado com sucesso",
        carga: cargaCriada,
      });
    } catch (erro: any) {
      this.getLogger(req).error({ erro, body: req.body }, "Erro ao cadastrar carga química");

      return res.status(400).json({
        erro: erro.message || "Erro ao cadastrar dados",
      });
    }
  }

  async listar(req: Request, res: Response) {
    const nome = req.query.nome;
    if (typeof nome === "string" && nome.trim()) {
      return this.buscar(req, res);
    }

    try {
      if (this.listarCargaQuimicaUseCase) {
        const resultado = await this.listarCargaQuimicaUseCase.execute();
        return res.status(200).json(resultado);
      }
      return res.status(200).json([]);
    } catch (erro: any) {
      this.getLogger(req).error({ erro }, "Erro ao listar cargas químicas");

      return res.status(500).json({
        erro: "Erro ao listar cargas químicas",
      });
    }
  }

  async buscar(req: Request, res: Response) {
    const nome = req.query.nome ?? req.params.nome;

    if (typeof nome !== "string" || !nome.trim()) {
      return this.listar(req, res);
    }

    try {
      const resultado = await this.buscarCargaQuimica.execute(nome);

      if (resultado.length === 0) {
        return res.status(404).json({
          erro: "Carga química não encontrada",
        });
      }

      return res.status(200).json(resultado);
    } catch (erro: any) {
      this.getLogger(req).error({ erro, nome }, "Erro ao consultar carga química por nome");

      return res.status(400).json({
        erro: erro.message || "Erro ao consultar dados",
      });
    }
  }

  async buscarPorIdentificador(req: Request, res: Response) {
    const rawId = req.params.id ?? req.query.id;
    const id = Number(rawId);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        erro: "Identificador inválido: deve ser um número inteiro positivo",
      });
    }

    try {
      const resultado =
        await this.buscarCargaQuimicaPorIdentificador.execute(id);

      if (resultado.length === 0) {
        return res.status(404).json({
          erro: "Carga química não encontrada",
        });
      }

      return res.status(200).json(resultado[0]);
    } catch (erro: any) {
      this.getLogger(req).error({ erro, id }, "Erro ao consultar carga química por identificador");

      return res.status(400).json({
        erro: erro.message || "Erro ao consultar dados",
      });
    }
  }

  async atualizarStatus(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { status } = req.body;
    const statusPermitidos = ["bloqueado", "liberado", "cancelado", "pendente"];

    if (
      !Number.isInteger(id) ||
      id <= 0 ||
      typeof status !== "string" ||
      !statusPermitidos.includes(status)
    ) {
      return res.status(400).json({
        erro: "Identificador ou status inválido",
      });
    }

    try {
      const resultado = await this.atualizarStatusCargaQuimica.execute(
        id,
        status,
      );

      if (resultado.length === 0) {
        return res.status(404).json({
          erro: "Carga química não encontrada",
        });
      }

      return res.status(200).json(resultado[0]);
    } catch (erro: any) {
      this.getLogger(req).error({ erro, id, status }, "Erro ao atualizar status da carga");

      return res.status(400).json({
        erro: erro.message || "Erro ao atualizar status da carga",
      });
    }
  }

  async bloquear(req: Request, res: Response) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        erro: "Identificador inválido",
      });
    }

    try {
      const resultado = await this.bloquearCargaQuimica.execute(id);

      if (resultado.length === 0) {
        return res.status(404).json({
          erro: "Carga química não encontrada",
        });
      }

      return res.status(200).json(resultado[0]);
    } catch (erro: any) {
      this.getLogger(req).error({ erro, id }, "Erro ao bloquear status da carga");

      return res.status(400).json({
        erro: erro.message || "Erro ao atualizar status da carga",
      });
    }
  }

  async liberar(req: Request, res: Response) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        erro: "Identificador inválido",
      });
    }

    try {
      const resultado = await this.liberarCargaQuimica.execute(id);

      if (resultado.length === 0) {
        return res.status(404).json({
          erro: "Carga química não encontrada",
        });
      }

      return res.status(200).json(resultado[0]);
    } catch (erro: any) {
      this.getLogger(req).error({ erro, id }, "Erro ao liberar status da carga");

      return res.status(400).json({
        erro: erro.message || "Erro ao atualizar status da carga",
      });
    }
  }

  async cancelar(req: Request, res: Response) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        erro: "Identificador inválido",
      });
    }

    try {
      const resultado = await this.cancelarCargaQuimica.execute(id);

      if (resultado.length === 0) {
        return res.status(404).json({
          erro: "Carga química não encontrada",
        });
      }

      return res.status(200).json(resultado[0]);
    } catch (erro: any) {
      this.getLogger(req).error({ erro, id }, "Erro ao cancelar status da carga");

      return res.status(400).json({
        erro: erro.message || "Erro ao atualizar status da carga",
      });
    }
  }
}
