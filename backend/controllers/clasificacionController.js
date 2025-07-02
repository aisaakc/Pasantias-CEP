import Clasificacion from "../models/clasificacion.js"; 
import pool from "../db.js";

class clasificacionController {

    async getParentClasificaciones(req, res){
        try {
            const parents = await Clasificacion.getParentClassifications();
            res.json(parents);
        } catch (error) {
            console.error("Error en AuthController.getParentsClasificaciones:", error.message);
            res.status(500).json({
                error: "Error interno del servidor al obtener clasificaciones principales.",
                dbError: error.message,
                detail: error.detail || null
            })
        }
    }
    
    async createClasificacion(req, res) {
        const nuevaClasificacionData = req.body;
        console.log('Depuración BACKEND - createClasificacion - req.body.adicional:', nuevaClasificacionData.adicional);
        console.log('Depuración BACKEND - createClasificacion - typeof adicional:', typeof nuevaClasificacionData.adicional);
        if (!nuevaClasificacionData || !nuevaClasificacionData.nombre) {
          return res.status(400).json({ error: "El nombre de la clasificación es obligatorio." });
        }
        try {
          const nuevaClasificacion = await Clasificacion.create(nuevaClasificacionData);
          res.status(201).json(nuevaClasificacion);
        } catch (error) {
          console.error("Error en clasificacionController.createClasificacion:", error.message);
          if (error.message.includes("Ya existe una clasificación con este nombre.")) {
            return res.status(409).json({ error: error.message, dbError: error.message, detail: error.detail || null })
          }
          res.status(500).json({
            error: "Error interno del servidor al crear la clasificación.",
            dbError: error.message,
            detail: error.detail || null
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
                error: "Error interno del servidor al obtener subclasificaciones....",
                dbError: error.message,
                detail: error.detail || null
            });
        }
    }

    async getAllClasificaciones(req, res) {
        try {
          const clasificaciones = await Clasificacion.getAllClasificaciones();
          res.status(200).json(clasificaciones);
        } catch (error) {
          console.error("Error en clasificacionController.getAllClasificaciones:", error.message);
          res.status(500).json({ error: "Error interno del servidor al obtener todas las clasificaciones.", dbError: error.message, detail: error.detail || null });
        }
    }

    async getAllIcons(req, res) {
        try {
            const icons = await Clasificacion.getAllIcons();
            res.status(200).json(icons);
        } catch (error) {
            console.error("Error en clasificacionController.getAllIcons:", error.message);
            res.status(500).json({ error: "Error interno del servidor al obtener todos los íconos.", dbError: error.message, detail: error.detail || null });
        }
    }
      
    async updateClasificacion(req, res) {
        const id = parseInt(req.params.id);
        const datosActualizacion = req.body;
        console.log('Depuración BACKEND - updateClasificacion - req.body.adicional:', datosActualizacion.adicional);
        console.log('Depuración BACKEND - updateClasificacion - typeof adicional:', typeof datosActualizacion.adicional);

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
                return res.status(404).json({ error: error.message, dbError: error.message, detail: error.detail || null });
            }
            if (error.message === "Ya existe una clasificación con este nombre.") {
                return res.status(409).json({ error: error.message, dbError: error.message, detail: error.detail || null });
            }
            if (error.message.includes("PGT:")) {
                return res.status(403).json({ error: error.message, dbError: error.message, detail: error.detail || null });
            }
            
            // Error general del servidor
            res.status(500).json({
                error: "Error interno del servidor al actualizar la clasificación.",
                dbError: error.message,
                detail: error.detail || null
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
                return res.status(404).json({ error: error.message, dbError: error.message, detail: error.detail || null });
            }
            if (error.name === "ProtectedError") {
                return res.status(403).json({ error: error.message, dbError: error.message, detail: error.detail || null });
            }
            if (error.name === "SubclasificacionesError") {
                return res.status(409).json({ error: error.message, dbError: error.message, detail: error.detail || null });
            }
            if (error.name === "ConstraintError") {
                return res.status(409).json({ error: error.message, dbError: error.message, detail: error.detail || null });
            }
            
            // Error general del servidor
            res.status(500).json({
                error: "Error interno del servidor al eliminar la clasificación.",
                dbError: error.message,
                detail: error.detail || null
            });
        }
    }

    async getParentHierarchy(req, res) {
        try {
            const { id_clasificacion } = req.params;
            console.log('ID recibido en el controlador:', id_clasificacion);
            
            // Decodificar el ID de base64
            console.log('Valor recibido para parsear:', Buffer.from(id_clasificacion, 'base64').toString());
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
                return res.status(400).json({ error: 'Formato de ID inválido', dbError: error.message, detail: error.detail || null });
            }
            res.status(500).json({ 
                error: error.message,
                dbError: error.message,
                detail: error.detail || 'Error interno del servidor'
            });
        }
    } 
    
    async getHierarchyFromId(req, res) {
        try {
            const id_raiz = parseInt(req.params.id_raiz);
            const jerarquia = await Clasificacion.getHierarchyFromId(id_raiz);
            res.json(jerarquia);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}

// Función auxiliar para convertir máscara a regex
function maskToRegex(mask) {
  const match = mask.match(/9+/);
  if (!match) return null;
  const digits = match[0];
  const pattern = mask.replace(digits, `\\d{${digits.length}}`);
  return `^${pattern}$`;
}

// Endpoint para obtener el siguiente código
// GET /api/clasificacion/next-code?mask=CEP-99
export async function getNextCourseCode(req, res) {
  try {
    const { mask } = req.query;
    if (!mask) return res.status(400).json({ error: 'Mask requerida' });
    const regex = maskToRegex(mask);
    if (!regex) return res.status(400).json({ error: 'Máscara inválida' });
    const query = `
      SELECT adicional->>'id' AS codigo
      FROM clasificacion
      WHERE type_id = 5
        AND adicional->>'id' ~ $1
    `;
    const result = await pool.query(query, [regex]);
    const match = mask.match(/9+/);
    const digits = match[0];
    const codes = result.rows.map(r => r.codigo);
    const numbers = codes.map(code => {
      const numMatch = code.match(new RegExp(`(\\d{${digits.length}})$`));
      return numMatch ? parseInt(numMatch[1], 10) : 0;
    });
    const max = numbers.length ? Math.max(...numbers) : 0;
    const next = String(max + 1).padStart(digits.length, '0');
    const nextCode = mask.replace(digits, next);
    return res.json({ nextCode });
  } catch (error) {
    console.error('Error en getNextCourseCode:', error);
    return res.status(500).json({ error: 'Error interno al calcular el siguiente código' });
  }
}

export default new clasificacionController();