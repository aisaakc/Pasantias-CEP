import express from 'express';
import cors from 'cors';
import { PORT } from './config.js';
import authRoutes from './routes/auth.js'



const app = express();

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

app.use(authRoutes);

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
