import pool from "../db.js";
import bcrypt from 'bcryptjs';

class UserModel {
  // NUEVA FUNCIÓN HELPER: Obtiene el ID de un tipo de clasificación por su nombre
   async getClassificationTypeId(typeName) {
    const query = `
      SELECT id_clasificacion
      FROM clasificacion
      WHERE nombre = $1
      LIMIT 1;
    `;
    try {
      const result = await pool.query(query, [typeName]);
      if (result.rows.length === 0) {

        throw new Error(`Tipo de clasificación "${typeName}" no encontrado en la base de datos.`);
      }
      return result.rows[0].id_clasificacion;
    } catch (error) {
      console.error(`Error al obtener ID para tipo "${typeName}":`, error.message);
      throw new Error(`Error interno al obtener ID de tipo de clasificación.`);
    }
  }
  async getSubclassificationsById(id) {
    try {
      const query = `
        SELECT id_clasificacion AS id, nombre
        FROM clasificacion
        WHERE type_id = $1;
      `;
      const result = await pool.query(query, [id]);
      return result.rows;
    } catch (error) {
      console.error("Error en getSubclassificationsById:", error.message);
    
      throw error;
    }
  }
  
  async #hashDato(dato) {
    try {
      if (dato === null || dato === undefined) {
        throw new Error("Dato a cifrar es nulo o indefinido.");
      }
      const saltRounds = 10;
      return await bcrypt.hash(dato, saltRounds);
    } catch (error) {
      console.error("Error en #hashDato:", error.message);
      throw new Error("Error interno al cifrar datos.");
    }
  }

  async createUser(data) {
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
      contraseña,
    } = data;

    if (!nombre || !apellido || !telefono || !cedula || !gmail || 
      id_genero === undefined || id_rol === undefined || id_pregunta === undefined || !respuesta || !contraseña) {
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
        this.#hashDato(contraseña),
        this.#hashDato(respuesta),
      ]);

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
          "contraseña",    
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
        id_rol,
        id_pregunta,
        hashedRespuesta,
        hashedPassword,
        gmail,
      ];

      const result = await pool.query(query, values);
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

  async loginUser({ cedula, gmail, contraseña }) {
    
    if ((!cedula && !gmail) || !contraseña) {
      throw new Error("Debe proporcionar cédula o correo electrónico, y la contraseña.");
    }

    let query = `SELECT * FROM personas WHERE `;
    const values = [];

    if (cedula) {
      query += `cedula = $1`;
      values.push(cedula);
    }

    if (gmail) {
      if (values.length > 0) {
        query += ` OR `; 
      }
      query += `gmail = $${values.length + 1}`; 
      values.push(gmail.toLowerCase()); 
    }

    if (values.length === 0) {
      throw new Error("Debe proporcionar cédula o correo electrónico.");
    }

    try {
      const result = await pool.query(query, values);
      const user = result.rows[0];

      if (!user) {
        throw new Error("Credenciales incorrectas.");
      }

      // Comparar la contraseña proporcionada con la hasheada en la DB
      const passwordMatch = await bcrypt.compare(contraseña, user["contraseña"]);

      if (!passwordMatch) {
        throw new Error("Credenciales incorrectas.");
      }

      return user;

    } catch (error) {
      console.error("Error detallado al iniciar sesión:", error.message);
      if (error.message === "Credenciales incorrectas." || error.message === "Debe proporcionar cédula o correo electrónico, y la contraseña.") {
        throw error;
      }
      throw new Error("Error al iniciar sesión.");
    }
  }

  
}

export default new UserModel();

//   SELECT
//     p.id_persona,
//     p.nombre AS persona_nombre,
//     p.apellido,
//     p.telefono,
//     p.gmail,
//     c.id_clasificacion id_rol,
//     c.nombre rol_nombre,
//     c.descripcion rol_desc,
//     c.type_id rol_type
// FROM
//     personas p
// CROSS JOIN LATERAL json_array_elements_text(p.id_rol->'id_rol') AS role_id_text
// INNER JOIN
//     clasificacion c ON c.id_clasificacion = role_id_text::integer
// WHERE
//     p.id_persona = 1
// }

// SELECT
// json_array_elements_text(p.id_rol->'id_rol') AS role_id_text
// FROM
//     public.personas p
// WHERE p.id_persona = 5