import pkg from 'pg';
import { DB_CONFIG } from './config.js';

const { Pool } = pkg;

const pool = new Pool(DB_CONFIG);

pool.connect()
  .then(() => console.log('🟢 Conectado a PostgreSQL'))
  .catch(err => console.error('🔴 Error de conexión a PostgreSQL', err));

export default pool;