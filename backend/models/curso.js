import pool from "../db.js";
import { CLASSIFICATION_IDS } from "../../client/src/config/classificationIds.js";
import EmailService from '../services/emailService.js';
import UserModel from './persona.js';

class CursoModel {
    
   async getAllCursos(name){
    const query = `
        SELECT id_clasificacion
        FROM clasificacion
        WHERE nombre = $1
        LIMIT 1;
    `;
    try {
        const result = await pool.query(query, [name]);
        if (result.rows.length === 0) {
            
        throw new Error(`el curso "${name}" no encontrado.`);

        }
        return result.rows[0].id_clasificacion;
    } catch (error) {
        console.error(`Error al obtener ID para tipo "${name}":`, error.message);
        throw new Error("Error interno del servidor al obtener los cursos.");
    }

   }

   async getAllCursosById(id) {
       try {
      const query = `
        SELECT id_clasificacion AS id, nombre, descripcion ,adicional
        FROM clasificacion
        WHERE type_id = $1;
      `;
      const result = await pool.query(query, [id]);
      return result.rows;
    } catch (error) {
      console.error("Error en getAllCursosById:", error.message);
    
      throw error;
    }
  }

  async getAllCursosCompletos() {
        const query = `
          SELECT 
            c.*, 
            cl.nombre  AS nombre_curso,
            cl.id_icono,
            cl_icono.nombre AS nombre_icono,
            CONCAT(p.nombre, ' ', p.apellido) AS nombre_completo_facilitador,
            cm.nombre  AS modalidad,
            cs.nombre  AS estado,
            parent.nombre AS nombre_parent
          FROM cursos c
          LEFT JOIN clasificacion cl  ON c.id_nombre      = cl.id_clasificacion
          LEFT JOIN clasificacion cl_icono ON cl.id_icono = cl_icono.id_clasificacion
          LEFT JOIN personas p        ON c.id_facilitador = p.id_persona
          LEFT JOIN clasificacion cm  ON c.id_modalidad   = cm.id_clasificacion
          LEFT JOIN clasificacion cs  ON c.id_status      = cs.id_clasificacion
          LEFT JOIN clasificacion parent ON cl.parent_id = parent.id_clasificacion
          ORDER BY parent.nombre, cl.nombre;
        `;

        try {
            const result = await pool.query(query);
            // console.log('Resultado de getAllCursosCompletos:', JSON.stringify(result.rows, null, 2));
            return result.rows;
        } catch (error) {
            console.error("Error en getAllCursosCompletos:", error.message);
            throw new Error("Error interno del servidor al obtener los cursos completos.");
        }
    }

  async createCurso(cursoData) {
    const {
      id_nombre,
      id_modalidad,
      id_status,
      id_facilitador,
      fecha_hora_inicio,
      fecha_hora_fin,
      costo,
      descripcion_corto,
      descripcion_html,
      codigo,
      color,
      duracion,
      codigo_cohorte
    } = cursoData;

    console.log('Datos recibidos en modelo createCurso:', cursoData);

    const query = `
      INSERT INTO cursos (
        id_nombre,
        id_modalidad,
        id_status,
        id_facilitador,
        fecha_hora_inicio,
        fecha_hora_fin,
        costo,
        descripcion_corto,
        descripcion_html,
        codigo,
        color,
        duracion,
        codigo_cohorte
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *;
    `;

    try {
      const values = [
        id_nombre,
        id_modalidad,
        id_status,
        id_facilitador ? BigInt(id_facilitador) : null,
        fecha_hora_inicio,
        fecha_hora_fin,
        costo,
        descripcion_corto,
        descripcion_html || null,
        codigo,
        color,
        duracion,
        codigo_cohorte || null
      ];

      console.log('Query:', query);
      console.log('Values:', values);

      const result = await pool.query(query, values);
      console.log('Resultado de la inserción:', result.rows[0]);
      return result.rows[0];
    } catch (error) {
      console.error("Error en createCurso:", error.message);
      throw new Error("Error interno del servidor al crear el curso.");
    }
  }

