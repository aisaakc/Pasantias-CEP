import axios from "axios";

// Obtener todos los documentos
export const getAllDocumentos = async () => 
    axios.get('http://localhost:3001/api/documentos');

// Obtener documentos por tipo
export const getDocumentosByTipo = async (id_tipo) => 
    axios.get(`http://localhost:3001/api/documentos/tipo/${id_tipo}`);

// Contar documentos
export const countDocumentos = async () => 
    axios.get('http://localhost:3001/api/documentos/count');


// Descargar archivo (devuelve el blob)
export const downloadDocumento = async (filename) => 
    axios.get(`http://localhost:3001/api/documentos/download/${filename}`, { responseType: 'blob' });

// Subir archivo físico
export const uploadDocumento = async (file, documentoData) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('id_tipo', documentoData.id_tipo);
    formData.append('fecha_hora', documentoData.fecha_hora);
    formData.append('descripcion', documentoData.descripcion);
    formData.append('nombre', documentoData.nombre);

    return axios.post('http://localhost:3001/api/documentos/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

// Subir múltiples archivos
export const uploadMultipleDocumentos = async (files, documentoData) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('id_tipo', documentoData.id_tipo);
    formData.append('fecha_hora', documentoData.fecha_hora);
    formData.append('descripcion', documentoData.descripcion);

    return axios.post('http://localhost:3001/api/documentos/upload-multiple', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

// Crear documento (sin archivo físico)
export const createDocumento = async (documentoData) => 
    axios.post('http://localhost:3001/api/documentos', documentoData);

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
    formData.append('nombre', documentoData.nombre);

    return axios.put(`http://localhost:3001/api/documentos/${id}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

// Eliminar documento
export const deleteDocumento = async (id) => 
    axios.delete(`http://localhost:3001/api/documentos/${id}`);

// Obtener documentos por un array de IDs
export const getDocumentosByIds = async (ids) => 
    axios.post('http://localhost:3001/api/documentos/by-ids', { ids });
