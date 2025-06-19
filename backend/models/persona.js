import pool from "../db.js";
import bcrypt from 'bcryptjs';
import EmailService from '../services/emailService.js';

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
      let query = `
        SELECT 
          c.id_clasificacion AS id, 
          c.nombre,
          c.adicional
        FROM clasificacion c
        WHERE c.type_id = $1;
      `;

      const result = await pool.query(query, [id]);

      return result.rows;
    } catch (error) {
      console.error("Error en getSubclassificationsById:", error.message);
      throw error;
    }
  }
  
  async #hashDato(dato, email) {
    try {
      if (!email) {
        throw new Error("El email es requerido para el hash");
      }
      if (dato === null || dato === undefined) {
        throw new Error("Dato a cifrar es nulo o indefinido.");
      }
      const combinedData = `${email}${dato}`;
      const saltRounds = 10;
      return await bcrypt.hash(combinedData, saltRounds);
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
      contrasena,
    } = data;

    console.log('Datos recibidos en createUser:', data);

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
        this.#hashDato(contrasena, gmail),
        this.#hashDato(respuesta, gmail),
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
      const userId = result.rows[0].id_persona;

      // Enviar correo de bienvenida
      try {
        await EmailService.sendWelcomeEmail(gmail, nombre, apellido);
        console.log('Correo de bienvenida enviado exitosamente');
      } catch (emailError) {
        console.error('Error al enviar correo de bienvenida:', emailError.message);
      }

      return userId;

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

  async loginUser({ cedula, gmail, contrasena }) {
    
    if ((!cedula && !gmail) || !contrasena) {
      throw new Error("Debe proporcionar cédula o correo electrónico, y la contrasena.");
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

      // Combinar el email con la contraseña para la comparación
      const combinedData = `${user.gmail}${contrasena}`;
      const passwordMatch = await bcrypt.compare(combinedData, user["contrasena"]);

      if (!passwordMatch) {
        throw new Error("Credenciales incorrectas.");
      }

      return user;

    } catch (error) {
      console.error("Error detallado al iniciar sesión:", error.message);
      if (error.message === "Credenciales incorrectas." || error.message === "Debe proporcionar cédula o correo electrónico, y la contrasena.") {
        throw error;
      }
      throw new Error("Error al iniciar sesión.");
    }
  }

  

  
}

export default new UserModel();