import pool from "../db.js";

class CursoModel {
    
//    async getAllCursos(name){
//     const query = `
//         SELECT id_clasificacion
//         FROM clasificacion
//         WHERE nombre = $1;
//         LIMIT 1;
//     `;
//     try {
//         const result = await pool.query(query, [name]);
//         if (result.rows.length === 0) {
//             throw new Error(`el curso "${name}" no encontrado.`);
//         }
//         return result.rows[0].id_clasificacion;
//     } catch (error) {
//         console.error("Error en getAllCursos:", error.message);
//         throw new Error("Error interno del servidor al obtener los cursos.");
//     }
//    }
   
   async getAllCursosCompletos() {
        const query = `
          SELECT 
    c.*, 
    cl.nombre  AS nombre_curso,
    CONCAT(p.nombre, ' ', p.apellido) AS nombre_completo_facilitador,
    cm.nombre  AS modalidad,
    cfp.nombre AS forma_pago,
    cs.nombre  AS estado
FROM cursos c
LEFT JOIN clasificacion cl  ON c.id_nombre      = cl.id_clasificacion
LEFT JOIN personas p        ON c.id_facilitador = p.id_persona
LEFT JOIN clasificacion cm  ON c.id_modalidad   = cm.id_clasificacion
LEFT JOIN clasificacion cfp ON c.id_forma_pago  = cfp.id_clasificacion
LEFT JOIN clasificacion cs  ON c.id_status      = cs.id_clasificacion
ORDER BY c.fecha_hora_inicio DESC;

        `;

        try {
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error("Error en getAllCursosCompletos:", error.message);
            throw new Error("Error interno del servidor al obtener los cursos completos.");
        }
    }

   
}

export default new CursoModel();