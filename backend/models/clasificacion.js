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
            const values = [nombre, descripcion, imagen, orden, type_id, parent_id, id_icono];  // Cambié los valores para coincidir
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
            SELECT sc.*
            FROM clasificacion sc
            INNER JOIN clasificacion c ON sc.type_id = c.id_clasificacion
            WHERE c.id_clasificacion = $1
            ORDER BY sc.orden, sc.nombre;

        `;
            
            const result = await pool.query(query, [type_id]);  
            return result.rows;
        } catch (error) {
            console.error("Error en getAllDescendants (pg):", error.message);
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
            SELECT * 
            FROM public.clasificacion
            ORDER BY id_clasificacion ASC;
          `;
          const result = await pool.query(query);
          return result.rows;
        } catch (error) {
          console.error("Error en getAllClasificaciones (pg):", error.message);
          throw new Error("Error interno del servidor al obtener todas las clasificaciones.");
        }
      }
      
}

export default new Clasificacion();