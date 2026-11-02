import { Router, Request, Response } from "express";
import { validarTransicaoDeStatus } from "../../../../src/domain/entities/statusCarga";

const router = Router();

router.post("/validar-transicao", (req: Request, res: Response) => {
  const { status_atual, novo_status } = req.body || {};

  if (!status_atual || !novo_status) {
    return res.status(400).json({
      permitida: false,
      status_resultante: "",
      mensagem: "Parâmetros 'status_atual' e 'novo_status' são obrigatórios.",
    });
  }

  try {
    const resultante = validarTransicaoDeStatus(status_atual, novo_status);
    return res.status(200).json({
      permitida: true,
      status_resultante: resultante,
      mensagem: `Transição de '${status_atual}' para '${resultante}' é válida conforme a State Machine.`,
    });
  } catch (erro: any) {
    return res.status(400).json({
      permitida: false,
      status_resultante: "",
      mensagem: erro.message || "Transição inválida.",
    });
  }
});

export default router;
