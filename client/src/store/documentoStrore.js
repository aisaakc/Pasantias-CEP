import { create } from 'zustand';
import {
  getAllDocumentos,
  getDocumentosByTipo,
  countDocumentos as apiCountDocumentos,

  uploadDocumento as apiUploadDocumento,
  uploadMultipleDocumentos as apiUploadMultipleDocumentos,
  createDocumento as apiCreateDocumento,
  updateDocumento as apiUpdateDocumento,
  updateDocumentoWithFile as apiUpdateDocumentoWithFile,
  deleteDocumento as apiDeleteDocumento,
  downloadDocumento as apiDownloadDocumento
} from '../api/documento.api';

const useDocumentoStore = create((set, get) => ({
  documentos: [],
  loading: false,
  error: null,
  total: 0,
  paginated: {
    data: [],
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  },

  // Obtener todos los documentos
  fetchDocumentos: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getAllDocumentos();
      set({ documentos: res.data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Obtener documentos por tipo
  fetchDocumentosByTipo: async (id_tipo) => {
    set({ loading: true, error: null });
    try {
      const res = await getDocumentosByTipo(id_tipo);
      set({ documentos: res.data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Contar documentos
  countDocumentos: async () => {
    set({ loading: true, error: null });
    try {
      const res = await apiCountDocumentos();
      set({ total: res.data.data.total, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

 

  // Subir archivo físico
  uploadDocumento: async (file, documentoData) => {
    set({ loading: true, error: null });
    try {
      const res = await apiUploadDocumento(file, documentoData);
      await get().fetchDocumentos();
      set({ loading: false });
      return res.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Subir múltiples archivos
  uploadMultipleDocumentos: async (files, documentoData) => {
    set({ loading: true, error: null });
    try {
      const res = await apiUploadMultipleDocumentos(files, documentoData);
      await get().fetchDocumentos();
      set({ loading: false });
      return res.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Crear documento (sin archivo físico)
  createDocumento: async (documentoData) => {
    set({ loading: true, error: null });
    try {
      const res = await apiCreateDocumento(documentoData);
      await get().fetchDocumentos();
      set({ loading: false });
      return res.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Actualizar documento
  updateDocumento: async (id, documentoData) => {
    set({ loading: true, error: null });
    try {
      const res = await apiUpdateDocumento(id, documentoData);
      await get().fetchDocumentos();
      set({ loading: false });
      return res.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Actualizar documento con archivo
  updateDocumentoWithFile: async (id, file, documentoData) => {
    set({ loading: true, error: null });
    try {
      const res = await apiUpdateDocumentoWithFile(id, file, documentoData);
      await get().fetchDocumentos();
      set({ loading: false });
      return res.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Eliminar documento
  deleteDocumento: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await apiDeleteDocumento(id);
      await get().fetchDocumentos();
      set({ loading: false });
      return res.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Descargar archivo (devuelve el blob)
  downloadDocumento: async (filename) => {
    set({ loading: true, error: null });
    try {
      const res = await apiDownloadDocumento(filename);
      set({ loading: false });
      return res.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Resetear error
  resetError: () => set({ error: null })
}));

export default useDocumentoStore;
