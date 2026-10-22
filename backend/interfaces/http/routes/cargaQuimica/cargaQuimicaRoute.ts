import { Router } from "express";
import { cargaQuimicaController } from "../../../../src/container";

const router = Router();

router.post("/", (req, res) =>
  cargaQuimicaController.cadastrar(req, res),
);
router.get("/", (req, res) => cargaQuimicaController.buscar(req, res));
router.patch("/:id/status", (req, res) =>
  cargaQuimicaController.atualizarStatus(req, res),
);

export default router;
