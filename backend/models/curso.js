import pool from "../db.js";

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
        SELECT id_clasificacion AS id, nombre
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
            cfp.nombre AS forma_pago,
            cs.nombre  AS estado,
            parent.nombre AS nombre_parent
          FROM cursos c
          LEFT JOIN clasificacion cl  ON c.id_nombre      = cl.id_clasificacion
          LEFT JOIN clasificacion cl_icono ON cl.id_icono = cl_icono.id_clasificacion
          LEFT JOIN personas p        ON c.id_facilitador = p.id_persona
          LEFT JOIN clasificacion cm  ON c.id_modalidad   = cm.id_clasificacion
          LEFT JOIN clasificacion cfp ON c.id_forma_pago  = cfp.id_clasificacion
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
      fecha_hora_inicio,
      fecha_hora_fin,
      costo,
      descripcion_corto,
      codigo,
      color,
      duracion
    } = cursoData;

    const query = `
      INSERT INTO cursos (
        id_nombre,
        id_modalidad,
        id_status,
        fecha_hora_inicio,
        fecha_hora_fin,
        costo,
        descripcion_corto,
        codigo,
        color,
        duracion
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;

    try {
      const values = [
        id_nombre,
        id_modalidad,
        id_status,
        fecha_hora_inicio,
        fecha_hora_fin,
        costo,
        descripcion_corto,
        codigo,
        color,
        duracion
      ];

      const result = await pool.query(query, values);
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
      fecha_hora_inicio,
      fecha_hora_fin,
      costo,
      descripcion_corto,
      codigo,
      color,
      duracion
    } = cursoData;

    const query = `
      UPDATE cursos 
      SET 
        id_nombre = $1,
        id_modalidad = $2,
        id_status = $3,
        fecha_hora_inicio = $4,
        fecha_hora_fin = $5,
        costo = $6,
        descripcion_corto = $7,
        codigo = $8,
        color = $9,
        duracion = $10
      WHERE id_curso = $11
      RETURNING *;
    `;

    try {
      const values = [
        id_nombre,
        id_modalidad,
        id_status,
        fecha_hora_inicio,
        fecha_hora_fin,
        costo,
        descripcion_corto,
        codigo,
        color,
        duracion,
        id
      ];

      const result = await pool.query(query, values);
      if (result.rows.length === 0) {
        throw new Error("Curso no encontrado");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error en updateCurso:", error.message);
      throw new Error("Error interno del servidor al actualizar el curso.");
    }
  }
}

export default new CursoModel();