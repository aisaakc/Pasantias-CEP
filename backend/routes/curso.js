import express from "express";
import CursoController from "../controllers/cursoController.js";

const router = express.Router();

// Rutas fijas primero
router.get("/cursos/cohortes-por-curso", CursoController.getCohortesConCurso);
router.get("/cursos/estadisticas/cohortes-participantes", CursoController.getCohortesConParticipantes);
router.get("/cursos/validate-cohorte", CursoController.validateCohorteCode);
router.get("/facilitadores", CursoController.getFacilitadores);
router.post("/cursos/asociar-documento", CursoController.asociarDocumento);
router.post("/cursos/estadisticas/conteo-genero-participantes", CursoController.getConteoGeneroDesdeParticipantes.bind(CursoController));

// Rutas con parámetros después
router.get("/cursos/:cohorteId/participantes", CursoController.getParticipantesPorCohorte.bind(CursoController));
router.get("/cursos/:cohorteId/conteo-genero", CursoController.getConteoGeneroPorCohorte);
router.post("/cursos/:cohorteId/participantes", CursoController.addParticipanteToCohorte.bind(CursoController));
router.get("/cursos/:id", CursoController.getAllCursosById);
router.get("/cursos", CursoController.getAllCursos);
router.post("/cursos", CursoController.createCurso);
router.put("/cursos/:id", CursoController.updateCurso);
router.put("/cursos/:id/horarios", CursoController.updateHorarios);

export default router;
