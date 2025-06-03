import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

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
    static async sendWelcomeEmail(to, name) {
        const subject = '¡Bienvenido a CEP!';
        const text = `Hola ${name},\n\nBienvenido a nuestra plataforma. Esperamos que disfrutes de nuestros servicios.`;
        const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #2c3e50;">¡Bienvenido a CEP!</h1>
                <p style="color: #34495e; line-height: 1.6;">
                    Hola ${name},
                </p>
                <p style="color: #34495e; line-height: 1.6;">
                    Nos complace darte la bienvenida a nuestra plataforma. Esperamos que disfrutes de nuestros servicios.
                </p>
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p style="margin: 0; color: #666;">
                        <strong>Tu cuenta ha sido activada exitosamente.</strong>
                    </p>
                </div>
                <p style="color: #7f8c8d; font-size: 0.9em;">
                    Si tienes alguna pregunta, no dudes en contactarnos.
                </p>
            </div>
        `;

        return this.sendEmail({ to, subject, text, html });
    }
}

export default EmailService; 