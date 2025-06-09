import pool from "../db.js";
import bcrypt from "bcryptjs";
import { CLASSIFICATION_IDS } from "../config/classificationIds.js";
import EmailService from "../services/emailService.js";

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
          WHERE c_tipos.id_clasificacion = $1
          ORDER BY c_roles.id_clasificacion;
        `;    
        try {
          const result = await pool.query(query, [CLASSIFICATION_IDS.ROLES]);
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

    async CreateUsers(data) {
        const {
            nombre,
            apellido,
            telefono,
            cedula,
            gmail,
            id_genero,
            id_rol,
            id_pregunta,
            respuesta,
            contrasena,
        } = data;

        console.log('Datos recibidos en CreateUsers:', data);

        if (!nombre || !apellido || !telefono || !cedula || !gmail || 
            id_genero === undefined || !Array.isArray(id_rol) || id_rol.length === 0 || 
            id_pregunta === undefined || !respuesta || !contrasena) {
            console.log('Validación fallida:', {
                nombre: !!nombre,
                apellido: !!apellido,
                telefono: !!telefono,
                cedula: !!cedula,
                gmail: !!gmail,
                id_genero: id_genero !== undefined,
                id_rol: Array.isArray(id_rol) && id_rol.length > 0,
                id_pregunta: id_pregunta !== undefined,
                respuesta: !!respuesta,
                contrasena: !!contrasena
            });
            throw new Error("Faltan campos obligatorios para crear el usuario.");
        }

        try {
            const checkQuery = `
                SELECT cedula, gmail 
                FROM personas 
                WHERE cedula = $1 OR gmail = $2;
            `;
            const checkResult = await pool.query(checkQuery, [cedula, gmail]);

            if (checkResult.rows.length > 0) {
                const existing = checkResult.rows[0];
                if (existing.cedula === cedula) {
                    throw new Error("La cédula ya está registrada.");
                }
                if (existing.gmail && existing.gmail.toLowerCase() === gmail.toLowerCase()) {
                    throw new Error("El correo electrónico ya está registrado.");
                }
                throw new Error("El usuario con esa cédula o correo ya existe.");
            }

            const [hashedPassword, hashedRespuesta] = await Promise.all([
                this.#hashDato(contrasena),
                this.#hashDato(respuesta),
            ]);

            // Convertir el array de roles a un objeto JSON con el formato exacto requerido
            const rolesJson = JSON.stringify({ id_rol: id_rol.map(role => role.toString()) });

            const query = `
                INSERT INTO personas (
                    nombre,
                    apellido,
                    telefono,
                    cedula,
                    id_genero,
                    id_rol,
                    id_pregunta,     
                    respuesta,       
                    "contrasena",    
                    gmail
                ) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                RETURNING id_persona; 
            `;
            const values = [
                nombre,
                apellido,
                telefono,
                cedula,
                id_genero,
                rolesJson,
                id_pregunta,
                hashedRespuesta,
                hashedPassword,
                gmail,
            ];

            const result = await pool.query(query, values);
            
            // Enviar correo de bienvenida
            try {
                await EmailService.sendWelcomeEmail(gmail, nombre);
                console.log('Correo de bienvenida enviado exitosamente');
            } catch (emailError) {
                console.error('Error al enviar correo de bienvenida:', emailError);
                // No lanzamos el error para no interrumpir el flujo principal
            }

            return result.rows[0].id_persona;

        } catch (error) {
            if (error.message.includes("La cédula ya está registrada.") || error.message.includes("El correo electrónico ya está registrado.")) {
                throw error;
            }
            console.error("Error detallado al registrar usuario:", error.message);
            if (error.code === '23505') {
                if (error.constraint === 'personas_cedula_key') {
                    throw new Error("La cédula ya existe.");
                } else if (error.constraint === 'personas_gmail_key') {
                    throw new Error("El correo electrónico ya existe.");
                } else {
                    throw new Error("Entrada duplicada.");
                }
            }
            throw new Error("Error al registrar el usuario: " + error.message);
        }
    }

    async #hashDato(dato) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(dato, salt);
    }

    async updateUser(id_persona, data) {
        const {
            nombre,
            apellido,
            telefono,
            cedula,
            gmail,
            id_genero,
            id_rol,
            id_pregunta,
            respuesta,
            contrasena,
        } = data;

        try {
            // Verificar si el usuario existe
            const checkUserQuery = `
                SELECT id_persona, cedula, gmail 
                FROM personas 
                WHERE id_persona = $1;
            `;
            const userResult = await pool.query(checkUserQuery, [id_persona]);
            
            if (userResult.rows.length === 0) {
                throw new Error("Usuario no encontrado");
            }

            // Verificar si la nueva cédula o gmail ya existen en otro usuario
            if (cedula || gmail) {
                const checkDuplicateQuery = `
                    SELECT cedula, gmail 
                    FROM personas 
                    WHERE id_persona != $1 
                    AND (cedula = $2 OR gmail = $3);
                `;
                const duplicateResult = await pool.query(checkDuplicateQuery, [
                    id_persona,
                    cedula || userResult.rows[0].cedula,
                    gmail || userResult.rows[0].gmail
                ]);

                if (duplicateResult.rows.length > 0) {
                    const existing = duplicateResult.rows[0];
                    if (cedula && existing.cedula === cedula) {
                        throw new Error("La cédula ya está registrada en otro usuario.");
                    }
                    if (gmail && existing.gmail && existing.gmail.toLowerCase() === gmail.toLowerCase()) {
                        throw new Error("El correo electrónico ya está registrado en otro usuario.");
                    }
                }
            }

            // Construir la consulta de actualización dinámicamente
            let updateFields = [];
            let values = [];
            let paramCount = 1;

            if (nombre) {
                updateFields.push(`nombre = $${paramCount}`);
                values.push(nombre);
                paramCount++;
            }
            if (apellido) {
                updateFields.push(`apellido = $${paramCount}`);
                values.push(apellido);
                paramCount++;
            }
            if (telefono) {
                updateFields.push(`telefono = $${paramCount}`);
                values.push(telefono);
                paramCount++;
            }
            if (cedula) {
                updateFields.push(`cedula = $${paramCount}`);
                values.push(cedula);
                paramCount++;
            }
            if (gmail) {
                updateFields.push(`gmail = $${paramCount}`);
                values.push(gmail);
                paramCount++;
            }
            if (id_genero) {
                updateFields.push(`id_genero = $${paramCount}`);
                values.push(id_genero);
                paramCount++;
            }
            if (id_rol) {
                const rolesJson = JSON.stringify({ id_rol: id_rol.map(role => role.toString()) });
                updateFields.push(`id_rol = $${paramCount}`);
                values.push(rolesJson);
                paramCount++;
            }
            if (id_pregunta) {
                updateFields.push(`id_pregunta = $${paramCount}`);
                values.push(id_pregunta);
                paramCount++;
            }
            if (respuesta) {
                const hashedRespuesta = await this.#hashDato(respuesta);
                updateFields.push(`respuesta = $${paramCount}`);
                values.push(hashedRespuesta);
                paramCount++;
            }
            if (contrasena) {
                const hashedPassword = await this.#hashDato(contrasena);
                updateFields.push(`"contrasena" = $${paramCount}`);
                values.push(hashedPassword);
                paramCount++;
            }

            if (updateFields.length === 0) {
                throw new Error("No se proporcionaron campos para actualizar");
            }

            // Agregar el ID al final de los valores
            values.push(id_persona);

            const query = `
                UPDATE personas 
                SET ${updateFields.join(', ')}
                WHERE id_persona = $${paramCount}
                RETURNING id_persona;
            `;

            const result = await pool.query(query, values);
            return result.rows[0].id_persona;

        } catch (error) {
            console.error("Error en updateUser:", error.message);
            throw error;
        }
    }
}

export default new UsuarioModel();