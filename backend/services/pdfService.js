import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { promises as fs } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class PDFService {
    constructor() {
        this.templatePath = join(__dirname, '../templates/certificate.html');
        this.logoPath = join(__dirname, '../../client/src/assets/tu_logo.png');
        console.log('PDFService inicializado con template path:', this.templatePath);
        console.log('Logo path:', this.logoPath);
    }

    async generatePDF(data) {
        let browser = null;
        try {
            console.log('Iniciando generación de PDF...');
            console.log('Datos recibidos:', JSON.stringify(data, null, 2));

            // Verificar que el template existe
            try {
                await fs.access(this.templatePath);
                console.log('Template encontrado en:', this.templatePath);
            } catch (error) {
                console.error('Error al acceder al template:', error);
                throw new Error(`No se pudo encontrar el template del certificado en: ${this.templatePath}`);
            }

            // Verificar que el logo existe
            try {
                await fs.access(this.logoPath);
                console.log('Logo encontrado en:', this.logoPath);
            } catch (error) {
                console.error('Error al acceder al logo:', error);
                throw new Error(`No se pudo encontrar el logo en: ${this.logoPath}`);
            }

            // Read the HTML template
            let htmlTemplate;
            try {
                htmlTemplate = await fs.readFile(this.templatePath, 'utf8');
                console.log('Template leído correctamente');
            } catch (error) {
                console.error('Error al leer el template:', error);
                throw new Error(`Error al leer el template: ${error.message}`);
            }

            // Read the logo file
            let logoBase64;
            try {
                const logoBuffer = await fs.readFile(this.logoPath);
                logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
                console.log('Logo leído correctamente');
            } catch (error) {
                console.error('Error al leer el logo:', error);
                throw new Error(`Error al leer el logo: ${error.message}`);
            }

            // Replace placeholders with actual data
            try {
                htmlTemplate = this.replacePlaceholders(htmlTemplate, {
                    ...data,
                    logoPath: logoBase64
                });
                console.log('Placeholders reemplazados');
            } catch (error) {
                console.error('Error al reemplazar placeholders:', error);
                throw new Error(`Error al reemplazar placeholders: ${error.message}`);
            }

            // Launch browser with minimal configuration
            console.log('Iniciando navegador...');
            try {
                browser = await puppeteer.launch({
                    headless: 'new',
                    args: ['--no-sandbox', '--disable-setuid-sandbox']
                });
                console.log('Navegador iniciado');
            } catch (error) {
                console.error('Error al iniciar el navegador:', error);
                throw new Error(`Error al iniciar el navegador: ${error.message}`);
            }

            // Create new page
            let page;
            try {
                page = await browser.newPage();
                await page.setViewport({ width: 1920, height: 1080 });
                console.log('Nueva página creada');
            } catch (error) {
                console.error('Error al crear nueva página:', error);
                throw new Error(`Error al crear nueva página: ${error.message}`);
            }

            // Set content
            console.log('Estableciendo contenido...');
            try {
                await page.setContent(htmlTemplate, {
                    waitUntil: 'networkidle0'
                });
                console.log('Contenido establecido');
            } catch (error) {
                console.error('Error al establecer contenido:', error);
                throw new Error(`Error al establecer contenido: ${error.message}`);
            }

            // Generate PDF
            console.log('Generando PDF...');
            let pdf;
            try {
                pdf = await page.pdf({
                    format: 'A4',
                    landscape: true,
                    printBackground: true,
                    margin: {
                        top: '20px',
                        right: '20px',
                        bottom: '20px',
                        left: '20px'
                    }
                });
                console.log('PDF generado exitosamente');
            } catch (error) {
                console.error('Error al generar PDF:', error);
                throw new Error(`Error al generar PDF: ${error.message}`);
            }

            return pdf;
        } catch (error) {
            console.error('Error en generatePDF:', error);
            throw new Error(`Error al generar el PDF: ${error.message}`);
        } finally {
            if (browser) {
                console.log('Cerrando navegador...');
                try {
                    await browser.close();
                    console.log('Navegador cerrado');
                } catch (error) {
                    console.error('Error al cerrar el navegador:', error);
                }
            }
        }
    }

    replacePlaceholders(template, data) {
        try {
            console.log('Iniciando reemplazo de placeholders...');
            const replacements = {
                '{{participantName}}': data.participantName || '',
                '{{courseName}}': data.courseName || '',
                '{{institutionName}}': data.institutionName || '',
                '{{startDate}}': data.startDate || '',
                '{{endDate}}': data.endDate || '',
                '{{duration}}': data.duration || '',
                '{{city}}': data.city || '',
                '{{day}}': data.day || '',
                '{{month}}': data.month || '',
                '{{year}}': data.year || '',
                '{{facilitatorName}}': data.facilitatorName || '',
                '{{directorName}}': data.directorName || '',
                '{{logoPath}}': data.logoPath || ''
            };

            let result = template;
            for (const [placeholder, value] of Object.entries(replacements)) {
                result = result.replace(new RegExp(placeholder, 'g'), value);
            }
            console.log('Placeholders reemplazados exitosamente');
            return result;
        } catch (error) {
            console.error('Error en replacePlaceholders:', error);
            throw new Error(`Error al reemplazar placeholders: ${error.message}`);
        }
    }
}

export default new PDFService();
