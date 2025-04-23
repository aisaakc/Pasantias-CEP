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

    async getItemsBytypeID() {
        if (!typeId) {
            throw new Error("Se requiere un typeId para obtener elementos de clasificación.");
        }
        try {
            const query = `
        SELECT id_clasificacion AS id, nombre, descripcion
        FROM clasificacion
        WHERE type_id = $1
        ORDER BY orden, nombre; -- Ordenar por el campo 'orden' si existe, o por nombre
        `;
            const result = await pool.query(query, [typeId]);
            return result.rows;
        } catch (error) {
            console.error(`Error en ClasificacionModel.getItemsByTypeId (typeId: ${typeId}):`, error.message);
            throw new Error("Error interno del servidor al obtener elementos de clasificacion");
        }
    }
}

export default new Clasificacion();