import type { Request, Response } from "express";
import { AtualizarStatusDaCarga } from "../../../../application/use-cases/cargaQuimica/atualizarStatusDaCarga";
import { BloquearCargaQuimica } from "../../../../application/use-cases/cargaQuimica/bloquearCargaQuimica";
import { BuscarCargaQuimicaPorIdentificador } from "../../../../application/use-cases/cargaQuimica/buscarCargaQuimicaPorIdentificador";
import { CancelarCargaQuimica } from "../../../../application/use-cases/cargaQuimica/cancelarCargaQuimica";
import { LiberarCargaQuimica } from "../../../../application/use-cases/cargaQuimica/liberarCargaQuimica";
import { RegistrarCargaQuimica } from "../../../../application/use-cases/cargaQuimica/registrarCargaQuimica";

export class CargaQuimicaController {
  constructor(
    private registrarCargaQuimica: RegistrarCargaQuimica,
    private buscarCargaQuimica: BuscarCargaQuimicaPorIdentificador,
    private atualizarStatusCargaQuimica: AtualizarStatusDaCarga,
    private buscarCargaQuimicaPorIdentificador: BuscarCargaQuimicaPorIdentificador,
    private bloquearCargaQuimica: BloquearCargaQuimica,
    private liberarCargaQuimica: LiberarCargaQuimica,
    private cancelarCargaQuimica: CancelarCargaQuimica,
  ) {}
  async cadastrar(req: Request, res: Response) {
    const { nome, formula } = req.body;

    if (typeof nome !== "string" || typeof formula !== "string") {
      return res.status(400).json({
        erro: "Conteúdo inválido",
      });
    }

    try {
      await this.registrarCargaQuimica.execute(nome, formula);

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
    const nome = req.query.nome ?? req.params.nome;

    if (typeof nome !== "string") {
      return res.status(400).json({
        erro: "Conteúdo inválido",
      });
    }

    try {
      const resultado = await this.buscarCargaQuimica.execute(nome);

      if (resultado.length === 0) {
        return res.status(404).json({
          erro: "Carga química não encontrada",
        });
      }

      return res.status(200).json(resultado);
    } catch (erro) {
      console.error(erro);

      return res.status(500).json({
        erro: "Erro ao consultar dados",
      });
    }
  }

  async atualizarStatus(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { status } = req.body;
    const statusPermitidos = ["bloqueado", "liberado", "cancelado"];

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

      return res.status(200).json(resultado);
    } catch (erro) {
      console.error(erro);

      return res.status(500).json({
        erro: "Erro ao atualizar status da carga",
      });
    }
  }

  async buscarPorIdentificador(req: Request, res: Response) {
    const id = req.query.id;

    if (typeof id !== "number" || id <= 0) {
      return res.status(400).json({
        erro: "Conteúdo inválido",
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

      return res.status(200).json(resultado);
    } catch (erro) {
      console.error(erro);

      return res.status(500).json({
        erro: "Erro ao consultar dados",
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

      return res.status(200).json(resultado);
    } catch (erro) {
      console.error(erro);

      return res.status(500).json({
        erro: "Erro ao atualizar status da carga",
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

      return res.status(200).json(resultado);
    } catch (erro) {
      console.error(erro);

      return res.status(500).json({
        erro: "Erro ao atualizar status da carga",
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

      return res.status(200).json(resultado);
    } catch (erro) {
      console.error(erro);

      return res.status(500).json({
        erro: "Erro ao atualizar status da carga",
      });
    }
  }
}
