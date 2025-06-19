import crypto from 'crypto';

// Función para generar un hash del nombre del archivo manteniendo la extensión
export function hashFileName(originalFileName) {
    try {
        if (!originalFileName) {
            throw new Error('Nombre de archivo no proporcionado');
        }

        // Separar el nombre del archivo de la extensión
        const lastDotIndex = originalFileName.lastIndexOf('.');
        let fileName, extension;

        if (lastDotIndex === -1) {
            // No hay extensión
            fileName = originalFileName;
            extension = '';
        } else {
            fileName = originalFileName.substring(0, lastDotIndex);
            extension = originalFileName.substring(lastDotIndex);
        }

        // Generar hash del nombre del archivo + timestamp para evitar colisiones
        const hash = crypto.createHash('md5').update(fileName + Date.now() + Math.random()).digest('hex');
        
        // Retornar el hash con la extensión original
        return hash + extension;
    } catch (error) {
        console.error('Error al hashear nombre de archivo:', error);
        throw error;
    }
}

// Función para validar tipos de archivo permitidos
export function isValidFileType(fileName) {
    const allowedExtensions = [
        '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
        '.txt', '.rtf', '.odt', '.ods', '.odp', '.csv', '.zip', '.rar',
        '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.mp4', '.avi',
        '.mp3', '.wav', '.flv', '.webm'
    ];

    const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    return allowedExtensions.includes(extension);
}

// Función para obtener la extensión de un archivo
export function getFileExtension(fileName) {
    const lastDotIndex = fileName.lastIndexOf('.');
    return lastDotIndex === -1 ? '' : fileName.substring(lastDotIndex).toLowerCase();
}

// Función para obtener el tipo MIME basado en la extensión
export function getMimeType(fileName) {
    const extension = getFileExtension(fileName);
    const mimeTypes = {
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.xls': 'application/vnd.ms-excel',
        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        '.ppt': 'application/vnd.ms-powerpoint',
        '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        '.txt': 'text/plain',
        '.rtf': 'application/rtf',
        '.odt': 'application/vnd.oasis.opendocument.text',
        '.ods': 'application/vnd.oasis.opendocument.spreadsheet',
        '.odp': 'application/vnd.oasis.opendocument.presentation',
        '.csv': 'text/csv',
        '.zip': 'application/zip',
        '.rar': 'application/x-rar-compressed',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.bmp': 'image/bmp',
        '.svg': 'image/svg+xml',
        '.mp4': 'video/mp4',
        '.avi': 'video/x-msvideo',
        '.mp3': 'audio/mpeg',
        '.wav': 'audio/wav',
        '.flv': 'video/x-flv',
        '.webm': 'video/webm'
    };

    return mimeTypes[extension] || 'application/octet-stream';
} 