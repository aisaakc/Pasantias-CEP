import pool from "../db.js";
class Clasificacion {
    
    async getParentClassifications() {
        try {
            const query = `
                SELECT c.*, i.nombre AS nicono
                FROM clasificacion c
                LEFT JOIN clasificacion i ON c.id_icono = i.id_clasificacion
                WHERE c.type_id IS NULL 
                ORDER BY c.orden, c.nombre;
            `;
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error("Error en getParentClassifications (pg):", error.message);
            throw new Error("Error interno del servidor al obtener clasificaciones principales.");
        }
    }

    async create(nuevaClasificacion) {
        const { nombre, descripcion, imagen, orden, type_id, parent_id, id_icono, adicional } = nuevaClasificacion;
        try {
            const query = `
                INSERT INTO clasificacion (nombre, descripcion, imagen, orden, type_id, parent_id, id_icono, adicional)
                VALUES (TRIM($1), TRIM($2), $3, $4, $5, $6, $7, $8)
                RETURNING id_clasificacion AS id, nombre, descripcion, imagen, orden, type_id, parent_id, id_icono, adicional;
            `;
            const values = [nombre, descripcion, imagen, orden, type_id, parent_id, id_icono, adicional || null];  
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error("Error en ClasificacionModel.create:", error.message);
            if (error.code === '23505') { 
                throw new Error("Ya existe una clasificación con este nombre.");
            }
            throw new Error("Error interno del servidor al crear la clasificación.");
        }
    }
    
    async getAllSubclasificaciones(type_id, parent_id) {
        try {          
            let query = `
           SELECT sc.*, i.nombre AS nicono, 
                  sc.parent_id as parentID, 
                  c.nombre AS parent_nombre, 
                  c2.nombre as parent_icono,
                  t.nombre AS type_nombre,
                  ti.nombre AS type_icono
           FROM clasificacion sc            
           LEFT JOIN clasificacion c ON sc.type_id = c.id_clasificacion
           LEFT JOIN clasificacion c2 ON c.id_icono = c2.id_clasificacion                  
           LEFT JOIN clasificacion i ON sc.id_icono = i.id_clasificacion
           LEFT JOIN clasificacion t ON sc.type_id = t.id_clasificacion
             LEFT JOIN clasificacion ti ON t.id_icono = ti.id_clasificacion
           WHERE `;
            let queryParams = [type_id];

            if (parent_id) {
                query += ` sc.parent_id = $1 `;
                queryParams = [parent_id];
            } else {
                query += ` sc.type_id = $1 `;
            }
          
            query += ` ORDER BY sc.orden, sc.nombre;`;
            const result = await pool.query(query, queryParams);
            return result.rows;
        } catch (error) {
            console.error("Error en getAllSubclasificaciones:", error.message);
            throw new Error("Error interno del servidor al obtener subclasificaciones.");
        }
    } 

    async getAllClasificaciones() {
        try {
          const query = `
         SELECT c_iconos.* 
         FROM public.clasificacion AS c_iconos
         INNER JOIN public.clasificacion AS c_tipos ON c_iconos.type_id = c_tipos.id_clasificacion
         WHERE c_tipos.nombre = 'Íconos';
          `;
          const result = await pool.query(query);
          return result.rows;
        } catch (error) {
          console.error("Error en getAllClasificaciones (pg):", error.message);
          throw new Error("Error interno del servidor al obtener todas las clasificaciones.");
        }
    }
  
    async updateClasificacion(id, clasificacionActualizada) {
        const { nombre, descripcion, imagen, orden, type_id, parent_id, id_icono, adicional } = clasificacionActualizada;
        try {
            const query = `
                UPDATE clasificacion 
                SET nombre = $1, 
                    descripcion = $2, 
                    imagen = $3, 
                    orden = $4, 
                    type_id = $5, 
                    parent_id = $6, 
                    id_icono = $7,
                    adicional = $8
                WHERE id_clasificacion = $9
                RETURNING id_clasificacion AS id, nombre, descripcion, imagen, orden, type_id, parent_id, id_icono, adicional;
            `;
            const values = [
                nombre, 
                descripcion, 
                imagen, 
                orden, 
                type_id || null, 
                parent_id || null, 
                id_icono || null,
                adicional || null,
                id
            ];
            
            const result = await pool.query(query, values);
            
            if (result.rows.length === 0) {
                throw new Error("Clasificación no encontrada.");
            }
            
            return result.rows[0];
        } catch (error) {
            console.error("Error en ClasificacionModel.update:", error.message);
            if (error.code === '23505') {
                throw new Error("Ya existe una clasificación con este nombre.");
            }
            throw new Error("Error interno del servidor al actualizar la clasificación.");
        }
    }

