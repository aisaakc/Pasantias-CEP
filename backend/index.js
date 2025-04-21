import express from 'express';
import cors from 'cors';
import { PORT } from './config.js';
import authRoutes from './routes/auth.js';
// Asegúrate de importar otros routers aquí si los tienes o los creas
// import otherRoutes from './routes/otherRoutes.js';


const app = express();

// Middlewares
app.use(express.json()); // Permite a Express leer JSON en el body de las solicitudes
app.use(cors()); // Habilita CORS para permitir solicitudes desde otros dominios/puertos

// Montar rutas
// Montar las rutas de autenticación bajo el prefijo /api/auth
app.use('/api/auth', authRoutes); 

// Si tienes otros routers, móntalos aquí bajo sus respectivos prefijos
// app.use('/api/otros', otherRoutes);

// Puedes añadir una ruta raíz básica o de salud del servidor
app.get('/', (req, res) => {
    res.send('API está funcionando.');
});


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});