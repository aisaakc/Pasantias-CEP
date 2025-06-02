import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

class EmailService {
    static async sendEmail({ to, subject, html }) {
        try {
            console.log('Intentando enviar email a:', to);
            console.log('API Key configurada:', process.env.RESEND_API_KEY ? 'Sí' : 'No');
            
            const data = await resend.emails.send({
                from: 'onboarding@resend.dev', 
                to,
                subject,
                html,
            });

            console.log('Respuesta de Resend:', data);
            return { success: true, data };
        } catch (error) {
            console.error('Error detallado al enviar email:', {
                message: error.message,
                stack: error.stack,
                response: error.response?.data
            });
            return { success: false, error: error.message };
        }
    }
}

export default EmailService; 