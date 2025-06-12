import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { CLASSIFICATION_IDS } from '../../client/src/config/classificationIds.js';

dotenv.config();

// Log de depuración de la importación
        // console.log('=== DEBUG EMAIL SERVICE CONFIG ===');
        // console.log('CLASSIFICATION_IDS importado:', CLASSIFICATION_IDS);
        // console.log('SEND_EMAIL importado:', CLASSIFICATION_IDS.SEND_EMAIL);

// Configura el transportador de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',  // Usar el servicio predefinido de Gmail
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    },
        debug: true,
    logger: true
        });

class EmailService {
    static async sendEmail({ to, subject, text, html }) {
        // Logs de depuración
        console.log('=== DEBUG SEND_EMAIL ===');
        console.log('CLASSIFICATION_IDS:', CLASSIFICATION_IDS);
        console.log('SEND_EMAIL value:', CLASSIFICATION_IDS.SEND_EMAIL);
        console.log('SEND_EMAIL type:', typeof CLASSIFICATION_IDS.SEND_EMAIL);
        console.log('SEND_EMAIL === false:', CLASSIFICATION_IDS.SEND_EMAIL === false);
        console.log('!SEND_EMAIL:', !CLASSIFICATION_IDS.SEND_EMAIL);

        // Si el envío de emails está deshabilitado, retornar éxito simulado
        if (CLASSIFICATION_IDS.SEND_EMAIL === false) {
            console.log('Envío de emails deshabilitado. Simulando envío exitoso.');
            return { success: true, data: { response: 'Email sending disabled' } };
        }

        const mailOptions = {
            from: process.env.SMTP_USER, // Usar el mismo correo que el usuario SMTP
            to,
            subject,
            text,
            html
        };

        try {
            console.log('=== INICIO DE ENVÍO DE EMAIL ===');
            console.log('Configuración:', {
                service: 'gmail',
                user: process.env.SMTP_USER
            });

            const info = await transporter.sendMail(mailOptions);
            console.log('Correo enviado exitosamente:', info.response);
            return { success: true, data: info };
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            return { success: false, error: error.message };
        }
    }

    // Método específico para correo de bienvenida
    static async sendWelcomeEmail(to, nombre, apellido) {
        // Logs de depuración
        console.log('=== DEBUG SEND_WELCOME_EMAIL ===');
        console.log('CLASSIFICATION_IDS:', CLASSIFICATION_IDS);
        console.log('SEND_EMAIL value:', CLASSIFICATION_IDS.SEND_EMAIL);
        console.log('SEND_EMAIL type:', typeof CLASSIFICATION_IDS.SEND_EMAIL);
        console.log('SEND_EMAIL === false:', CLASSIFICATION_IDS.SEND_EMAIL === false);
        console.log('!SEND_EMAIL:', !CLASSIFICATION_IDS.SEND_EMAIL);

        // Si el envío de emails está deshabilitado, retornar éxito simulado
        if (CLASSIFICATION_IDS.SEND_EMAIL === false) {
            console.log('Envío de emails deshabilitado. Simulando envío de bienvenida.');
            return { success: true, data: { response: 'Welcome email sending disabled' } };
        }

        const subject = '¡Bienvenido a CEP!';
        const text = `Hola ${nombre} ${apellido},\n\nBienvenido a nuestra plataforma. Esperamos que disfrutes de nuestros servicios.`;
        const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #2c3e50; text-align: center; margin-bottom: 30px;">¡Bienvenido a CEP!</h1>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #3498db;">
                    <h2 style="color: #2c3e50; margin-top: 0;">Detalles de tu cuenta:</h2>
                    <p style="color: #34495e; line-height: 1.6; margin: 10px 0;">
                        <strong>Nombre completo:</strong> ${nombre} ${apellido}
                    </p>
                    <p style="color: #34495e; line-height: 1.6; margin: 10px 0;">
                        <strong>Correo electrónico:</strong> ${to}
                    </p>
                </div>

                <p style="color: #34495e; line-height: 1.6;">
                    Nos complace darte la bienvenida a nuestra plataforma. Tu cuenta ha sido activada exitosamente y ya puedes comenzar a utilizar todos nuestros servicios.
                </p>

                <div style="background-color: #e8f4f8; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
                    <p style="margin: 0; color: #2980b9;">
                        <strong>¡Estamos emocionados de tenerte como parte de nuestra comunidad!</strong>
                    </p>
                </div>

                <p style="color: #7f8c8d; font-size: 0.9em; margin-top: 30px;">
                    Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.
                </p>
            </div>
        `;

        return this.sendEmail({ to, subject, text, html });
    }
}

export default EmailService; 