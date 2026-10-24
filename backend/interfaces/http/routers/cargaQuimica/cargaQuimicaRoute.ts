import { Router } from "express";
import { cargaQuimicaController } from "../../../../src/container";

const router = Router();

// Cadastrar carga química
router.post("/", (req, res) => cargaQuimicaController.cadastrar(req, res));

// Buscar carga química por nome
router.get("/", (req, res) => cargaQuimicaController.buscar(req, res));

// Atualizar status da carga química
router.patch("/:id/status", (req, res) =>
  cargaQuimicaController.atualizarStatus(req, res),
);

export default router;
