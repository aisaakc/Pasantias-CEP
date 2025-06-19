import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { hashFileName, isValidFileType } from '../utils/hashUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configurar el almacenamiento
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Guardar en la carpeta docs del backend
        const uploadPath = path.join(__dirname, '..', 'docs');
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Generar nombre hasheado manteniendo la extensión
        const hashedName = hashFileName(file.originalname);
        cb(null, hashedName);
    }
});

// Filtro para validar tipos de archivo
const fileFilter = (req, file, cb) => {
    if (isValidFileType(file.originalname)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no permitido'), false);
    }
};

// Configurar multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB máximo
    }
});

// Middleware para subir un solo archivo
export const uploadSingle = upload.single('file');

// Middleware para subir múltiples archivos
export const uploadMultiple = upload.array('files', 5); // Máximo 5 archivos

// Middleware personalizado para manejar errores de multer
export const handleUploadError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'El archivo es demasiado grande. Máximo 10MB'
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Demasiados archivos. Máximo 5 archivos'
            });
        }
        return res.status(400).json({
            success: false,
            message: 'Error al subir el archivo'
        });
    }
    
    if (error.message === 'Tipo de archivo no permitido') {
        return res.status(400).json({
            success: false,
            message: 'Tipo de archivo no permitido'
        });
    }
    
    next(error);
};

// Función para obtener la ruta relativa del archivo
export const getFileUrl = (filename) => {
    return `/docs/${filename}`;
};

// Función para obtener la ruta absoluta del archivo
export const getFilePath = (filename) => {
    return path.join(__dirname, '..', 'docs', filename);
}; 