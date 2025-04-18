import express from 'express';
import AuthController from '../controllers/authController.js';


const router = express.Router();

router.post('/login', AuthController.loginUsuario);
router.post('/register', AuthController.registrarUsuario);
// routes/auth.js
router.get('/generos', AuthController.obtenerGeneros);
router.get('/roles', AuthController.obtenerRoles);
router.get('/preguntas', AuthController.obtenerPreguntas);

router.post("/crear-admin", AuthController.crearAdministrador);

export default router;
