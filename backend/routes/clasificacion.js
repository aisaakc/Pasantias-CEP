import express from "express";
import Clasificacion from '../controllers/clasificacionController.js'; 

const router = express.Router();

router.get('/clasificaciones/parent', Clasificacion.getParentClasificaciones);

router.post('/clasificaciones/create', Clasificacion.createClasificacion);

router.get('/clasificaciones/tipo/:id/:id_parent', Clasificacion.getAllSubclasificaciones);

router.get('/clasificaciones/all', Clasificacion.getAllClasificaciones);

router.put('/clasificaciones/update/:id', Clasificacion.updateClasificacion);

router.delete('/clasificaciones/delete/:id', Clasificacion.deleteClasificacion);

router.get('/clasificaciones/parents/:id_clasificacion', Clasificacion.getParentHierarchy); 

router.get('/clasificaciones/icons', Clasificacion.getAllIcons);

router.get('/clasificaciones/jerarquia/:id_raiz', Clasificacion.getHierarchyFromId);


export default router;
