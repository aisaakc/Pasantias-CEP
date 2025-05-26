import express from 'express';
import AuthController from '../controllers/authController.js';

const router = express.Router();

router.post('/login', AuthController.loginUsuario);
router.post('/register', AuthController.registrarUsuario);
router.get('/SubC/:id', AuthController.getSubclassificationsById);





export default router;