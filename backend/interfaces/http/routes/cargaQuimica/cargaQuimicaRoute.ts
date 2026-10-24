import { Router } from "express";
import { cargaQuimicaController } from "../../../../src/container";

const router = Router();

router.post("/", (req, res) => cargaQuimicaController.cadastrar(req, res));
router.get("/", (req, res) => cargaQuimicaController.buscar(req, res));
router.patch("/:id/status", (req, res) =>
  cargaQuimicaController.atualizarStatus(req, res),
);
router.get("/id", (req, res) =>
  cargaQuimicaController.buscarPorIdentificador(req, res),
);
router.patch("/:id/bloquear", (req, res) =>
  cargaQuimicaController.bloquear(req, res),
);
router.patch("/:id/liberar", (req, res) =>
  cargaQuimicaController.liberar(req, res),
);
router.patch("/:id/cancelar", (req, res) =>
  cargaQuimicaController.cancelar(req, res),
);

export default router;
