import { Router } from "express";
import { produtoQuimicoController } from "../../../../src/container";

const router = Router();

router.post("/", (req, res) =>
  produtoQuimicoController.cadastrar(req, res),
);
router.get("/", (req, res) => produtoQuimicoController.listar(req, res));
router.get("/:id", (req, res) => produtoQuimicoController.buscar(req, res));
router.patch("/:id", (req, res) => produtoQuimicoController.atualizar(req, res));
router.delete("/:id", (req, res) =>
  produtoQuimicoController.inativar(req, res),
);

export default router;
