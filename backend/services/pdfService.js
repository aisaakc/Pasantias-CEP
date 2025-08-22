import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { promises as fs } from 'fs';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class PDFService {
    constructor() {
        this.templatePath = join(__dirname, '../templates/certificate.html');
        this.logoPath = join(__dirname, '../../client/src/assets/tu_logo.png');
        console.log('PDFService inicializado con template path:', this.templatePath);
        console.log('Logo path:', this.logoPath);
    }

    // Función para detectar el navegador disponible
    async detectBrowser() {
        const platform = os.platform();
        const possiblePaths = [];

        if (platform === 'win32') {
            // Rutas comunes de Chrome en Windows
            possiblePaths.push(
                'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
                'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
                process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
                process.env.PROGRAMFILES + '\\Google\\Chrome\\Application\\chrome.exe',
                process.env['PROGRAMFILES(X86)'] + '\\Google\\Chrome\\Application\\chrome.exe'
            );
        } else if (platform === 'darwin') {
            // Rutas comunes de Chrome en macOS
            possiblePaths.push(
                '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
                '/Applications/Chromium.app/Contents/MacOS/Chromium'
            );
        } else if (platform === 'linux') {
            // Rutas comunes de Chrome en Linux
            possiblePaths.push(
                '/usr/bin/google-chrome',
                '/usr/bin/google-chrome-stable',
                '/usr/bin/chromium-browser',
                '/usr/bin/chromium'
            );
        }

        // Verificar si alguna ruta existe
        for (const path of possiblePaths) {
            try {
                await fs.access(path);
                console.log('Navegador encontrado en:', path);
                return path;
            } catch (error) {
                // Continuar con la siguiente ruta
            }
        }

        console.log('No se encontró Chrome instalado, usando Puppeteer con navegador incluido');
        return null;
    }

    // Función para obtener opciones de lanzamiento del navegador
    async getLaunchOptions() {
        const executablePath = await this.detectBrowser();
        
        const baseOptions = {
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--no-first-run',
                '--no-zygote',
                '--single-process',
                '--disable-extensions',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding',
                '--disable-features=TranslateUI',
                '--disable-ipc-flooding-protection'
            ]
        };

        if (executablePath) {
            baseOptions.executablePath = executablePath;
            console.log('Usando Chrome instalado en el sistema');
        } else {
            console.log('Usando navegador incluido con Puppeteer');
        }

        return baseOptions;
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
                console.log('Placeholders reemplazados exitosamente');
            } catch (error) {
                console.error('Error al reemplazar placeholders:', error);
                throw new Error(`Error al reemplazar placeholders: ${error.message}`);
            }

            // Launch browser with optimized configuration
            console.log('Iniciando navegador...');
            try {
                const launchOptions = await this.getLaunchOptions();
                browser = await puppeteer.launch(launchOptions);
                console.log('Navegador iniciado exitosamente');
            } catch (error) {
                console.error('Error al iniciar el navegador:', error);
                
                // Intentar con configuración mínima como fallback
                try {
                    console.log('Intentando con configuración mínima...');
                    browser = await puppeteer.launch({
                        headless: 'new',
                        args: ['--no-sandbox', '--disable-setuid-sandbox']
                    });
                    console.log('Navegador iniciado con configuración mínima');
                } catch (fallbackError) {
                    console.error('Error con configuración mínima:', fallbackError);
                    throw new Error(`No se pudo iniciar el navegador. Error: ${fallbackError.message}`);
                }
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

            // Set content with timeout
            console.log('Estableciendo contenido...');
            try {
                await page.setContent(htmlTemplate, {
                    waitUntil: 'networkidle0',
                    timeout: 30000 // 30 segundos de timeout
                });
                console.log('Contenido establecido correctamente');
            } catch (error) {
                console.error('Error al establecer contenido:', error);
                throw new Error(`Error al establecer contenido: ${error.message}`);
            }

            // Wait a bit for content to render
            try {
                await page.waitForTimeout(2000);
                console.log('Esperando renderizado del contenido...');
            } catch (error) {
                console.log('Timeout de espera completado');
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
                    },
                    timeout: 60000 // 60 segundos de timeout para generación
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
                    console.log('Navegador cerrado exitosamente');
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
