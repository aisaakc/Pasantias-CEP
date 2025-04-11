import bcrypt from 'bcrypt';
import pkg from 'pg'; // Usamos CommonJS para importar 'pg'
import dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno desde el .env

// Conectar a la base de datos usando los parámetros del archivo config.js
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Función para insertar un usuario con la contraseña encriptada
const insertUser = async (nombre, apellido, cedula, correo, telefono, tipoParticipante, genero, rol, contraseña, asignadoPorUsuarioId) => {
  try {
    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Realizar la inserción en la base de datos
    await pool.query(
      `INSERT INTO usuario (nombre, apellido, cedula, correo, telefono, tipo_participante, genero, rol, contraseña, asignado_por_usuario_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        nombre,
        apellido,
        cedula,
        correo,
        telefono,
        tipoParticipante,
        genero,
        rol,
        hashedPassword, // La contraseña encriptada
        asignadoPorUsuarioId, // El ID del usuario asignado
      ]
    );

    console.log(`Usuario ${nombre} ${apellido} insertado con éxito`);
  } catch (err) {
    console.error('Error al insertar usuario:', err);
  }
};

// Ejecutar la inicialización de usuarios
const initializeUsers = async () => {
  await insertUser(
    'Victor', 'Gainza', '10000001', 'victor.gainza@example.com', '04141234567', 
    'Personal IUJO', 'Masculino', 'Super Administrador', 'claveSuper123', null
  );

  await insertUser(
    'Modesta', 'Gonzales', '10000002', 'modesta.gonzales@example.com', '04141234568',
    'Personal IUJO', 'Femenino', 'Administrador', 'claveAdmin123', 1
  );

  await insertUser(
    'Pedro', 'Martínez', '10000003', 'pedro.martinez@example.com', '04141234569',
    'Personal IUJO', 'Masculino', 'Caja', 'claveCaja123', 2
  );

  await insertUser(
    'Laura', 'Fernández', '10000004', 'laura.fernandez@example.com', '04141234570',
    'Personal IUJO', 'Femenino', 'Administradora', 'claveAdmina123', 2
  );

  // Cerrar la conexión con la base de datos
  pool.end();
};

// Llamar la función para insertar los usuarios
initializeUsers();
