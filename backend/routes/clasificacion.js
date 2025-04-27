import express from "express";
import Clasificacion from '../controllers/clasificacionController.js'; 

const router = express.Router();

router.get('/clasificaciones/parent', Clasificacion.getParentClasificaciones);

router.post('/clasificaciones/create', Clasificacion.createClasificacion);

router.get('/clasificaciones/tipo/:id', Clasificacion.getAllSubclasificaciones);

router.get('/clasificaciones/parent/:id', Clasificacion.getAllHijos);

export default router;
