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

  // ✅ Validaciones de campos requeridos
  const camposObligatorios = [nombre, apellido, cedula, correo, password, tipoParticipante, genero];
  if (camposObligatorios.some(campo => !campo)) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  // ✅ Validaciones específicas
  if (!/^\d+$/.test(cedula)) {
    return res.status(400).json({ message: 'La cédula debe contener solo números' });
  }

  const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!correoRegex.test(correo)) {
    return res.status(400).json({ message: 'Formato de correo inválido' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
  }

  const tipo = tipoParticipante.trim();
  const generoClean = genero.trim();

  const tiposPermitidos = ['estudiante IUJO', 'Participante Externo', 'Personal IUJO'];
  const generosPermitidos = ['Masculino', 'Femenino'];

  if (!tiposPermitidos.includes(tipo)) {
    return res.status(400).json({ message: 'Tipo de participante inválido' });
  }

  if (!generosPermitidos.includes(generoClean)) {
    return res.status(400).json({ message: 'Género inválido' });
  }

  try {
    // ✅ Verificar si ya existe el usuario
    const { rows } = await pool.query(
      'SELECT 1 FROM usuario WHERE correo = $1 OR cedula = $2',
      [correo, cedula]
    );

    if (rows.length > 0) {
      return res.status(409).json({ message: 'Ya existe un usuario con ese correo o cédula' });
    }

    // ✅ Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Insertar nuevo usuario
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
        tipo,
        generoClean,
        'Participante',
        null,
        hashedPassword
      ]
    );

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (err) {
    console.error('🛑 Error en el registro:', err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};



export const loginUser = async (req, res) => {
  const { correo, password } = req.body;

  // ✅ Validaciones básicas
  if (!correo || !password) {
    return res.status(400).json({ message: 'Correo y contraseña son requeridos' });
  }

  const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!correoRegex.test(correo)) {
    return res.status(400).json({ message: 'Formato de correo inválido' });
  }

  try {
    // ✅ Buscar usuario por correo
    const { rows } = await pool.query('SELECT * FROM usuario WHERE correo = $1', [correo]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const usuario = rows[0];

    // ✅ Validar contraseña
    const isPasswordValid = await bcrypt.compare(password, usuario.contraseña);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // ✅ Generar token JWT
    const tokenPayload = {
      userId: usuario.id,
      nombre: usuario.nombre,
      rol: usuario.rol,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        rol: usuario.rol,
      }
    });

  } catch (error) {
    console.error('🛑 Error en el login:', error.message);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