  async updateCurso(id, cursoData) {
    const {
      id_nombre,
      id_modalidad,
      id_status,
      id_facilitador,
      fecha_hora_inicio,
      fecha_hora_fin,
      costo,
      descripcion_corto,
      descripcion_html,
      codigo,
      color,
      duracion,
      horarios,
      codigo_cohorte,
      participante,
      documentos
    } = cursoData;

    console.log('Datos recibidos en modelo updateCurso:', cursoData);

    // Obtener los participantes actuales
    let participantes = [];
    try {
      const getQuery = 'SELECT partipantes FROM cursos WHERE id_curso = $1';
      const getResult = await pool.query(getQuery, [id]);
      participantes = getResult.rows[0]?.partipantes || [];
      if (!Array.isArray(participantes)) participantes = [];
    } catch (e) {
      console.warn('No se pudo obtener participantes previos:', e.message);
      participantes = [];
    }

    // Agregar el nuevo participante si viene en el payload
    if (participante) {
      participantes.push(participante);
    }

    // Obtener documentos actuales si no viene en el payload
    let documentosFinal = documentos;
    if (typeof documentosFinal === 'undefined') {
      try {
        const getDocQuery = 'SELECT documentos FROM cursos WHERE id_curso = $1';
        const getDocResult = await pool.query(getDocQuery, [id]);
        documentosFinal = getDocResult.rows[0]?.documentos || [];
      } catch {
        documentosFinal = [];
      }
    }
    if (typeof documentosFinal === 'string') {
      try { documentosFinal = JSON.parse(documentosFinal); } catch { documentosFinal = []; }
    }
    if (!Array.isArray(documentosFinal)) documentosFinal = [];

    const query = `
      UPDATE cursos 
      SET 
        id_nombre = $1,
        id_modalidad = $2,
        id_status = $3,
        id_facilitador = $4,
        fecha_hora_inicio = $5,
        fecha_hora_fin = $6,
        costo = $7,
        descripcion_corto = $8,
        descripcion_html = $9,
        codigo = $10,
        color = $11,
        duracion = $12,
        horarios = $13,
        codigo_cohorte = $14,
        partipantes = $15,
        documentos = $16
      WHERE id_curso = $17
      RETURNING *;
    `;

    try {
      const values = [
        id_nombre,
        id_modalidad,
        id_status,
        id_facilitador ? BigInt(id_facilitador) : null,
        fecha_hora_inicio,
        fecha_hora_fin,
        costo,
        descripcion_corto,
        descripcion_html || null,
        codigo,
        color,
        duracion,
        horarios ? JSON.stringify(horarios) : null,
        codigo_cohorte || null,
        JSON.stringify(participantes),
        JSON.stringify(documentosFinal),
        id
      ];

      console.log('Query:', query);
      console.log('Values:', values);

      const result = await pool.query(query, values);
      if (result.rows.length === 0) {
        throw new Error("Curso no encontrado");
      }
      console.log('Resultado de la actualización:', result.rows[0]);
      return result.rows[0];
    } catch (error) {
      console.error("Error en updateCurso:", error.message);
      throw new Error("Error interno del servidor al actualizar el curso.");
    }
  }

