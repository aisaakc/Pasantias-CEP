import CursoModel from "../models/curso.js";

class CursoController {
    
    async getAllCursosById(req, res) {
        
        try {
            const { id } = req.params;
            
            // Validar que el id sea un número válido
            if (!id || isNaN(id)) {
                return res.status(400).json({ 
                    success: false, 
                    message: "El ID proporcionado no es válido" 
                });
            }

            const parsedId = parseInt(id);
            const getAllCursosById = await CursoModel.getAllCursosById(parsedId);
            res.json(getAllCursosById);
        } catch (error) {
            console.error("Error en CursoController: ", error.message);
            res.status(500).json({ error: "Error al buscar datos para los cursos." });
        }
    }            
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

            async createCurso(req, res) {
                try {
                    const {
                        id_nombre,
                        id_modalidad,
                        id_status,
                        fecha_hora_inicio,
                        fecha_hora_fin,
                        costo,
                        descripcion_corto,
                        codigo,
                        color
                    } = req.body;

                    // Validación de campos requeridos
                    if (!id_nombre || !id_modalidad || !id_status || !fecha_hora_inicio || !fecha_hora_fin || !codigo) {
                        return res.status(400).json({
                            success: false,
                            message: "Faltan campos requeridos"
                        });
                    }

                    // Validación de fechas
                    const fechaInicio = new Date(fecha_hora_inicio);
                    const fechaFin = new Date(fecha_hora_fin);

                    if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
                        return res.status(400).json({
                            success: false,
                            message: "Formato de fecha inválido"
                        });
                    }

                    if (fechaInicio >= fechaFin) {
                        return res.status(400).json({
                            success: false,
                            message: "La fecha de inicio debe ser anterior a la fecha de fin"
                        });
                    }

                    // Validación de precio
                    if (costo && (isNaN(costo) || costo < 0)) {
                        return res.status(400).json({
                            success: false,
                            message: "El precio debe ser un número positivo"
                        });
                    }

                    const cursoData = {
                        id_nombre,
                        id_modalidad,
                        id_status,
                        fecha_hora_inicio,
                        fecha_hora_fin,
                        costo: costo || 0,
                        descripcion_corto: descripcion_corto || '',
                        codigo,
                        color: color || '#000000' // Color por defecto si no se proporciona
                    };

                    const nuevoCurso = await CursoModel.createCurso(cursoData);
                    
                    res.status(201).json({
                        success: true,
                        message: "Curso creado exitosamente",
                        data: nuevoCurso
                    });

                } catch (error) {
                    console.error("Error en createCurso:", error.message);
                    res.status(500).json({
                        success: false,
                        message: error.message || "Error al crear el curso"
                    });
                }
            }
}

export default new CursoController();