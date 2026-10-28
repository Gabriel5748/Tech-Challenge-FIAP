"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = require("../../../../src/container");
const router = (0, express_1.Router)();
// Listar todos os usuários
router.get("/", (req, res) => container_1.userController.listar(req, res));
// Buscar usuário por ID
router.get("/:id", (req, res) => container_1.userController.buscarPorId(req, res));
// Cadastrar novo usuário
router.post("/", (req, res) => container_1.userController.cadastrar(req, res));
// Atualizar usuário existente
router.put("/:id", (req, res) => container_1.userController.atualizar(req, res));
// Deletar usuário
router.delete("/:id", (req, res) => container_1.userController.deletar(req, res));
// Atribuir grupo ao usuário
router.post("/:id/grupos", (req, res) => container_1.userController.atribuirGrupo(req, res));
exports.default = router;
