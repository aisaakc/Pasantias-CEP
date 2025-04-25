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
    async getClasificaciones (req, res){
        const typeId = req.params.typeId;

        try {
            const items = await Clasificacion.getItemsBytypeID(typeId);
            res.json(items);
        } catch (error) {
            console.error(`Error en AuthController.getClasificacionItems (typeId: ${typeId}):`, error.message);
            res.status(500).json({
                error: "Error interno del servidor al obtener elementos de clasificacion"
            });
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
}

export default new clasificacionController();
