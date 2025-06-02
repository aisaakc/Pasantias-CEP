import express from "express";
import personaController from "../controllers/personaController.js";

const router = express.Router();

// Ruta para obtener todos los usuarios
router.get("/usuarios", personaController.getUsuarios);
router.get("/roles", personaController.getRoles);

export default router;