  async updateHorariosCurso(id, horarios) {
    const query = `
      UPDATE cursos 
      SET horarios = $1
      WHERE id_curso = $2
      RETURNING *;
    `;

    try {
      const values = [
        JSON.stringify(horarios),
        id
      ];

      const result = await pool.query(query, values);
      if (result.rows.length === 0) {
        throw new Error("Curso no encontrado");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error en updateHorariosCurso:", error.message);
      throw new Error("Error interno del servidor al actualizar los horarios del curso.");
    }
  }

  async getFacilitadores() {
    const query = `
      SELECT DISTINCT
        p.id_persona,
        p.nombre,
        p.apellido,
        p.telefono,
        p.cedula,
        p.gmail,
        p.id_status
      FROM personas p
      CROSS JOIN LATERAL json_array_elements_text(p.id_rol) as roles
      WHERE roles = $1
      ORDER BY p.nombre, p.apellido;
    `;

    try {
      const result = await pool.query(query, [CLASSIFICATION_IDS.ROLES_FACILITADORES.toString()]);
        // console.log('Facilitadores obtenidos:', result.rows);
      return result.rows;
    } catch (error) {
      console.error("Error en getFacilitadores:", error.message);
      throw new Error("Error interno del servidor al obtener los facilitadores.");
    }
  }

  // Asociar un documento a un curso (agregar el ID al array documentos)
  async addDocumentoToCurso(id_curso, id_documento) {
    try {
      // Obtener el array actual de documentos
      const getQuery = 'SELECT documentos FROM cursos WHERE id_curso = $1';
      const getResult = await pool.query(getQuery, [id_curso]);
      let documentos = getResult.rows[0]?.documentos || [];
      console.log('[asociar-doc] Documentos previos:', documentos);
      if (typeof documentos === 'string') {
        try { documentos = JSON.parse(documentos); } catch { documentos = []; }
      }
      if (!Array.isArray(documentos)) documentos = [];
      // Evitar duplicados
      if (!documentos.includes(Number(id_documento))) {
        documentos.push(Number(id_documento));
      }
      console.log('[asociar-doc] Documentos a guardar:', documentos);
      const updateQuery = 'UPDATE cursos SET documentos = $1 WHERE id_curso = $2 RETURNING *';
      const updateResult = await pool.query(updateQuery, [JSON.stringify(documentos), id_curso]);
      console.log('[asociar-doc] Resultado del UPDATE:', updateResult.rows[0]);
      return updateResult.rows[0];
    } catch (error) {
      throw new Error(`Error al asociar documento al curso: ${error.message}`);
    }
  }

  async removeDocumentoFromAllCursos(id_documento) {
    try {
      const getQuery = 'SELECT id_curso, documentos FROM cursos';
      const result = await pool.query(getQuery);
      for (const row of result.rows) {
        let documentos = row.documentos || [];
        if (typeof documentos === 'string') {
          try { documentos = JSON.parse(documentos); } catch { documentos = []; }
        }
        if (!Array.isArray(documentos)) documentos = [];
        const nuevosDocumentos = documentos.filter(docId => docId !== Number(id_documento));
        if (nuevosDocumentos.length !== documentos.length) {
          await pool.query('UPDATE cursos SET documentos = $1 WHERE id_curso = $2', [JSON.stringify(nuevosDocumentos), row.id_curso]);
        }
      }
    } catch (error) {
      throw new Error('Error al eliminar documento de cursos: ' + error.message);
    }
  }

  async validateCohorteCode(codigo_cohorte, id_nombre) {
    try {
      const query = `
        SELECT COUNT(*) as count
        FROM cursos
        WHERE codigo_cohorte = $1 AND id_nombre = $2
      `;
      
      const result = await pool.query(query, [codigo_cohorte, id_nombre]);
      return result.rows[0].count > 0;
    } catch (error) {
      console.error("Error en validateCohorteCode:", error.message);
      throw new Error("Error interno del servidor al validar el código de cohorte.");
    }
  }

  // Obtener curso por id (con nombre_curso)
  async getCursoById(id_curso) {
    const query = `
      SELECT c.*, cl.nombre AS nombre_curso
      FROM cursos c
      LEFT JOIN clasificacion cl ON c.id_nombre = cl.id_clasificacion
      WHERE c.id_curso = $1
    `;
    try {
      const result = await pool.query(query, [id_curso]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error en getCursoById:', error.message);
      throw new Error('Error al obtener datos del curso');
    }
  }

  // Agregar participante a cohorte (actualiza el campo JSON participantes)
  async addParticipanteToCohorte(cohorteId, participante) {
    try {
      // Obtener los participantes actuales
      const selectQuery = 'SELECT participantes FROM cursos WHERE id_curso = $1';
      const selectResult = await pool.query(selectQuery, [cohorteId]);
      let participantes = selectResult.rows[0]?.participantes || [];
      console.log('[DEBUG BACKEND] Participantes previos:', participantes);
      if (typeof participantes === 'string') {
        participantes = JSON.parse(participantes);
      }
      if (!Array.isArray(participantes)) participantes = [];
      // Si ya existe un participante con el mismo idP, actualiza su monto
      const idx = participantes.findIndex(p => String(p.idP) === String(participante.idP));
      if (idx !== -1) {
        participantes[idx].monto = participante.monto;
      } else {
        participantes.push(participante);
      }
      console.log('[DEBUG BACKEND] Participantes a guardar:', participantes);
      // Actualizar el campo en la BD
      const updateQuery = 'UPDATE cursos SET participantes = $1 WHERE id_curso = $2 RETURNING participantes';
      const updateResult = await pool.query(updateQuery, [JSON.stringify(participantes), cohorteId]);

      // --- Enviar correo de bienvenida al curso ---
      try {
        // 1. Obtener datos del participante
        const persona = await UserModel.getPersonaById(participante.idP);
        // 2. Obtener datos del curso (nombre_curso)
        const curso = await this.getCursoById(cohorteId);
        const nombreCurso = curso?.nombre_curso || 'Curso';
        if (persona && persona.gmail) {
          await EmailService.sendWelcomeToCourseEmail(persona.gmail, persona.nombre, persona.apellido, nombreCurso);
        }
      } catch (emailError) {
        console.error('[BACKEND] Error al enviar correo de bienvenida al curso:', emailError.message);
      }
      // --- Fin correo ---

      return { participantes: updateResult.rows[0].participantes };
    } catch (error) {
      console.error('Error en addParticipanteToCohorte:', error.message);
      throw new Error('Error al agregar participante a la cohorte');
    }
  }

  async getCohortesConParticipantes() {
    // 1. Obtener todas las cohortes (todas con participantes)
    const cohortesQuery = `
      SELECT c.id_curso, c.participantes, c.id_nombre, cl.nombre AS nombre_cohorte, cl.parent_id
      FROM cursos c
      JOIN clasificacion cl ON c.id_nombre = cl.id_clasificacion
      WHERE c.participantes IS NOT NULL AND c.participantes::text != '[]'
    `;
    const cohortesRes = await pool.query(cohortesQuery);

    const resultado = [];
    for (const cohorte of cohortesRes.rows) {
      let participantes = [];
      try { participantes = JSON.parse(cohorte.participantes); } catch { participantes = []; }
      const ids = participantes.map(p => p.idP);
      if (ids.length === 0) continue;

      // 2. Consultar nombre y género de los participantes
      const personasRes = await pool.query(
        `SELECT id_persona, nombre, apellido, id_genero FROM personas WHERE id_persona = ANY($1)`, [ids]
      );
      // 3. Consultar el nombre del curso padre inmediato
      const cursoPadreRes = await pool.query(
        `SELECT nombre FROM clasificacion WHERE id_clasificacion = $1`, [cohorte.parent_id]
      );
      const nombre_curso = cursoPadreRes.rows[0]?.nombre || null;

      resultado.push({
        cohorte: cohorte.nombre_cohorte,
        curso: nombre_curso,
        participantes: personasRes.rows.map(p => ({
          id: p.id_persona,
          nombre: p.nombre,
          apellido: p.apellido,
          genero: p.id_genero // 6 = Masculino, 7 = Femenino
        }))
      });
    }
    return resultado;
  }

  async getParticipantesPorCohorte(id_curso) {
    const query = `
      SELECT 
        (p->>'idP')::int AS idp,
        personas.nombre,
        personas.apellido,
        personas.cedula,
        personas.gmail,
        personas.id_genero AS id_genero
      FROM cursos
      JOIN LATERAL jsonb_array_elements(cursos.participantes::jsonb) AS p ON TRUE
      JOIN personas ON personas.id_persona = (p->>'idP')::int
      WHERE cursos.id_curso = $1;
    `;
    try {
      const result = await pool.query(query, [id_curso]);
      console.log('[BACKEND] Participantes SQL:', result.rows);
      return result.rows;
    } catch (error) {
      throw new Error('Error al obtener participantes de la cohorte: ' + error.message);
    }
  }

  async getCohortesConCurso() {
    const query = `
      SELECT 
        c.id_curso,
        c.codigo_cohorte,
        cl_curso.nombre AS nombre_curso,
        cl_cohorte.nombre AS nombre_cohorte
      FROM cursos c
      JOIN clasificacion cl_cohorte ON c.id_nombre = cl_cohorte.id_clasificacion
      JOIN clasificacion cl_curso ON cl_cohorte.parent_id = cl_curso.id_clasificacion
      ORDER BY cl_curso.nombre, cl_cohorte.nombre;
    `;
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error('Error al obtener cohortes con curso: ' + error.message);
    }
  }

  // Obtener cursos por facilitador
  async getCursosByFacilitador(id_facilitador) {
    const query = `
      SELECT 
        c.*, 
        cl.nombre AS nombre_curso,
        cl_icono.nombre AS nombre_icono,
        cm.nombre AS modalidad,
        cs.nombre AS estado,
        parent.nombre AS nombre_parent
      FROM cursos c
      LEFT JOIN clasificacion cl ON c.id_nombre = cl.id_clasificacion
      LEFT JOIN clasificacion cl_icono ON cl.id_icono = cl_icono.id_clasificacion
      LEFT JOIN clasificacion cm ON c.id_modalidad = cm.id_clasificacion
      LEFT JOIN clasificacion cs ON c.id_status = cs.id_clasificacion
      LEFT JOIN clasificacion parent ON cl.parent_id = parent.id_clasificacion
      WHERE c.id_facilitador = $1
      ORDER BY c.fecha_hora_inicio DESC, cl.nombre;
    `;
    try {
      const result = await pool.query(query, [id_facilitador]);
      return result.rows;
    } catch (error) {
      console.error('Error en getCursosByFacilitador:', error.message);
      throw new Error('Error al obtener cursos del facilitador');
    }
  }

  // Actualizar asistencia de un participante a un horario
  async updateAsistenciaParticipante(id_curso, id_participante, id_horario, presente) {
    // 1. Obtener participantes actuales
    const selectQuery = 'SELECT participantes FROM cursos WHERE id_curso = $1';
    const selectResult = await pool.query(selectQuery, [id_curso]);
    let participantes = selectResult.rows[0]?.participantes || [];
    if (typeof participantes === 'string') participantes = JSON.parse(participantes);
    if (!Array.isArray(participantes)) participantes = [];
    // 2. Buscar participante
    const idx = participantes.findIndex(p => String(p.idP) === String(id_participante));
    if (idx === -1) throw new Error('Participante no encontrado');
    // 3. Actualizar asistencia
    if (!participantes[idx].asistencias) participantes[idx].asistencias = {};
    participantes[idx].asistencias[id_horario] = !!presente;
    // 4. Guardar en BD
    const updateQuery = 'UPDATE cursos SET participantes = $1 WHERE id_curso = $2 RETURNING participantes';
    const updateResult = await pool.query(updateQuery, [JSON.stringify(participantes), id_curso]);
    return updateResult.rows[0].participantes;
  }

  // Obtener horarios de un curso/cohorte
  async getHorariosByCohorte(id_curso) {
    const query = 'SELECT horarios FROM cursos WHERE id_curso = $1';
    const result = await pool.query(query, [id_curso]);
    let horarios = result.rows[0]?.horarios || [];
    if (typeof horarios === 'string') horarios = JSON.parse(horarios);
    if (!Array.isArray(horarios)) horarios = [];
    return horarios;
  }

}

export default new CursoModel();