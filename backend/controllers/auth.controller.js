import pool from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
  const {
    nombre,
    apellido,
    cedula,
    correo,
    telefono,
    password,
    tipoParticipante,
    genero, 
  } = req.body;

  try {
   
    if (!nombre || !apellido || !cedula || !correo || !password || !tipoParticipante || !genero) {
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
        (nombre, apellido, cedula, correo, telefono, tipo_participante, genero, rol, asignado_por_usuario_id, contraseña)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        nombre,
        apellido,
        cedula,
        correo,
        telefono,
        tipoParticipante,
        genero,          
        'Participante',  
        null,           
        hashedPassword
      ]
    );

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (err) {
    console.error('Error en el registro:', err.message);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const loginUser = async (req, res) => {
  const { correo, password } = req.body;

  try {
    if (!correo || !password) {
      return res.status(400).json({ message: 'Correo y contraseña son requeridos' });
    }

    // Buscar al usuario por correo
    const user = await pool.query('SELECT * FROM usuario WHERE correo = $1', [correo]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Comparar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.rows[0].contraseña);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Crear el token JWT
    const token = jwt.sign(
      { userId: user.rows[0].id, nombre: user.rows[0].nombre, rol: user.rows[0].rol }, // payload
      process.env.JWT_SECRET, // clave secreta
      { expiresIn: '1h' } // tiempo de expiración del token
    );

    res.status(200).json({ message: 'Inicio de sesión exitoso', token });
  } catch (err) {
    console.error('Error en el login:', err.message);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
