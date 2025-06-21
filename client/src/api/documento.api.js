import axios from "axios";

// Obtener todos los documentos
export const getAllDocumentos = async () => 
    axios.get('http://localhost:3001/api/documentos');

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
