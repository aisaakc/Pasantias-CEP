import express from 'express';
import pdfService from '../services/pdfService.js';

const router = express.Router();

router.post('/generate-certificate', async (req, res) => {
    try {
        console.log('Recibida solicitud de generación de PDF');
        console.log('Datos recibidos:', req.body);

        // Validar datos requeridos
        const requiredFields = ['participantName', 'courseName', 'institutionName'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                error: `Faltan campos requeridos: ${missingFields.join(', ')}`
            });
        }

        const pdfBuffer = await pdfService.generatePDF(req.body);
        
        // Set headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=certificate.pdf');
        
        // Send the PDF
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error en la ruta de generación de PDF:', error);
        res.status(500).json({ 
            error: error.message || 'Error al generar el PDF',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

export default router; 