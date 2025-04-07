import pool from '../db.js';
import bcrypt from 'bcrypt';

export const registerUser = async (req, res) => {
  const {
    nombre,
    apellido,
    cedula,
    correo,
    telefono,
    password,
    tipoParticipante,
  } = req.body;

  try {
    if (!nombre || !apellido || !cedula || !correo || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const userExists = await pool.query(
      'SELECT * FROM usuario WHERE correo = $1 OR cedula = $2',
      [correo, cedula]
    );

    if (userExists.rows.length > 0) {
      return res.status(409).json({ message: 'Ya existe un usuario con ese correo o cédula' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
        `INSERT INTO usuario 
          (nombre, apellido, cedula, correo, telefono, tipo_participante, rol, asignado_por_usuario_id, contraseña)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          nombre,
          apellido,
          cedula,
          correo,
          telefono,
          tipoParticipante,
          'Participante',          // Asignamos rol automáticamente
          null,                    // No lo asignó ningún otro usuario
          hashedPassword
        ]
      );
      

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (err) {
    console.error('Error en el registro:', err.message);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
