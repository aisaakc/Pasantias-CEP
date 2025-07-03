import pool from "../db.js";
import { CLASSIFICATION_IDS } from "../../client/src/config/classificationIds.js";

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
}

export default new CursoModel();