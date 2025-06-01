import express from "express";
import personaController from "../controllers/personaController.js";

const router = express.Router();

// Ruta para obtener todos los usuarios
router.get("/usuarios", personaController.getUsuarios);

router.post("/", personaController.createPersona);

router.post("/roles", personaController.createPersonaWithRoles);

export default router;

