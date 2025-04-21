// backend/seeds/seed_superadmin.js

// Importar el pool de pg desde tu archivo db.js
import pool from "../db.js";
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

// --- Configuración de la conexión Knex eliminada (Comentario de referencia) ---
// Knex ya no se usa directamente en este seed, pero la exportación es para el runner de Knex.

// Definir los IDs correctos basados en tu tabla clasificacion
const ROL_SUPERADMIN = 7;        // ID para 'Super Administrador'
const GENERO_MASCULINO = 5;     // ID para 'Masculino' (o 6 para Femenino)
const PREGUNTA_SEGURIDAD = 17;  // ID para 'Cual es tu Animal favorito?'

async function runSeed() {
  console.log("Iniciando seed de superadministrador...");
  try {
    // Datos del superadmin
    const superadminData = {
        nombre: 'Super',
        apellido: 'Administrador',
        cedula: '1234567890',
        gmail: 'superadmin@empresa.com',
        telefono: '0123456789',
        contraseña_texto_plano: 'superadmin_password_muy_segura_123', // Contraseña en texto plano para hashear
        respuesta_texto_plano: 'Mi Animal Secreto', // Respuesta en texto plano para hashear
        id_genero: GENERO_MASCULINO,
        id_pregunta: PREGUNTA_SEGURIDAD,
        id_rol: ROL_SUPERADMIN,
    };

    // Verificar si el superadmin ya existe por cédula o gmail
    const checkQuery = `
      SELECT id_persona FROM personas WHERE cedula = $1 OR gmail = $2;
    `;
    const checkResult = await pool.query(checkQuery, [superadminData.cedula, superadminData.gmail]);

    if (checkResult.rows.length > 0) {
      console.log("El superadministrador ya existe. Omitiendo inserción.");
      return; // Salir si ya existe
    }

    // Cifrar la contraseña y la respuesta de seguridad
    const hashedPassword = await bcrypt.hash(superadminData.contraseña_texto_plano, 10);
    const hashedSecurityAnswer = await bcrypt.hash(superadminData.respuesta_texto_plano, 10);

    // Consulta para insertar el usuario superadmin usando pg
    // Asegurar nombres de columnas correctos ("contraseña", id_pregunta, respuesta)
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
      superadminData.nombre,
      superadminData.apellido,
      superadminData.telefono,
      superadminData.cedula,
      superadminData.id_genero, // 5
      superadminData.id_rol,      // 7
      superadminData.id_pregunta, // 17
      hashedSecurityAnswer,     // String
      hashedPassword,          // String
      superadminData.gmail,     // String
    ];

    const result = await pool.query(query, values);
    console.log(`Superadmin registrado correctamente con ID: ${result.rows[0].id_persona}`);

  } catch (error) {
    console.error("Error al insertar el superadmin:", error.message);
  } finally {
      // Knex runner gestiona la conexión, no necesitas pool.end() aquí si solo lo ejecutas con Knex
      // Si lo ejecutas como script independiente 'node seed_superadmin.js', sí sería bueno tenerlo.
      // pool.end(() => {
      //     console.log('Pool de DB cerrado.');
      // });
  }
}

// Esta parte permite ejecutar el seed directamente con 'node seed_superadmin.js'
if (process.argv[1] === import.meta.url.replace('file://', '')) {
    runSeed();
}

// --- Esta línea es necesaria para que Knex seed:run encuentre la función de seed ---
export { runSeed as seed };