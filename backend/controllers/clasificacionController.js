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
}

export default new clasificacionController();
