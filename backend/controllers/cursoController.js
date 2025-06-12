import CursoModel from "../models/curso.js";

class Curso {
    constructor() {
        this.model = CursoModel;
        // Vincular los métodos al this
        this.getAllCursosById = this.getAllCursosById.bind(this);
        this.getAllCursos = this.getAllCursos.bind(this);
        this.createCurso = this.createCurso.bind(this);
        this.updateCurso = this.updateCurso.bind(this);
        this.getFacilitadores = this.getFacilitadores.bind(this);
    }

    // Métodos de validación
    validarId(id) {
        if (!id || isNaN(id)) {
            throw {
                status: 400,
                message: "El ID proporcionado no es válido"
            };
        }
        return parseInt(id);
    }

    validarFechas(fechaInicio, fechaFin) {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);

        if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
            throw {
                status: 400,
                message: "Formato de fecha inválido"
            };
        }

        if (inicio >= fin) {
            throw {
                status: 400,
                message: "La fecha de inicio debe ser anterior a la fecha de fin"
            };
        }
    }

    validarCosto(costo) {
        if (costo && (isNaN(costo) || costo < 0)) {
            throw {
                status: 400,
                message: "El precio debe ser un número positivo"
            };
        }
    }

    validarDatosCurso(datos) {
        const {
            id_nombre,
            id_modalidad,
            id_status,
            id_facilitador,
            fecha_hora_inicio,
            fecha_hora_fin,
            costo,
            codigo
        } = datos;

        console.log('Datos recibidos en validarDatosCurso:', datos);

        // Validar campos requeridos
        if (!id_nombre || !id_modalidad || !id_status || !fecha_hora_inicio) {
            throw {
                status: 400,
                message: "Los campos curso, modalidad, estado y fecha de inicio son requeridos"
            };
        }

        // Validar que los IDs sean números válidos
        if (isNaN(parseInt(id_nombre)) || isNaN(parseInt(id_modalidad)) || isNaN(parseInt(id_status))) {
            throw {
                status: 400,
                message: "Los IDs proporcionados no son válidos"
            };
        }

        // Validar id_facilitador si está presente
        let facilitadorId = null;
        if (id_facilitador !== undefined && id_facilitador !== null && id_facilitador !== '') {
            try {
                facilitadorId = BigInt(id_facilitador);
            } catch (error) {
                console.error('Error al convertir id_facilitador a BigInt:', error);
                throw {
                    status: 400,
                    message: "El ID del facilitador no es válido"
                };
            }
        }

        // Validar fechas solo si se proporciona fecha_fin
        if (fecha_hora_fin) {
            this.validarFechas(fecha_hora_inicio, fecha_hora_fin);
        }

        // Validar costo si se proporciona
        if (costo !== undefined && costo !== null) {
            this.validarCosto(costo);
        }

        // Validar duración si se proporciona
        if (datos.duracion !== undefined && datos.duracion !== null) {
            const duracion = parseInt(datos.duracion);
            if (isNaN(duracion) || duracion < 0) {
                throw {
                    status: 400,
                    message: "La duración debe ser un número positivo"
                };
            }
        }

        const datosValidados = {
            ...datos,
            id_nombre: parseInt(id_nombre),
            id_modalidad: parseInt(id_modalidad),
            id_status: parseInt(id_status),
            id_facilitador: facilitadorId,
            costo: costo || 0,
            descripcion_corto: datos.descripcion_corto || '',
            color: datos.color || '#000000',
            codigo: codigo || null,
            duracion: datos.duracion ? parseInt(datos.duracion) : null
        };

        console.log('Datos validados:', datosValidados);
        return datosValidados;
    }

    // Métodos del controlador
    async getAllCursosById(req, res) {
        try {
            const id = this.validarId(req.params.id);
            const cursos = await this.model.getAllCursosById(id);
            
            return res.json({
                success: true,
                data: cursos
            });
        } catch (error) {
            return this.manejarError(error, res);
        }
    }

    async getAllCursos(req, res) {
        try {
            const cursos = await this.model.getAllCursosCompletos();
            return res.json({
                success: true,
                data: cursos
            });
        } catch (error) {
            return this.manejarError(error, res);
        }
    }

    async createCurso(req, res) {
        try {
            console.log('Datos recibidos en createCurso:', req.body);
            const cursoData = this.validarDatosCurso(req.body);
            console.log('Datos validados en createCurso:', cursoData);
            const nuevoCurso = await this.model.createCurso(cursoData);
            console.log('Curso creado:', nuevoCurso);
            
            return res.status(201).json({
                success: true,
                message: "Curso creado exitosamente",
                data: nuevoCurso
            });
        } catch (error) {
            return this.manejarError(error, res);
        }
    }

    async updateCurso(req, res) {
        try {
            const id = this.validarId(req.params.id);
            console.log('Datos recibidos en updateCurso:', req.body);
            const cursoData = this.validarDatosCurso(req.body);
            console.log('Datos validados en updateCurso:', cursoData);
            const cursoActualizado = await this.model.updateCurso(id, cursoData);
            console.log('Curso actualizado:', cursoActualizado);
            
            return res.json({
                success: true,
                message: "Curso actualizado exitosamente",
                data: cursoActualizado
            });
        } catch (error) {
            return this.manejarError(error, res);
        }
    }

    async getFacilitadores(req, res) {
        try {
            const facilitadores = await this.model.getFacilitadores();
            return res.json({
                success: true,
                data: facilitadores
            });
        } catch (error) {
            return this.manejarError(error, res);
        }
    }

    // Método para manejar errores
    manejarError(error, res) {
        console.error(`Error en Curso: ${error.message || error}`);
        
        const status = error.status || 500;
        const message = error.message || "Error interno del servidor";

        return res.status(status).json({
            success: false,
            message
        });
    }
}

const cursoController = new Curso();
export default cursoController;