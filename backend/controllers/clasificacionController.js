import Clasificacion from "../models/clasificacion.js"; 
class clasificacionController {

    async getParentClasificaciones(req, res){
        try {
            const parents = await Clasificacion.getParentClassifications();
            res.json(parents);
        } catch (error) {
            console.error("Error en AuthController.getParentsClasificaciones:", error.message);
            res.status(500).json({
                error: "Error interno del servidor al obtener clasificaciones principales."
            })
        }
    }
    
    async createClasificacion(req, res) {
        const nuevaClasificacionData = req.body; 
        if (!nuevaClasificacionData || !nuevaClasificacionData.nombre) {
             return res.status(400).json({ error: "El nombre de la clasificación es obligatorio." });
        }
        try {
            const nuevaClasificacion = await Clasificacion.create(nuevaClasificacionData);
            res.status(201).json(nuevaClasificacion);
        } catch (error) {
            console.error("Error en clasificacionController.createClasificacion:", error.message);
            if (error.message.includes("Ya existe una clasificación con este nombre.")) {
                 return res.status(409).json({ error: error.message })
            }
            res.status(500).json({
                error: "Error interno del servidor al crear la clasificación."
            });
        }
    }


    async getAllHijos(req, res) {
        const parentId = parseInt(req.params.id); 
        if (isNaN(parentId)) {
            return res.status(400).json({ error: "ID de clasificación inválido." });
        }
        
        try {
            const descendants = await Clasificacion.getAllHijos(parentId);
            res.json(descendants); 
        } catch (error) {
            console.error("Error en clasificacionController.getAllSubclasificaciones:", error.message);
            res.status(500).json({
                error: "Error interno del servidor al obtener subclasificaciones."
            });
        }
    }

    async getAllSubclasificaciones(req, res) {
        const type_id = parseInt(req.params.id); 
        if (isNaN(type_id)) {
            return res.status(400).json({ error: "ID de clasificación inválido." });
        }
        
        try {

            const descendants = await Clasificacion.getAllSubclasificaciones(type_id);
            res.json(descendants); 

        } catch (error) {
            console.error("Error en clasificacionController.getAllSubclasificaciones:", error.message);
            res.status(500).json({
                error: "Error interno del servidor al obtener subclasificaciones."
            });
        }
    }
    
}

export default new clasificacionController();