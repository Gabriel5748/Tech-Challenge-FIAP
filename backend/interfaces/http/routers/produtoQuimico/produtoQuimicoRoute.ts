import { Router } from "express";
import { produtoQuimicoController } from "../../../../src/container";

const router = Router();

// Cadastrar produto químico
router.post("/", (req, res) =>
  produtoQuimicoController.cadastrar(req, res),
);

// Listar produtos químicos
router.get("/", (req, res) => produtoQuimicoController.listar(req, res));

// Buscar produto químico por ID
router.get("/:id", (req, res) => produtoQuimicoController.buscar(req, res));

// Atualizar fórmula do produto químico
router.patch("/:id", (req, res) => produtoQuimicoController.atualizar(req, res));

// Inativar produto químico
router.delete("/:id", (req, res) =>
  produtoQuimicoController.inativar(req, res),
);

export default router;
