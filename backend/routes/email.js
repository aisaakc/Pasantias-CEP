// import express from 'express';
// import EmailService from '../services/emailService.js';

// const router = express.Router();

// // Ruta de prueba para enviar email
// router.post('/test', async (req, res) => {
//     try {
//         const result = await EmailService.sendEmail({
//             to: 'tu-email@ejemplo.com', // Reemplaza esto con tu email
//             subject: 'Prueba de Resend',
//             html: '<h1>¡Hola!</h1><p>Este es un correo de prueba enviado desde Resend.</p>'
//         });

//         if (result.success) {
//             res.json({ message: 'Correo enviado exitosamente', data: result.data });
//         } else {
//             res.status(500).json({ error: 'Error al enviar el correo', details: result.error });
//         }
//     } catch (error) {
//         res.status(500).json({ error: 'Error en el servidor', details: error.message });
//     }
// });

// export default router; 