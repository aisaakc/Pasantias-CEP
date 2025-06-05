import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Logo simple en SVG como base64
const defaultLogoBase64 = `data:image/svg+xml;base64,${Buffer.from(`
<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="#f0f0f0"/>
    <circle cx="50" cy="50" r="40" fill="#007bff"/>
    <text x="50" y="60" font-family="Arial" font-size="24" fill="white" text-anchor="middle">LOGO</text>
</svg>
`).toString('base64')}`;

async function generateDefaultLogo() {
    try {
        console.log('Generando logo por defecto...');
        
        // Asegurarse de que el directorio public/logos existe
        const logosDir = path.join(__dirname, '../public/logos');
        await fs.mkdir(logosDir, { recursive: true });
        
        // Guardar el logo base64 en un archivo
        const logoPath = path.join(logosDir, 'default-logo.txt');
        await fs.writeFile(logoPath, defaultLogoBase64, 'utf8');
        
        console.log('Logo por defecto generado exitosamente en:', logoPath);
    } catch (error) {
        console.error('Error al generar el logo por defecto:', error);
    }
}

generateDefaultLogo(); 