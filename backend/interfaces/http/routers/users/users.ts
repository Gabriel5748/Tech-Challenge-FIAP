import { Router } from "express";
import { userController } from "../../../../src/container";

const router = Router();

// Listar todos os usuários
router.get("/", (req, res) => userController.listar(req, res));

// Buscar usuário por ID
router.get("/:id", (req, res) => userController.buscarPorId(req, res));

// Cadastrar novo usuário
router.post("/", (req, res) => userController.cadastrar(req, res));

// Atualizar usuário existente
router.put("/:id", (req, res) => userController.atualizar(req, res));

// Deletar usuário
router.delete("/:id", (req, res) => userController.deletar(req, res));

// Atribuir grupo ao usuário
router.post("/:id/grupos", (req, res) => userController.atribuirGrupo(req, res));

export default router;
