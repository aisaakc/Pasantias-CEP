import pool from "../db.js";
import bcrypt from 'bcryptjs';

class UserModel {
  async getGeneros() {
    const query = `
      SELECT id, nombre 
      FROM clasificacion 
      WHERE type_id = 1;
    `;
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error("Error al obtener géneros: " + error.message);
    }
  }

  async getRoles() {
    const query = `
      SELECT id, nombre 
      FROM clasificacion 
      WHERE type_id = 2;
    `;
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error("Error al obtener roles: " + error.message);
    }
  }

  async getPreguntasSeguridad() {
    const query = `
      SELECT id, nombre 
      FROM clasificacion 
      WHERE type_id = 14;
    `;
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error("Error al obtener preguntas de seguridad: " + error.message);
    }
  }

  async #hashDato(dato) {
    try {
      return await bcrypt.hash(dato, 10);
    } catch (error) {
      throw new Error("Error al cifrar datos: " + error.message);
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
      id_pregunta_seguridad,
      respuesta_seguridad,
      contraseña,
    } = data;

    try {

      const checkQuery = `
      SELECT * FROM personas WHERE cedula = $1 OR gmail = $2;
    `;
    const check = await pool.query(checkQuery, [cedula, gmail]);

    if (check.rows.length > 0) {
      const existing = check.rows[0];
      if (existing.cedula === cedula) {
        throw new Error("La cédula ya está registrada.");
      }
      if (existing.gmail === gmail) {
        throw new Error("El correo electrónico ya está registrado.");
      }
    }
    
      const [hashedPassword, hashedRespuesta] = await Promise.all([
        this.#hashDato(contraseña),
        this.#hashDato(respuesta_seguridad),
      ]);

      const query = `
        INSERT INTO personas (
          nombre,
          apellido,
          telefono,
          cedula,
          id_genero,
          id_rol,
          id_pregunta_seguridad,
          respuesta_seguridad,
          contraseña,
          gmail
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id;
      `;

      const values = [
        nombre,
        apellido,
        telefono,
        cedula,
        id_genero,
        id_rol,
        id_pregunta_seguridad,
        hashedRespuesta,
        hashedPassword,
        gmail,
      ];

      const result = await pool.query(query, values);
      return result.rows[0].id;

    } catch (error) {
      throw new Error("Error al registrar el usuario: " + error.message);
    }
  }
  

  async loginUser({ gmail, contraseña }) {
    if (!gmail) {
      throw new Error("Debe proporcionar el correo electrónico.");
    }
  
    const query = `
      SELECT * FROM personas 
      WHERE gmail = $1
    `;
    const values = [gmail];
  
    try {
      const result = await pool.query(query, values);
      const user = result.rows[0];
  
      if (!user) throw new Error("Usuario no encontrado");
  
      const passwordMatch = await bcrypt.compare(contraseña, user.contraseña);
   
      if (!passwordMatch) throw new Error("Contraseña incorrecta");
  
      return user;
    } catch (error) {
      throw new Error("Error al iniciar sesión: " + error.message);
    }
  }
  
}

export default new UserModel();
