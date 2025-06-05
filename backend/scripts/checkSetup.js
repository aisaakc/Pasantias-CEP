import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function checkSetup() {
    try {
        console.log('Verificando configuración...');
        
        // Verificar directorio templates
        const templatesDir = path.join(__dirname, '../templates');
        try {
            await fs.access(templatesDir);
            console.log('✓ Directorio templates existe');
        } catch (error) {
            console.log('✗ Directorio templates no existe, creándolo...');
            await fs.mkdir(templatesDir, { recursive: true });
            console.log('✓ Directorio templates creado');
        }

        // Verificar archivo de template
        const templatePath = path.join(templatesDir, 'certificate.html');
        try {
            await fs.access(templatePath);
            console.log('✓ Archivo certificate.html existe');
        } catch (error) {
            console.log('✗ Archivo certificate.html no existe');
            console.log('Por favor, copia el archivo de template a:', templatePath);
        }

        // Verificar directorio para logos
        const logosDir = path.join(__dirname, '../public/logos');
        try {
            await fs.access(logosDir);
            console.log('✓ Directorio logos existe');
        } catch (error) {
            console.log('✗ Directorio logos no existe, creándolo...');
            await fs.mkdir(logosDir, { recursive: true });
            console.log('✓ Directorio logos creado');
        }

        console.log('\nVerificación completada.');
    } catch (error) {
        console.error('Error durante la verificación:', error);
    }
}

checkSetup(); 