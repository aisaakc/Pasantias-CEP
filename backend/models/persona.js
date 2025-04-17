import pool from "../db.js"

export const createUser = async(Data) =>{
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
        contraseña
    } = Data;

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
    respuesta_seguridad,
    contraseña,
    gmail
  ];

  try {
    // Ejecuta la consulta
    const result = await pool.query(query, values);
    return result.rows[0].id; // Retorna el id del nuevo usuario
  } catch (error) {
    throw new Error("Error al registrar el usuario: " + error.message);
  }
};

