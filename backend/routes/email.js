import express from 'express';
import EmailService from '../services/emailService.js';

const router = express.Router();

// Middleware para manejar errores de JSON
const handleJsonError = (err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('Error de parsing JSON:', err);
        return res.status(400).json({ 
            error: 'Error en el formato JSON', 
            details: err.message 
        });
    }
    next();
};

// Aplicar el middleware
router.use(handleJsonError);

// Ruta para probar el envío de email
router.post('/send', async (req, res) => {
    console.log('=== PETICIÓN DE ENVÍO DE EMAIL RECIBIDA ===');
    
    try {
        const { to, subject, text, html } = req.body;

        // Validación básica de los datos de entrada
        if (!to || !subject || (!text && !html)) {
            return res.status(400).json({ 
                error: 'Faltan parámetros obligatorios: to, subject, y al menos text o html.' 
            });
        }

        console.log('Intentando enviar email con los siguientes datos:', {
            to,
            subject
        });

        const result = await EmailService.sendEmail({ to, subject, text, html });

        if (result.success) {
            console.log('Email enviado exitosamente');
            res.json({
                success: true,
                message: 'Correo enviado exitosamente',
                data: result.data
            });
        } else {
            console.error('Error al enviar el correo:', result.error);
            res.status(500).json({
                success: false,
                error: 'Error al enviar el correo',
                details: result.error
            });
        }
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).json({
            success: false,
            error: 'Error en el servidor',
            details: error.message
        });
    }
});

// Ruta para enviar correo de bienvenida
router.post('/welcome', async (req, res) => {
    console.log('=== PETICIÓN DE ENVÍO DE EMAIL DE BIENVENIDA ===');
    
    try {
        const { to, name } = req.body;

        if (!to || !name) {
            return res.status(400).json({ 
                error: 'Faltan parámetros obligatorios: to y name.' 
            });
        }

        const result = await EmailService.sendWelcomeEmail(to, name);

        if (result.success) {
            res.json({
                success: true,
                message: 'Correo de bienvenida enviado exitosamente',
                data: result.data
            });
        } else {
            res.status(500).json({
                success: false,
                error: 'Error al enviar el correo de bienvenida',
                details: result.error
            });
        }
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).json({
            success: false,
            error: 'Error en el servidor',
            details: error.message
        });
    }
});

export default router; 