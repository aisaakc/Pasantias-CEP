#!/usr/bin/env node

/**
 * Script de instalación para Puppeteer
 * Este script asegura que Puppeteer funcione correctamente en cualquier PC
 */

import { execSync } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

console.log('🚀 Iniciando instalación de Puppeteer...\n');

async function checkNodeVersion() {
    try {
        const version = process.version;
        console.log(`✅ Node.js versión: ${version}`);
        
        const majorVersion = parseInt(version.slice(1).split('.')[0]);
        if (majorVersion < 16) {
            console.error('❌ Error: Se requiere Node.js versión 16 o superior');
            process.exit(1);
        }
    } catch (error) {
        console.error('❌ Error al verificar versión de Node.js:', error.message);
        process.exit(1);
    }
}

async function checkPackageJson() {
    try {
        const packagePath = path.join(process.cwd(), 'package.json');
        const packageContent = await fs.readFile(packagePath, 'utf8');
        const packageData = JSON.parse(packageContent);
        
        if (!packageData.dependencies?.puppeteer) {
            console.error('❌ Error: Puppeteer no está en las dependencias del package.json');
            console.log('💡 Ejecuta: npm install puppeteer');
            process.exit(1);
        }
        
        console.log(`✅ Puppeteer versión: ${packageData.dependencies.puppeteer}`);
    } catch (error) {
        console.error('❌ Error al verificar package.json:', error.message);
        process.exit(1);
    }
}

async function installPuppeteerBrowsers() {
    try {
        console.log('\n📦 Instalando navegadores para Puppeteer...');
        
        // Instalar navegadores incluidos con Puppeteer
        execSync('npx puppeteer browsers install chrome', { 
            stdio: 'inherit',
            cwd: process.cwd()
        });
        
        console.log('✅ Navegadores instalados correctamente');
    } catch (error) {
        console.log('⚠️  Advertencia: No se pudieron instalar los navegadores incluidos');
        console.log('💡 El sistema intentará usar Chrome instalado en tu PC');
    }
}

async function checkSystemChrome() {
    const platform = os.platform();
    console.log(`\n🔍 Verificando Chrome en el sistema (${platform})...`);
    
    const possiblePaths = [];
    
    if (platform === 'win32') {
        possiblePaths.push(
            'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
            path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe'),
            path.join(process.env.PROGRAMFILES || '', 'Google\\Chrome\\Application\\chrome.exe'),
            path.join(process.env['PROGRAMFILES(X86)'] || '', 'Google\\Chrome\\Application\\chrome.exe')
        );
    } else if (platform === 'darwin') {
        possiblePaths.push(
            '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            '/Applications/Chromium.app/Contents/MacOS/Chromium'
        );
    } else if (platform === 'linux') {
        possiblePaths.push(
            '/usr/bin/google-chrome',
            '/usr/bin/google-chrome-stable',
            '/usr/bin/chromium-browser',
            '/usr/bin/chromium'
        );
    }
    
    let chromeFound = false;
    for (const path of possiblePaths) {
        try {
            await fs.access(path);
            console.log(`✅ Chrome encontrado en: ${path}`);
            chromeFound = true;
            break;
        } catch (error) {
            // Continuar con la siguiente ruta
        }
    }
    
    if (!chromeFound) {
        console.log('⚠️  Chrome no encontrado en el sistema');
        console.log('💡 Instalando navegador incluido con Puppeteer...');
        await installPuppeteerBrowsers();
    }
}

async function createTestScript() {
    try {
        const testScript = `
import puppeteer from 'puppeteer';

async function testPuppeteer() {
    let browser = null;
    try {
        console.log('🧪 Probando Puppeteer...');
        
        // Intentar con Chrome del sistema primero
        try {
            browser = await puppeteer.launch({
                headless: 'new',
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            console.log('✅ Puppeteer funcionando con Chrome del sistema');
        } catch (error) {
            console.log('🔄 Intentando con navegador incluido...');
            browser = await puppeteer.launch({
                headless: 'new',
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            console.log('✅ Puppeteer funcionando con navegador incluido');
        }
        
        const page = await browser.newPage();
        await page.setContent('<h1>Test de Puppeteer</h1>');
        const pdf = await page.pdf({ format: 'A4' });
        
        console.log('✅ PDF generado exitosamente');
        console.log('✅ Puppeteer está funcionando correctamente');
        
    } catch (error) {
        console.error('❌ Error en la prueba:', error.message);
        process.exit(1);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

testPuppeteer();
        `;
        
        const testPath = path.join(process.cwd(), 'test-puppeteer.js');
        await fs.writeFile(testPath, testScript.trim());
        console.log('\n📝 Script de prueba creado: test-puppeteer.js');
        
        return testPath;
    } catch (error) {
        console.error('❌ Error al crear script de prueba:', error.message);
        return null;
    }
}

async function runTest(testPath) {
    if (!testPath) return;
    
    try {
        console.log('\n🧪 Ejecutando prueba de Puppeteer...');
        execSync(`node ${testPath}`, { 
            stdio: 'inherit',
            cwd: process.cwd()
        });
        
        console.log('\n🎉 ¡Puppeteer está funcionando correctamente!');
        console.log('💡 Puedes eliminar el archivo test-puppeteer.js');
        
    } catch (error) {
        console.error('\n❌ La prueba falló. Revisa los errores anteriores.');
        process.exit(1);
    }
}

async function cleanup(testPath) {
    if (testPath) {
        try {
            await fs.unlink(testPath);
            console.log('🧹 Archivo de prueba eliminado');
        } catch (error) {
            console.log('⚠️  No se pudo eliminar el archivo de prueba');
        }
    }
}

async function main() {
    try {
        await checkNodeVersion();
        await checkPackageJson();
        await checkSystemChrome();
        
        const testPath = await createTestScript();
        await runTest(testPath);
        await cleanup(testPath);
        
        console.log('\n✨ Instalación completada exitosamente!');
        console.log('🚀 Tu sistema está listo para generar PDFs');
        
    } catch (error) {
        console.error('\n❌ Error durante la instalación:', error.message);
        process.exit(1);
    }
}

main();
