import express from "express";
import Clasificacion from '../controllers/clasificacionController.js'; // Asegúrate del nombre exacto

const router = express.Router();

// Obtener clasificaciones principales (sin padre)
router.get('/clasificaciones/parent', Clasificacion.getParentClasificaciones);

// Crear una nueva clasificación
router.post('/clasificaciones/create', Clasificacion.createClasificacion);

// Obtener todos los hijos (descendientes) de una clasificación
router.get('/clasificaciones/hijos-todos/:id', Clasificacion.getAllSubclasificaciones);

export default router;
