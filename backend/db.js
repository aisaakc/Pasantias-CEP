import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost', 
    database: 'db_cep',
    password: '1234',
    port: 5432,
})

pool.connect()
    .then(() => console.log('🟢 Conectado a PostgreSQL'))
    .catch(err => console.error('🔴 Error de conexión a PostgreSQL', err))

export default pool;    

