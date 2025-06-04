import pool from "../db.js";


class UsuarioModel {
   
    async getRoles() {
        // Query to get all roles by joining with the parent classification
        const query = `
          SELECT 
            c_roles.id_clasificacion as id,
            c_roles.nombre,
            c_roles.id_icono,
            c_roles.descripcion,
            i.nombre as nombre_icono
          FROM clasificacion as c_roles
          INNER JOIN clasificacion as c_tipos ON c_roles.type_id = c_tipos.id_clasificacion
          LEFT JOIN clasificacion as i ON c_roles.id_icono = i.id_clasificacion
          WHERE c_tipos.id_clasificacion = 3
          ORDER BY c_roles.id_clasificacion;
        `;    
        try {
          const result = await pool.query(query);
          return result.rows;
        } catch (error) {
          console.error("Error en getRoles:", error.message);
          throw error;
        }
      }
    
      async getUsuarios() {
        try {
          const query = `
             SELECT
         p.id_persona,
         p.nombre AS persona_nombre,
         p.apellido,
         p.telefono,
         p.cedula,
         p.gmail,
         p.id_genero,
         g.nombre as genero_nombre,
         g.descripcion as genero_desc,
         c.id_clasificacion id_rol,
         c.nombre rol_nombre,
         c.descripcion rol_desc
        FROM personas p
        CROSS JOIN LATERAL json_array_elements_text(p.id_rol->'id_rol') AS role_id_text
        INNER JOIN clasificacion c ON c.id_clasificacion = role_id_text::integer
        LEFT JOIN clasificacion g ON p.id_genero = g.id_clasificacion
          `;
          const result = await pool.query(query);
          return result.rows;
        } catch (error) {
          console.error("Error en getUsuarios:", error.message);
          throw error;
        }
      }

}

export default new UsuarioModel();