import CursoModel from "../models/curso.js";

class CursoController {
    
    // Obtener todos los cursos
    async getAllCursos(req, res) {
        try {
            const cursos = await CursoModel.getAllCursosCompletos();
            res.json({
                success: true,
                data: cursos
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Error al obtener los cursos"
            });
        }
    }

   
}

export default new CursoController();