import pool from "../db.js";
class Clasificacion {
    
    async getParentClassifications() {
        try {
            const query = `
                SELECT c.*, i.nombre AS nicono
                FROM clasificacion c
                LEFT JOIN clasificacion i ON c.id_icono = i.id_clasificacion
                WHERE c.type_id IS NULL AND c.parent_id IS NULL
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
                VALUES ($1, $2, $3, $4, $5, $6, $7)
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
    
    async getAllSubclasificaciones(type_id) {
        try {          
            const query = `
            SELECT sc.*, i.nombre AS nicono, c.nombre AS parent_nombre, c2.nombre as parent_icono
            FROM clasificacion sc
            LEFT JOIN clasificacion c ON sc.type_id = c.id_clasificacion
            LEFT JOIN clasificacion i ON sc.id_icono = i.id_clasificacion
            LEFT JOIN clasificacion c2 ON c.id_icono = c2.id_clasificacion
            WHERE sc.type_id = $1
            ORDER BY sc.orden, sc.nombre;
            `;
            
            const result = await pool.query(query, [type_id]);  
            return result.rows;
        } catch (error) {
            console.error("Error en getAllSubclasificaciones:", error.message);
            throw new Error("Error interno del servidor al obtener subclasificaciones.");
        }
    } 

    async getAllHijos(parent_id) {
        try {          
            const query = `
             SELECT * 
             FROM clasificacion c  
             INNER JOIN  clasificacion sc
             ON (sc.parent_id = c.id_clasificacion)
             WHERE c.id_clasificacion = $1
             ORDER BY sc.orden, sc.nombre;
        `;
            
            const result = await pool.query(query, [parent_id]);  // Pasamos el parentId como parámetro
            return result.rows;

        } catch (error) {
            console.error("Error en getAllDescendants (pg):", error.message);
            throw new Error("Error interno del servidor al obtener subclasificaciones.");
        }
    } 

    async getAllClasificaciones() {
        try {
          const query = `
         SELECT c_iconos.* 
         FROM public.clasificacion AS c_iconos
         INNER JOIN public.clasificacion AS c_tipos ON c_iconos.type_id = c_tipos.id_clasificacion
         WHERE c_tipos.nombre = 'Ícono';
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
            const query = `
                DELETE FROM clasificacion 
                WHERE id_clasificacion = $1
                RETURNING id_clasificacion AS id;
            `;
            const result = await pool.query(query, [id]);

            if (result.rows.length === 0){
                throw new Error("No se encontro la clasificacion especificada");
            }

            return { mensanje: "Clasificacion eliminada correctamente"};
        } catch (error) {
            console.error("Error en clasificacionModel.delete:" , error.message);
            if (error.code === '23503'){
                throw new Error("No se puede eliminar esta clasificacion porque esta utilizada por otros registros en el sistema");
            }
            throw new error("Error interno del servidor al intertar eliminar la clasificacion");

        }
    }
}

export default new Clasificacion();