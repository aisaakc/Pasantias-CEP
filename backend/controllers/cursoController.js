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
        this.updateHorarios = this.updateHorarios.bind(this);
        this.asociarDocumento = this.asociarDocumento.bind(this);
        this.validateCohorteCode = this.validateCohorteCode.bind(this);
        this.getCohortesConParticipantes = this.getCohortesConParticipantes.bind(this);
        this.getParticipantesPorCohorte = this.getParticipantesPorCohorte.bind(this);
        this.getCohortesConCurso = this.getCohortesConCurso.bind(this);
        this.getCursosByFacilitador = this.getCursosByFacilitador.bind(this);
        this.updateAsistenciaParticipante = this.updateAsistenciaParticipante.bind(this);
        this.getHorariosByCohorte = this.getHorariosByCohorte.bind(this);
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

    async updateHorarios(req, res) {
        try {
            const id = this.validarId(req.params.id);
            const { horarios } = req.body;

            if (!Array.isArray(horarios)) {
                throw {
                    status: 400,
                    message: "Los horarios deben ser un array"
                };
            }

            // Validar cada horario
            horarios.forEach(horario => {
                if (!horario.fecha_hora_inicio || !horario.fecha_hora_fin) {
                    throw {
                        status: 400,
                        message: "Cada horario debe tener fecha de inicio y fin"
                    };
                }

                const inicio = new Date(horario.fecha_hora_inicio);
                const fin = new Date(horario.fecha_hora_fin);

                if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
                    throw {
                        status: 400,
                        message: "Formato de fecha inválido en los horarios"
                    };
                }

                if (inicio >= fin) {
                    throw {
                        status: 400,
                        message: "La fecha de inicio debe ser anterior a la fecha de fin en cada horario"
                    };
                }
            });

            const cursoActualizado = await this.model.updateHorariosCurso(id, horarios);
            
            return res.json({
                success: true,
                message: "Horarios actualizados exitosamente",
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

    async validateCohorteCode(req, res) {
        try {
            const { codigo_cohorte, id_nombre } = req.query;
            
            if (!codigo_cohorte || !id_nombre) {
                return res.status(400).json({
                    success: false,
                    message: "Código de cohorte e ID del curso son requeridos"
                });
            }

            const exists = await this.model.validateCohorteCode(codigo_cohorte, parseInt(id_nombre));
            
            return res.json({
                success: true,
                exists: exists
            });
        } catch (error) {
            return this.manejarError(error, res);
        }
    }

    // Asociar un documento a un curso
    async asociarDocumento(req, res) {
        try {
            const { id_curso, id_documento } = req.body;
            if (!id_curso || !id_documento) {
                return res.status(400).json({ success: false, message: 'Faltan parámetros id_curso o id_documento' });
            }
            const cursoActualizado = await this.model.addDocumentoToCurso(id_curso, id_documento);
            return res.status(200).json({ success: true, data: cursoActualizado });
        } catch (error) {
            return this.manejarError(error, res);
        }
    }

    // Nuevo endpoint: agregar participante a una cohorte
    async addParticipanteToCohorte(req, res) {
        const { cohorteId } = req.params;
        const { idP, monto } = req.body;
        if (!cohorteId || !idP || !monto) {
            return res.status(400).json({ error: 'Faltan datos requeridos' });
        }
        try {
            const result = await this.model.addParticipanteToCohorte(Number(cohorteId), { idP, monto });
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getCohortesConParticipantes(req, res) {
        try {
            const data = await this.model.getCohortesConParticipantes();
            res.json({ success: true, data });
        } catch (error) {
            this.manejarError(error, res);
        }
    }

    async getConteoGeneroPorCohorte(req, res) {
        try {
            const { cohorteId } = req.params;
            if (!cohorteId) {
                return res.status(400).json({ success: false, message: 'Falta el id de la cohorte' });
            }
            // Obtener el campo participantes de la cohorte
            const result = await this.model.getParticipantesPorCohorte(Number(cohorteId));
            if (!result) {
                return res.status(404).json({ success: false, message: 'Cohorte no encontrada' });
            }
            const participantes = result;
            const ids = participantes.map(p => p.idP);
            if (ids.length === 0) {
                return res.json({ success: true, data: [] });
            }
            // Query para contar por género
            const pool = this.model.constructor.pool || this.model.pool;
            const conteo = await pool.query(
                `SELECT 
                    CASE id_genero
                        WHEN 6 THEN 'Masculino'
                        WHEN 7 THEN 'Femenino'
                        ELSE 'Otro'
                    END AS genero,
                    COUNT(*) AS cantidad
                FROM personas
                WHERE id_persona = ANY($1)
                GROUP BY id_genero
                ORDER BY genero;`,
                [ids]
            );
            res.json({ success: true, data: conteo.rows });
        } catch (error) {
            this.manejarError(error, res);
        }
    }

    /**
     * Recibe un array de participantes por body y devuelve el conteo de género
     */
    async getConteoGeneroDesdeParticipantes(req, res) {
        try {
            const { participantes } = req.body;
            if (!Array.isArray(participantes)) {
                return res.status(400).json({ success: false, message: 'El campo participantes debe ser un array' });
            }
            const data = await this.model.getConteoGeneroDesdeParticipantes(participantes);
            res.json({ success: true, data });
        } catch (error) {
            this.manejarError(error, res);
        }
    }

    async getParticipantesPorCohorte(req, res) {
        try {
            const { cohorteId } = req.params;
            if (!cohorteId) {
                return res.status(400).json({ success: false, message: 'Falta el id de la cohorte' });
            }
            const participantes = await this.model.getParticipantesPorCohorte(Number(cohorteId));
            res.json({
                success: true,
                cantidad: participantes.length,
                data: participantes
            });
        } catch (error) {
            this.manejarError(error, res);
        }
    }

    async getCohortesConCurso(req, res) {
        try {
            console.log('[BACKEND] Llamada a getCohortesConCurso');
            const cohortes = await this.model.getCohortesConCurso();
            console.log('[BACKEND] Cohortes encontradas:', cohortes);
            res.json({ success: true, data: cohortes });
        } catch (error) {
            console.error('[BACKEND] Error en getCohortesConCurso:', error);
            this.manejarError(error, res);
        }
    }

    // Obtener cursos por facilitador
    async getCursosByFacilitador(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ success: false, message: 'Falta el id del facilitador' });
            }
            const cursos = await this.model.getCursosByFacilitador(Number(id));
            return res.json({ success: true, data: cursos });
        } catch (error) {
            return this.manejarError(error, res);
        }
    }

    // Actualizar asistencia de un participante a un horario
    async updateAsistenciaParticipante(req, res) {
        try {
            const { cohorteId, idParticipante } = req.params;
            const { idHorario, presente } = req.body;
            if (!idHorario) return res.status(400).json({ success: false, message: 'Falta idHorario' });
            const participantes = await this.model.updateAsistenciaParticipante(cohorteId, idParticipante, idHorario, presente);
            return res.json({ success: true, data: participantes });
        } catch (error) {
            return this.manejarError(error, res);
        }
    }

    // Obtener horarios de un curso/cohorte
    async getHorariosByCohorte(req, res) {
        try {
            const { cohorteId } = req.params;
            const horarios = await this.model.getHorariosByCohorte(cohorteId);
            return res.json({ success: true, data: horarios });
        } catch (error) {
            return this.manejarError(error, res);
        }
    }

    // Método para manejar errores
    manejarError(error, res) {
        // Log detallado del error
        const endpoint = res.req.originalUrl;
        const method = res.req.method;
        const params = JSON.stringify(res.req.params);
        const query = JSON.stringify(res.req.query);
        const body = JSON.stringify(res.req.body);
        console.error('[BACKEND][ERROR]');
        console.error('  Endpoint:', endpoint);
        console.error('  Método:', method);
        console.error('  Params:', params);
        console.error('  Query:', query);
        console.error('  Body:', body);
        console.error('  Mensaje:', error.message || error);
        if (error.stack) console.error('  Stack:', error.stack);
        
        // Detectar errores específicos de la base de datos
        if (error.message && error.message.includes('PGT: Ya existe un código de cohorte')) {
            return res.status(409).json({
                success: false,
                message: "Ya existe una cohorte con este código para el mismo curso. Por favor, use un código diferente."
            });
        }
        
        // Detectar otros errores de restricción única
        if (error.code === '23505') {
            return res.status(409).json({
                success: false,
                message: "Ya existe un registro con estos datos. Por favor, verifique la información."
            });
        }
        
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