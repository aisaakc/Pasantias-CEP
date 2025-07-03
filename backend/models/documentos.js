import pool from "../db.js";

class Documentos {
    // Crear un nuevo documento
    async createDocumet(documento) {
        try {
            const { id_tipo, fecha_hora, nombre, descripcion, ext, tamano } = documento;
            const query = `
                INSERT INTO documentos (id_tipo, fecha_hora, nombre, descripcion, ext, tamano)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *
            `;
            const values = [id_tipo, fecha_hora, nombre, descripcion, ext, tamano];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error al crear documento: ${error.message}`);
        }
    }

    // Obtener todos los documentos
    async findAll() {
        try {
            const query = "SELECT * FROM documentos ORDER BY fecha_hora DESC";
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw new Error(`Error al obtener documentos: ${error.message}`);
        }
    }

    // Obtener documentos por tipo
    async findByTipo(id_tipo) {
        try {
            const query = "SELECT * FROM documentos WHERE id_tipo = $1 ORDER BY fecha_hora DESC";
            const result = await pool.query(query, [id_tipo]);
            return result.rows;
        } catch (error) {
            throw new Error(`Error al obtener documentos por tipo: ${error.message}`);
        }
    }

    // Actualizar documento
    async update(id_documento, documento) {
        try {
            const { id_tipo, fecha_hora, nombre, descripcion, ext } = documento;
            const query = `
                UPDATE documentos 
                SET id_tipo = $1, fecha_hora = $2, nombre = $3, descripcion = $4, ext = $5
                WHERE id_documento = $6
                RETURNING *
            `;
            const values = [id_tipo, fecha_hora, nombre, descripcion, ext, id_documento];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error al actualizar documento: ${error.message}`);
        }
    }

    // Eliminar documento
    async delete(id_documento) {
        try {
            const query = "DELETE FROM documentos WHERE id_documento = $1 RETURNING *";
            const result = await pool.query(query, [id_documento]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error al eliminar documento: ${error.message}`);
        }
    }

    // Contar total de documentos
    async count() {
        try {
            const query = "SELECT COUNT(*) as total FROM documentos";
            const result = await pool.query(query);
            return parseInt(result.rows[0].total);
        } catch (error) {
            throw new Error(`Error al contar documentos: ${error.message}`);
        }
    }

    // Obtener documento por ID
    async findById(id_documento) {
        try {
            const query = "SELECT * FROM documentos WHERE id_documento = $1";
            const result = await pool.query(query, [id_documento]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error al obtener documento: ${error.message}`);
        }
    }

    // Obtener varios documentos por un array de IDs
    async findByIds(ids) {
        try {
            console.log('[findByIds] IDs recibidos:', ids);
            const query = `SELECT * FROM documentos WHERE id_documento = ANY($1::int[])`;
            console.log('[findByIds] QUERY:', query, 'PARAMS:', ids);
            const result = await pool.query(query, [ids]);
            return result.rows;
        } catch (error) {
            throw new Error(`Error al obtener documentos por IDs: ${error.message}`);
        }
    }
}

export default new Documentos();
