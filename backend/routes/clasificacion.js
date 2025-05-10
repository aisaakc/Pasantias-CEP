import express from "express";
import Clasificacion from '../controllers/clasificacionController.js'; 

const router = express.Router();

router.get('/clasificaciones/parent', Clasificacion.getParentClasificaciones);

router.post('/clasificaciones/create', Clasificacion.createClasificacion);

router.get('/clasificaciones/tipo/:id', Clasificacion.getAllSubclasificaciones);
router.get('/clasificaciones/tipo/:id/:id_parent', Clasificacion.getAllSubclasificaciones);




router.get('/clasificaciones/parent/:id', Clasificacion.getAllHijos);

router.get('/clasificaciones/all', Clasificacion.getAllClasificaciones);

// Ruta para actualizar una clasificación
router.put('/clasificaciones/update/:id', Clasificacion.updateClasificacion);

router.delete('/clasificaciones/delete/:id', Clasificacion.deleteClasificacion);




export default router;
