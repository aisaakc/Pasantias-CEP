import express from 'express';
import { registrarUsuario, loginUsuario } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registrarUsuario);
router.post('/login', loginUsuario); // ← Aquí la ruta para login

export default router;
