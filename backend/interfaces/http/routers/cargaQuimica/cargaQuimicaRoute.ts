import { Router } from "express";
import { cargaQuimicaController } from "../../../../src/container";

const router = Router();

// Listar todas as cargas químicas ou filtrar por nome (?nome=...)
router.get("/", (req, res) => cargaQuimicaController.listar(req, res));

// Buscar carga química por ID
router.get("/:id", (req, res) =>
  cargaQuimicaController.buscarPorIdentificador(req, res),
);

// Cadastrar nova carga química
router.post("/", (req, res) => cargaQuimicaController.cadastrar(req, res));

// Atualizar status genérico da carga química
router.patch("/:id/status", (req, res) =>
  cargaQuimicaController.atualizarStatus(req, res),
);

// Bloquear carga química
router.patch("/:id/bloquear", (req, res) =>
  cargaQuimicaController.bloquear(req, res),
);

// Liberar carga química
router.patch("/:id/liberar", (req, res) =>
  cargaQuimicaController.liberar(req, res),
);

// Cancelar carga química
router.patch("/:id/cancelar", (req, res) =>
  cargaQuimicaController.cancelar(req, res),
);

export default router;
