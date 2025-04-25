// models/clasificacion.js
import pool from "../db.js";

class Clasificacion {
    
    async getParentClassifications() {
        try {
            const query = `
                SELECT id_clasificacion AS id, nombre
                FROM clasificacion
                WHERE type_id IS NULL
                ORDER BY nombre
            `;
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error("Error en getParentClassifications (pg):", error.message);
            throw new Error("Error interno del servidor al obtener clasificaciones principales.");
        }
    }

    async create(nuevaClasificacion) {
        const { nombre, descripcion, icono, imagen, orden, type_id, parent_id, id_icono } = nuevaClasificacion;
        try {
            const query = `
                INSERT INTO clasificacion (nombre, descripcion, icono, imagen, orden, type_id, parent_id, id_icono)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING id_clasificacion AS id, nombre, descripcion, icono, imagen, orden, type_id, parent_id, id_icono;
            `;
            const values = [nombre, descripcion, icono, imagen, orden, type_id, parent_id, id_icono];
            const result = await pool.query(query, values);
            return result.rows[0]; // Retorna la nueva clasificación creada con su ID
        } catch (error) {
            console.error("Error en ClasificacionModel.create:", error.message);
            // Puedes añadir lógica para manejar errores específicos, como violaciones de unicidad
            if (error.code === '23505') { // Código de error para violación de restricción unique
                 throw new Error("Ya existe una clasificación con este nombre.");
            }
            throw new Error("Error interno del servidor al crear la clasificación.");
        }
    }

    async getAllDescendants(parentId) {
        try {
            const query = `
                WITH RECURSIVE subclasificaciones AS (
                    -- Clasificación principal (padre)
                    SELECT id_clasificacion, nombre, descripcion, icono, imagen, orden, type_id, parent_id, id_icono
                    FROM clasificacion
                    WHERE id_clasificacion = $1  -- Usamos el parentId como el criterio de búsqueda
                    UNION ALL
                    -- Subclasificaciones (hijos), buscando por type_id
                    SELECT c.id_clasificacion, c.nombre, c.descripcion, c.icono, c.imagen, c.orden, c.type_id, c.parent_id, c.id_icono
                    FROM clasificacion c
                    INNER JOIN subclasificaciones sc ON c.type_id = sc.id_clasificacion
                )
                SELECT id_clasificacion AS id, nombre, descripcion, icono, imagen, orden, type_id, parent_id, id_icono
                FROM subclasificaciones
                WHERE id_clasificacion != $1  -- Excluimos la clasificación principal (padre) de los resultados
                ORDER BY orden, nombre;
            `;
            
            const result = await pool.query(query, [parentId]);  // Pasamos el parentId como parámetro
            return result.rows;
        } catch (error) {
            console.error("Error en getAllDescendants (pg):", error.message);
            throw new Error("Error interno del servidor al obtener subclasificaciones.");
        }
    }
    
    
    
}

export default new Clasificacion();
