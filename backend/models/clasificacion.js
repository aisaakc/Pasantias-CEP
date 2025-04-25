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

    // ✅ Corrección aquí: aceptar typeId como parámetro
    async getItemsBytypeID(typeId) {
        if (!typeId) {
            throw new Error("Se requiere un typeId para obtener elementos de clasificación.");
        }
        try {
            const query = `
                SELECT id_clasificacion AS id, nombre, descripcion
                FROM clasificacion
                WHERE type_id = $1
                ORDER BY orden, nombre;
            `;
            const result = await pool.query(query, [typeId]);
            return result.rows;
        } catch (error) {
            console.error(`Error en ClasificacionModel.getItemsByTypeId (typeId: ${typeId}):`, error.message);
            throw new Error("Error interno del servidor al obtener elementos de clasificación.");
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
}

export default new Clasificacion();
