import express from "express";
import CursoController from "../controllers/cursoController.js";

const router = express.Router();

router.get("/cursos/:id", CursoController.getAllCursosById);
router.get("/cursos", CursoController.getAllCursos);
router.post("/cursos", CursoController.createCurso);

export default router;
