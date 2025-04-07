import express from 'express';
import { PORT } from './config.js';
import courseRoutes from './routes/courses.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

app.use(express.json());
app.use(courseRoutes); // Registers all routes from courseRoutes
app.use(authRoutes); // Registers all routes from authRoutes

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
