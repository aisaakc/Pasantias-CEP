import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { PORT } from './config.js';
import authRoutes from './routes/auth.js';
import clasificacion from './routes/clasificacion.js';
import cursoRoutes from './routes/curso.js';
import emailRoutes from './routes/email.js';
import personaRoutes from './routes/persona.js';
import documentosRoutes from './routes/documentos.js';
import pdfRoutes from './routes/pdf.js';
import geminiRoutes from './routes/gemini.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors()); 

// Servir archivos estáticos desde la carpeta docs
app.use('/docs', express.static(path.join(__dirname, 'docs')));

app.use('/api/auth', authRoutes); 
app.use('/api', clasificacion);
app.use('/api', cursoRoutes);
app.use('/api', personaRoutes);
app.use('/api/documentos', documentosRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/gemini', geminiRoutes);

app.get('/', (req, res) => {
    res.send('API está funcionando.');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Archivos estáticos disponibles en: http://localhost:3001/docs/');
});