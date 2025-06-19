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
    
    async getAllSubclasificaciones(req, res) {
    
        const type_id = parseInt(req.params.id); 
        const parent_id = parseInt(req.params.id_parent);
       
        if (isNaN(type_id)) {
            return res.status(400).json({ error: "ID de clasificación inválido." });
        }
      
        try {
            const descendants = await Clasificacion.getAllSubclasificaciones(type_id, parent_id);
            
            res.json(descendants); 
        } catch (error) {
            console.error("Error en clasificacionController.getAllSubclasificaciones:", error.message);
            res.status(500).json({
                error: "Error interno del servidor al obtener subclasificaciones...."
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

    async getAllIcons(req, res) {
        try {
            const icons = await Clasificacion.getAllIcons();
            res.status(200).json(icons);
        } catch (error) {
            console.error("Error en clasificacionController.getAllIcons:", error.message);
            res.status(500).json({ error: "Error interno del servidor al obtener todos los íconos." });
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
            if (error.message.includes("PGT: Prohibido")) {
                return res.status(403).json({ error: error.message });
            }
            
            // Error general del servidor
            res.status(500).json({
                error: "Error interno del servidor al actualizar la clasificación."
            });
        }
    }

    async deleteClasificacion(req, res) {
        const id = parseInt(req.params.id);

        // Validación del ID
        if (isNaN(id)) {
            return res.status(400).json({ error: "ID de clasificación inválido." });
        }

        try {
            const resultado = await Clasificacion.delete(id);
            res.status(200).json(resultado);
        } catch (error) {
            console.error("Error en clasificacionController.deleteClasificacion:", error.message);
            
            // Manejar errores específicos
            if (error.name === "NotFoundError") {
                return res.status(404).json({ error: error.message });
            }
            if (error.name === "ProtectedError") {
                return res.status(403).json({ error: error.message });
            }
            if (error.name === "SubclasificacionesError") {
                return res.status(409).json({ error: error.message });
            }
            if (error.name === "ConstraintError") {
                return res.status(409).json({ error: error.message });
            }
            
            // Error general del servidor
            res.status(500).json({
                error: "Error interno del servidor al eliminar la clasificación."
            });
        }
    }

    async getParentHierarchy(req, res) {
        try {
            const { id_clasificacion } = req.params;
            console.log('ID recibido en el controlador:', id_clasificacion);
            
            // Decodificar el ID de base64
            const decodedId = JSON.parse(Buffer.from(id_clasificacion, 'base64').toString()).id;
            console.log('ID decodificado:', decodedId);
            
            if (!decodedId) {
                console.error('ID decodificado es nulo o inválido');
                return res.status(400).json({ error: 'ID inválido' });
            }

            const parents = await Clasificacion.getParentHierarchy(decodedId);
            console.log('Jerarquía de padres obtenida:', parents);
            
            res.json(parents);
        } catch (error) {
            console.error("Error detallado en getParentHierarchy controller:", {
                message: error.message,
                code: error.code,
                detail: error.detail,
                hint: error.hint,
                stack: error.stack
            });
            
            if (error.message.includes('Invalid ID format')) {
                return res.status(400).json({ error: 'Formato de ID inválido' });
            }
            res.status(500).json({ 
                error: error.message,
                details: error.detail || 'Error interno del servidor'
            });
        }
    } 
    

}

export default new clasificacionController();