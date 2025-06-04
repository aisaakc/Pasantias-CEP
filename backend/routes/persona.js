import express from "express";
import personaController from "../controllers/personaController.js";

const router = express.Router();

router.get("/usuarios", personaController.getUsuarios);
router.get("/roles", personaController.getRoles);


export default router;