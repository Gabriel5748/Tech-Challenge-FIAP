import { Router } from "express";
import { grupoController } from "../../../../src/container";

const router = Router();

// Listar todos os grupos
router.get("/", (req, res) => grupoController.listar(req, res));

// Buscar grupo por ID
router.get("/:id", (req, res) => grupoController.buscarPorId(req, res));

// Cadastrar novo grupo
router.post("/", (req, res) => grupoController.cadastrar(req, res));

export default router;
