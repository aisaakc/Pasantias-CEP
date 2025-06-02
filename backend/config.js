import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno desde el archivo .env
dotenv.config({ path: path.join(__dirname, '.env') });

// // Verificar variables de entorno críticas
// const requiredEnvVars = ['RESEND_API_KEY'];
// const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

// if (missingEnvVars.length > 0) {
//     console.error('Error: Faltan las siguientes variables de entorno requeridas:', missingEnvVars);
//     process.exit(1);
// }

export const PORT = process.env.PORT || 3001;

export const DB_CONFIG = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
};

export const JWT_SECRET = process.env.JWT_SECRET;
// export const RESEND_API_KEY = process.env.RESEND_API_KEY;