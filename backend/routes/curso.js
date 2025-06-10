import express from "express";
import CursoController from "../controllers/cursoController.js";

const router = express.Router();

router.get("/cursos/:id", CursoController.getAllCursosById);
router.get("/cursos", CursoController.getAllCursos);
router.post("/cursos", CursoController.createCurso);
router.put("/cursos/:id", CursoController.updateCurso);
router.get("/facilitadores", CursoController.getFacilitadores);

export default router;
