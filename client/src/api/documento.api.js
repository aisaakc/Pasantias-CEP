import axios from "axios";

// Obtener todos los documentos
export const getAllDocumentos = async () => 
    axios.get('http://localhost:3001/api/documentos');

// Obtener documento por ID
export const getDocumentoById = async (id) => 
    axios.get(`http://localhost:3001/api/documentos/${id}`);

// Obtener documentos por tipo
export const getDocumentosByTipo = async (idTipo) => 
    axios.get(`http://localhost:3001/api/documentos/tipo/${idTipo}`);

// Crear nuevo documento
export const createDocumento = async (documentoData) => 
    axios.post('http://localhost:3001/api/documentos', documentoData);

// Subir archivo físico
export const uploadDocumento = async (file, documentoData) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('id_tipo', documentoData.id_tipo);
    formData.append('fecha_hora', documentoData.fecha_hora);
    formData.append('descripcion', documentoData.descripcion);

    return axios.post('http://localhost:3001/api/documentos/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

// Subir múltiples archivos
export const uploadMultipleDocumentos = async (files, documentoData) => {
    const formData = new FormData();
    
    files.forEach(file => {
        formData.append('files', file);
    });
    
    formData.append('id_tipo', documentoData.id_tipo);
    formData.append('fecha_hora', documentoData.fecha_hora);
    formData.append('descripcion', documentoData.descripcion);

    return axios.post('http://localhost:3001/api/documentos/upload-multiple', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

// Descargar archivo
export const downloadDocumento = async (filename) => 
    axios.get(`http://localhost:3001/api/documentos/download/${filename}`, {
        responseType: 'blob'
    });

// Actualizar documento
export const updateDocumento = async (id, documentoData) => 
    axios.put(`http://localhost:3001/api/documentos/${id}`, documentoData);

// Actualizar documento con archivo
export const updateDocumentoWithFile = async (id, file, documentoData) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('id_tipo', documentoData.id_tipo);
    formData.append('fecha_hora', documentoData.fecha_hora);
    formData.append('descripcion', documentoData.descripcion);

    return axios.put(`http://localhost:3001/api/documentos/${id}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

// Eliminar documento
export const deleteDocumento = async (id) => 
    axios.delete(`http://localhost:3001/api/documentos/${id}`);

// Contar total de documentos
export const countDocumentos = async () => 
    axios.get('http://localhost:3001/api/documentos/count');

// Obtener documentos con paginación
export const getDocumentosPaginated = async (page = 1, limit = 10) => 
    axios.get(`http://localhost:3001/api/documentos/paginated?page=${page}&limit=${limit}`);

// Buscar documentos por descripción
export const searchDocumentos = async (searchTerm) => 
    axios.get(`http://localhost:3001/api/documentos/search?search=${searchTerm}`);

// Función para crear documento con archivo (incluye hasheo automático)
export const createDocumentoWithFile = async (documentoData) => {
    try {
        // Validar que se proporcione un nombre de archivo
        if (!documentoData.originalFileName) {
            throw new Error('El nombre del archivo original es requerido');
        }

        // Validar campos obligatorios
        if (!documentoData.id_tipo || !documentoData.fecha_hora || !documentoData.descripcion) {
            throw new Error('Los campos id_tipo, fecha_hora y descripcion son obligatorios');
        }

        return await createDocumento(documentoData);
    } catch (error) {
        throw error;
    }
};

// Función para obtener estadísticas de documentos
export const getDocumentosStats = async () => {
    try {
        const [countResponse, allDocsResponse] = await Promise.all([
            countDocumentos(),
            getAllDocumentos()
        ]);

        const total = countResponse.data.data.total;
        const documentos = allDocsResponse.data.data;

        // Calcular estadísticas por tipo de archivo
        const statsByExtension = {};
        documentos.forEach(doc => {
            if (doc.url) {
                const extension = doc.url.split('.').pop()?.toLowerCase();
                if (extension) {
                    statsByExtension[extension] = (statsByExtension[extension] || 0) + 1;
                }
            }
        });

        return {
            total,
            statsByExtension,
            documentos
        };
    } catch (error) {
        throw error;
    }
};

// Función para validar tipo de archivo en el frontend
export const validateFileType = (fileName) => {
    const allowedExtensions = [
        '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
        '.txt', '.rtf', '.odt', '.ods', '.odp', '.csv', '.zip', '.rar',
        '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.mp4', '.avi',
        '.mp3', '.wav', '.flv', '.webm'
    ];

    const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    return allowedExtensions.includes(extension);
};

// Función para obtener el icono según el tipo de archivo
export const getFileIcon = (fileName) => {
    const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    
    const iconMap = {
        '.pdf': '📄',
        '.doc': '📝',
        '.docx': '📝',
        '.xls': '📊',
        '.xlsx': '📊',
        '.ppt': '📽️',
        '.pptx': '📽️',
        '.txt': '📄',
        '.rtf': '📄',
        '.odt': '📝',
        '.ods': '📊',
        '.odp': '📽️',
        '.csv': '📊',
        '.zip': '📦',
        '.rar': '📦',
        '.jpg': '🖼️',
        '.jpeg': '🖼️',
        '.png': '🖼️',
        '.gif': '🖼️',
        '.bmp': '🖼️',
        '.svg': '🖼️',
        '.mp4': '🎥',
        '.avi': '🎥',
        '.mp3': '🎵',
        '.wav': '🎵',
        '.flv': '🎥',
        '.webm': '🎥'
    };

    return iconMap[extension] || '📄';
};

// Función para formatear el tamaño de archivo
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Función para obtener documentos recientes
export const getDocumentosRecientes = async (limit = 5) => {
    try {
        const response = await getAllDocumentos();
        const documentos = response.data.data;
        
        // Ordenar por fecha_hora descendente y tomar los más recientes
        const recientes = documentos
            .sort((a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora))
            .slice(0, limit);
            
        return recientes;
    } catch (error) {
        throw error;
    }
};

// Función para obtener la URL completa del archivo
export const getFileUrl = (filename) => {
    return `http://localhost:3001/docs/${filename}`;
};

// Función para descargar archivo con nombre original
export const downloadFileWithOriginalName = async (filename, originalName) => {
    try {
        const response = await downloadDocumento(filename);
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = originalName || filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        throw error;
    }
};
