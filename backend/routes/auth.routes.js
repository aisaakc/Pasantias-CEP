// backend/routes/authRoutes.js
import express from 'express';
import { registerUser } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/registro', registerUser);

export default router;
