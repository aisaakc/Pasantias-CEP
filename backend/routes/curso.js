import express from "express";
import CursoController from "../controllers/cursoController.js";

const router = express.Router();

router.get("/cursos/:id", CursoController.getAllCursosById);
router.get("/cursos", CursoController.getAllCursos);
router.post("/cursos", CursoController.createCurso);
router.put("/cursos/:id", CursoController.updateCurso);
router.put("/cursos/:id/horarios", CursoController.updateHorarios);
router.get("/facilitadores", CursoController.getFacilitadores);
router.post("/cursos/asociar-documento", CursoController.asociarDocumento);
router.get("/cursos/validate-cohorte", CursoController.validateCohorteCode);
router.post("/cursos/:cohorteId/participantes", CursoController.addParticipanteToCohorte.bind(CursoController));

export default router;
