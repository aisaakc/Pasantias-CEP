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

    async getAllClasificaciones(req, res) {
        try {
          const clasificaciones = await Clasificacion.getAllClasificaciones();
          res.status(200).json(clasificaciones);
        } catch (error) {
          console.error("Error en clasificacionController.getAllClasificaciones:", error.message);
          res.status(500).json({ error: "Error interno del servidor al obtener todas las clasificaciones." });
        }
    }
      
    async updateClasificacion(req, res) {
        const id = parseInt(req.params.id);
        const datosActualizacion = req.body;

        // Validación del ID
        if (isNaN(id)) {
            return res.status(400).json({ error: "ID de clasificación inválido." });
        }

        // Validación de datos requeridos
        if (!datosActualizacion || !datosActualizacion.nombre) {
            return res.status(400).json({ error: "El nombre de la clasificación es obligatorio." });
        }

        try {
            // Verificar si la clasificación existe antes de actualizar
            const clasificacionExistente = await Clasificacion.getAllClasificaciones();
            const existe = clasificacionExistente.some(c => c.id_clasificacion === id);
            if (!existe) {
                return res.status(404).json({ error: "Clasificación no encontrada." });
            }

            const clasificacionActualizada = await Clasificacion.updateClasificacion(id, datosActualizacion);
            
            // Enviar respuesta exitosa
            res.status(200).json({
                mensaje: "Clasificación actualizada correctamente",
                data: clasificacionActualizada
            });

        } catch (error) {
            console.error("Error en clasificacionController.updateClasificacion:", error.message);
            
            // Manejar errores específicos
            if (error.message === "Clasificación no encontrada.") {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === "Ya existe una clasificación con este nombre.") {
                return res.status(409).json({ error: error.message });
            }
            
            // Error general del servidor
            res.status(500).json({
                error: "Error interno del servidor al actualizar la clasificación."
            });
        }
    }
}

export default new clasificacionController();