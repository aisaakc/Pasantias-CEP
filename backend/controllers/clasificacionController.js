import Clasificacion from "../models/clasificacion.js"; // 👈 agrega .js si no lo tiene
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
        const nuevaClasificacionData = req.body; // Los datos vienen en el cuerpo de la solicitud POST
        if (!nuevaClasificacionData || !nuevaClasificacionData.nombre) {
             return res.status(400).json({ error: "El nombre de la clasificación es obligatorio." });
        }
        try {
            const nuevaClasificacion = await Clasificacion.create(nuevaClasificacionData);
            res.status(201).json(nuevaClasificacion);
        } catch (error) {
            console.error("Error en clasificacionController.createClasificacion:", error.message);
            if (error.message.includes("Ya existe una clasificación con este nombre.")) {
                 return res.status(409).json({ error: error.message }); // Conflicto
            }
            res.status(500).json({
                error: "Error interno del servidor al crear la clasificación."
            });
        }
    }


    async getAllSubclasificaciones(req, res) {
        const parentId = parseInt(req.params.id); // Obtiene el ID de la clasificación principal desde la URL
        if (isNaN(parentId)) {
            return res.status(400).json({ error: "ID de clasificación inválido." });
        }
        
        try {
            // Llama a la función para obtener las subclasificaciones (hijos) basado en type_id
            const descendants = await Clasificacion.getAllDescendants(parentId);
            res.json(descendants); // Devuelve los descendientes como respuesta
        } catch (error) {
            console.error("Error en clasificacionController.getAllSubclasificaciones:", error.message);
            res.status(500).json({
                error: "Error interno del servidor al obtener subclasificaciones."
            });
        }
    }
    

    
    
    
    
    
    
    
   
    
}

export default new clasificacionController();