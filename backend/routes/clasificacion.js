import express from "express";
import Clasificacion from '../controllers/clasificacionController.js'; // Asegúrate del nombre exacto

const router = express.Router();

router.get('/clasificaciones/parent' , Clasificacion.getParentClasificaciones);
router.get('/clasificaciones/:typeId/items', Clasificacion.getClasificaciones);
router.post('/clasificaciones/create', Clasificacion.createClasificacion);

export default router;
