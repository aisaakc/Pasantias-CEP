import express from "express";
import personaController from "../controllers/personaController.js";

const router = express.Router();

router.get("/usuarios", personaController.getUsuarios);
router.get("/roles", personaController.getRoles);
router.post("/new", personaController.createUser);
router.put("/usuarios/:id", personaController.updateUser);

export default router;