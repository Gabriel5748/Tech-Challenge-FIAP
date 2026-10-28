"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = require("../../../../src/container");
const router = (0, express_1.Router)();
// Cadastrar produto químico
router.post("/", (req, res) => container_1.produtoQuimicoController.cadastrar(req, res));
// Listar produtos químicos
router.get("/", (req, res) => container_1.produtoQuimicoController.listar(req, res));
// Buscar produto químico por ID
router.get("/:id", (req, res) => container_1.produtoQuimicoController.buscar(req, res));
// Atualizar fórmula do produto químico
router.patch("/:id", (req, res) => container_1.produtoQuimicoController.atualizar(req, res));
// Inativar produto químico
router.delete("/:id", (req, res) => container_1.produtoQuimicoController.inativar(req, res));
exports.default = router;
