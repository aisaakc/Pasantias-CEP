import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templateContent = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificado de Curso</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f0f0f0;
        }

        .certificate-container {
            width: 1000px;
            height: 700px;
            background-color: #fff;
            border: 10px solid #a8a8a8;
            padding: 40px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            display: flex;
            position: relative;
            flex-wrap: wrap;
            align-content: space-between;
        }
        .logo-section {
            width: 150px;
            padding-right: 20px;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            border-right: 1px solid #ccc;
            flex-shrink: 0;
        }
        .logo-section img {
            max-width: 100%;
            height: auto;
        }
        .content-section {
            flex-grow: 1;
            padding-left: 40px;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        h1 {
            font-size: 3.2em;
            color: #333;
            margin-bottom: 20px;
        }
        h2 {
            font-size: 2em;
            color: #555;
            margin-bottom: 10px;
        }
        p {
            font-size: 1.3em;
            margin-bottom: 10px;
            line-height: 1.5;
        }
        .participant-name {
            font-size: 3em;
            font-weight: bold;
            color: #007bff;
            margin: 20px 0;
            text-transform: uppercase;
        }
        .course-name {
            font-size: 2.2em;
            font-weight: bold;
            color: #28a745;
            margin-bottom: 30px;
        }
        .date {
            font-size: 1.2em;
            color: #666;
            margin-top: 20px;
        }
        .signatures {
            display: flex;
            justify-content: space-around;
            margin-top: 50px;
            width: 100%;
        }
        .signature-block {
            text-align: center;
            width: 45%;
        }
        .signature-line {
            border-top: 1px solid #000;
            margin-top: 60px;
            padding-top: 5px;
        }
        .facilitator-title, .institution-title {
            font-size: 1.2em;
            font-weight: bold;
            margin-top: 10px;
        }
        .location-date {
            font-size: 1.1em;
            color: #777;
            margin-top: 40px;
        }

        @media print {
            @page {
                size: A4 landscape;
                margin: 0;
            }
            body {
                margin: 0;
                padding: 0;
                background-color: #fff;
                display: block;
            }
            .certificate-container {
                width: 29.7cm;
                height: 21cm;
                border: none;
                box-shadow: none;
                margin: 0;
                padding: 2cm;
                position: absolute;
                top: 0;
                left: 0;
            }
            h1 { font-size: 2.8em; }
            h2 { font-size: 1.6em; }
            p { font-size: 1.1em; }
            .participant-name { font-size: 2.5em; }
            .course-name { font-size: 1.9em; }
            .facilitator-title, .institution-title { font-size: 1em; }
            .location-date { font-size: 0.9em; }
            .signatures { margin-top: 40px; }
            .signature-line { margin-top: 50px; }
        }
    </style>
</head>
<body>
    <div class="certificate-container">
        <div class="logo-section">
            <img src="tu_logo.png" alt="Logo de la Institución">
        </div>
        <div class="content-section">
            <div>
                <h1>CERTIFICADO DE CULMINACIÓN</h1>
                <p>Se otorga el presente certificado a:</p>
                <p class="participant-name">FULANITO DE TAL</p>
                <p>Por haber culminado satisfactoriamente el curso:</p>
                <p class="course-name">CONSTRUCCIÓN SIN ESFUERZO DE PÁGINAS WEB</p>
                <p>Impartido por [Nombre de la Institución/Organización] durante el período de [Fecha de Inicio] a [Fecha de Fin], con una duración total de [Número] horas.</p>
            </div>
            <div class="location-date">
                <p>Expedido en [Ciudad], a los [Día] días del mes de [Mes] del año [Año].</p>
            </div>
            <div class="signatures">
                <div class="signature-block">
                    <div class="signature-line"></div>
                    <p class="facilitator-title">__________________________</p>
                    <p class="facilitator-title">Firma del Facilitador/Instructor</p>
                    <p>[Nombre del Facilitador]</p>
                </div>
                <div class="signature-block">
                    <div class="signature-line"></div>
                    <p class="institution-title">__________________________</p>
                    <p class="institution-title">Firma de la Dirección/Institución</p>
                    <p>[Nombre del Director/Representante]</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;

async function copyTemplate() {
    try {
        console.log('Copiando template...');
        
        // Asegurarse de que el directorio templates existe
        const templatesDir = path.join(__dirname, '../templates');
        await fs.mkdir(templatesDir, { recursive: true });
        
        // Escribir el template
        const templatePath = path.join(templatesDir, 'certificate.html');
        await fs.writeFile(templatePath, templateContent, 'utf8');
        
        console.log('Template copiado exitosamente a:', templatePath);
    } catch (error) {
        console.error('Error al copiar el template:', error);
    }
}

copyTemplate(); 