import express from 'express';
import { registerUser, loginUser } from '../controllers/auth.controller.js';

const router = express.Router();

// Ruta de registro
router.post('/registro', registerUser);

// Ruta de inicio de sesión
router.post('/login', loginUser);

export default router;