    async delete(id){
        try {
            // Primero verificamos si la clasificación existe y si está protegida
            const checkQuery = `
                SELECT protected, type_id, parent_id 
                FROM clasificacion 
                WHERE id_clasificacion = $1;
            `;
            const checkResult = await pool.query(checkQuery, [id]);
            
            if (checkResult.rows.length === 0) {
                const notFoundError = new Error("No se encontró la clasificación especificada");
                notFoundError.name = "NotFoundError";
                throw notFoundError;
            }

            const clasificacion = checkResult.rows[0];
            
            // Si es una clasificación protegida, no permitimos eliminarla
            if (clasificacion.protected === 1) {
                const protectedError = new Error("No se puede eliminar esta clasificación porque está protegida");
                protectedError.name = "ProtectedError";
                throw protectedError;
            }

            // Si es una clasificación padre (type_id es NULL), verificamos si tiene subclasificaciones
            if (!clasificacion.type_id) {
                const subclasificacionesQuery = `
                    SELECT COUNT(*) 
                    FROM clasificacion 
                    WHERE parent_id = $1;
                `;
                const subclasificacionesResult = await pool.query(subclasificacionesQuery, [id]);
                const tieneSubclasificaciones = parseInt(subclasificacionesResult.rows[0].count) > 0;

                if (tieneSubclasificaciones) {
                    const subclasificacionesError = new Error("No se puede eliminar esta clasificación porque tiene subclasificaciones asociadas");
                    subclasificacionesError.name = "SubclasificacionesError";
                    throw subclasificacionesError;
                }
            }

            // Procedemos con la eliminación
            const deleteQuery = `
                DELETE FROM clasificacion 
                WHERE id_clasificacion = $1
                RETURNING id_clasificacion AS id;
            `;
            const result = await pool.query(deleteQuery, [id]);

            return { 
                mensaje: "Clasificación eliminada correctamente",
                id: result.rows[0].id
            };
        } catch (error) {
            console.error("Error en clasificacionModel.delete:", error.message);
        
            if (error.name === "NotFoundError") {
                throw error;
            }
            if (error.name === "ProtectedError") {
                throw error;
            }
            if (error.name === "SubclasificacionesError") {
                throw error;
            }
            if (error.code === '23503') {
                const constraintError = new Error("No se puede eliminar esta clasificación porque está utilizada por otros registros en el sistema");
                constraintError.name = "ConstraintError";
                throw constraintError;
            }
        
            throw new Error("Error interno del servidor al eliminar la clasificación");
        }
    }

    async getParentHierarchy(id_clasificacion) {
        try {
            console.log('Iniciando getParentHierarchy con ID:', id_clasificacion);
            
            // Primero probamos la función obtener_parents directamente
            const testQuery = 'SELECT * FROM obtener_parents($1)';
            console.log('Ejecutando consulta de prueba:', testQuery);
            const testResult = await pool.query(testQuery, [id_clasificacion]);
            console.log('Resultado de prueba:', testResult.rows);

            // Ahora la consulta completa
            const query = `
                SELECT 
                    c.id_clasificacion,
                    c.nombre,
                    c.descripcion,
                    c.type_id,
                    c.id_icono,
                    i.nombre as icono,
                    t.nombre as type_nombre,
                    ti.nombre as type_icono
                FROM obtener_parents($1) c
                LEFT JOIN clasificacion i ON c.id_icono = i.id_clasificacion
                LEFT JOIN clasificacion t ON c.type_id = t.id_clasificacion
                LEFT JOIN clasificacion ti ON t.id_icono = ti.id_clasificacion
            `;
            console.log('Ejecutando consulta completa:', query);
            const result = await pool.query(query, [id_clasificacion]);
            console.log('Resultado completo:', result.rows);
            
            return result.rows;
        } catch (error) {
            console.error("Error detallado en getParentHierarchy:", {
                message: error.message,
                code: error.code,
                detail: error.detail,
                hint: error.hint,
                stack: error.stack
            });
            throw new Error(`Error interno del servidor al obtener jerarquía de padres: ${error.message}`);
        }
    }

    
}

export default new Clasificacion();