import express from 'express';
import cors from 'cors';
import { PORT } from './config.js';
import authRoutes from './routes/auth.js';
import clasificacion from './routes/clasificacion.js';
import cursoRoutes from './routes/curso.js';
import personaRoutes from './routes/persona.js';
import emailRoutes from './routes/email.js';

const app = express();

app.use(express.json()); 
app.use(cors()); 
app.use('/api/auth', authRoutes); 
app.use('/api', clasificacion);
app.use('/api', cursoRoutes);
app.use('/api', personaRoutes);
app.use('/api/email', emailRoutes);

app.get('/', (req, res) => {
    res.send('API está funcionando.');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});