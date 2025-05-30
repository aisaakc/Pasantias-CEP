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
        const { nombre, descripcion, imagen, orden, type_id, parent_id, id_icono } = nuevaClasificacion;
        try {
            const query = `
                INSERT INTO clasificacion (nombre, descripcion, imagen, orden, type_id, parent_id, id_icono)
                VALUES (TRIM($1), TRIM($2), $3, $4, $5, $6, $7)
                RETURNING id_clasificacion AS id, nombre, descripcion, imagen, orden, type_id, parent_id, id_icono;
            `;
            const values = [nombre, descripcion, imagen, orden, type_id, parent_id, id_icono];  
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
           SELECT sc.*, i.nombre AS nicono , sc.parent_id as parentID, c.nombre AS parent_nombre, c2.nombre as parent_icono 
           FROM clasificacion sc            
           LEFT JOIN clasificacion c ON sc.type_id = c.id_clasificacion
           LEFT JOIN clasificacion c2 ON c.id_icono = c2.id_clasificacion                  
           LEFT JOIN clasificacion i ON sc.id_icono = i.id_clasificacion        
           WHERE `;
            let queryParams = [type_id];

            if (parent_id) {
                query += ` sc.parent_id = $1 `;
                // queryParams.push(parent_id);
                queryParams = [parent_id];
              } else {
                query += ` sc.type_id = $1 `; // AND sc.parent_id IS NULL `;
              }
          
              query += ` ORDER BY sc.orden, sc.nombre;`;
                // console.log(query);
            const result = await pool.query(query, queryParams );
            // console.log('Resultado de la consulta:...', result.rows); 

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
        const { nombre, descripcion, imagen, orden, type_id, parent_id, id_icono } = clasificacionActualizada;
        try {
            const query = `
                UPDATE clasificacion 
                SET nombre = $1, 
                    descripcion = $2, 
                    imagen = $3, 
                    orden = $4, 
                    type_id = $5, 
                    parent_id = $6, 
                    id_icono = $7
                WHERE id_clasificacion = $8
                RETURNING id_clasificacion AS id, nombre, descripcion, imagen, orden, type_id, parent_id, id_icono;
            `;
            const values = [
                nombre, 
                descripcion, 
                imagen, 
                orden, 
                type_id || null, 
                parent_id || null, 
                id_icono || null,
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
}

export default new Clasificacion();