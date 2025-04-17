import knex from 'knex';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

// Configuración de la conexión a la base de datos
const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  },
});

export async function seed(knex) {
  try {
    // Cifrar la contraseña
    const hashedPassword = await bcrypt.hash('superadmin_password', 10);
    
    // Cifrar la respuesta de seguridad
    const hashedSecurityAnswer = await bcrypt.hash('respuesta_segura', 10);

    // Insertar el usuario superadmin
    await db('personas').insert({
      nombre: 'Super',
      apellido: 'Administrador',
      cedula: '1234567890',
      contraseña: hashedPassword,  
      gmail: 'superadmin@empresa.com', 
      id_genero: 3,  
      id_pregunta_seguridad: 15,  // Ejemplo de pregunta de seguridad (asegúrate de que este valor exista)
      id_rol: 5,  // Rol de superadmin (asegúrate de que este valor sea válido)
      respuesta_seguridad: hashedSecurityAnswer,  // Respuesta de seguridad cifrada
      telefono: '1234567890',
    });

    console.log("Superadmin registrado correctamente");
  } catch (error) {
    console.error("Error al insertar el superadmin:", error.message);
  }
}
