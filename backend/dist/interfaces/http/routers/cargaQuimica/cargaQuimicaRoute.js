"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = require("../../../../src/container");
const router = (0, express_1.Router)();
// Cadastrar carga química
router.post("/", (req, res) => container_1.cargaQuimicaController.cadastrar(req, res));
// Buscar carga química por nome
router.get("/", (req, res) => container_1.cargaQuimicaController.buscar(req, res));
// Atualizar status da carga química
router.patch("/:id/status", (req, res) => container_1.cargaQuimicaController.atualizarStatus(req, res));
exports.default = router;
