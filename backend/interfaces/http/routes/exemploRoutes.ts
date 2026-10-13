import { Router } from "express";
import { exemploController } from "../../../src/container";

const router = Router();

router.post("/exemplo", (req, res) => exemploController.cadastrar(req, res));
router.get("/exemplo", (req, res) => exemploController.buscar(req, res));

export default router;
