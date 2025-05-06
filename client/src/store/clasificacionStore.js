import { create } from 'zustand';  
import { getParentClassifications,
   getSubclasificaciones, 
   create as createClasificacionAPI,
   update as updateClasificacionAPI,
    getClasificacionHijos,
    getAllClasificaciones,
    deleteClasificacion
    } from '../api/clasificacion.api';

/**
 * Store de Zustand para manejar el estado de las clasificaciones
 * Incluye funciones para gestionar clasificaciones, subclasificaciones y sus relaciones
 */
export const useClasificacionStore = create((set, get) => ({
  // Estado inicial
  parentClasifications: [],    // Clasificaciones padre
  subClasificaciones: [],      // Subclasificaciones
  clasificacionHijos: [],      // Hijos de una clasificación
  allClasificaciones: [],      // Todas las clasificaciones
  loading: false,              // Estado de carga
  error: null,                 // Estado de error

  // Utilidades
  clearError: () => set({ error: null }),

  // Operaciones de lectura
  fetchParentClasifications: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getParentClassifications();
      set({
        parentClasifications: response.data,
        loading: false,
      });
    } catch (error) {
      console.error("Error en fetchParentClasifications:", error);
      set({
        loading: false,
        error: 'Error al obtener las clasificaciones principales.',
      });
    }
  },

  fetchClasificacionById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await getClasificacionById(id);
      set({ clasificacionById: response.data, loading: false });
    } catch (error) {
      console.error("Error en fetchClasificacionById:", error);
      set({
        loading: false,
        error: 'Error al obtener la clasificación por ID.',
      });
    }
  },

  // Obtener subclasificaciones
  fetchSubClasificaciones: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await getSubclasificaciones(id);
      set({
        subClasificaciones: response.data,
        loading: false,
      });
    } catch (error) {
      console.error("Error en fetchSubClasificaciones:", error);
      set({
        loading: false,
        error: 'Error al obtener las subclasificaciones.',
      });
    }
  },

  // Obtener hijos de una clasificación
  fetchClasificacionHijos: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await getClasificacionHijos(id);
      set({
        clasificacionHijos: response.data,
        loading: false,
      });
    } catch (error) {
      console.error("Error al obtener los hijos de la clasificación:", error);
      set({
        loading: false,
        error: 'Error al obtener los hijos de la clasificación.',
      });
    }
  },

  // Obtener todas las clasificaciones
  fetchAllClasificaciones: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getAllClasificaciones();
      set({
        allClasificaciones: response.data,
        loading: false,
      });
    } catch (error) {
      console.error("Error al obtener todas las clasificaciones:", error);
      set({
        loading: false,
        error: 'Error al obtener todas las clasificaciones.',
      });
    }
  },

  // Operaciones de escritura
  createClasificacion: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await createClasificacionAPI(data);
      await updateStoreState(set);
      // Si la clasificación tiene un type_id, actualizar las subclasificaciones
      if (data.type_id) {
        const subResponse = await getSubclasificaciones(data.type_id);
        set(state => ({
          ...state,
          subClasificaciones: subResponse.data
        }));
      }
      return response.data;
    } catch (error) {
      handleError(set, error, 'Error al crear la clasificación.');
      throw error;
    }
  },

  createSubclasificacion: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await createClasificacionAPI(data);
      // Actualizar las subclasificaciones inmediatamente después de crear una nueva
      if (data.type_id) {
        const subResponse = await getSubclasificaciones(data.type_id);
        set(state => ({
          ...state,
          subClasificaciones: subResponse.data,
          loading: false
        }));
      }
      return response.data;
    } catch (error) {
      handleError(set, error, 'Error al crear la subclasificación.');
      throw error;
    }
  },

  updateClasificacion: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await updateClasificacionAPI(id, data);
      await updateStoreState(set);
      return response.data;
    } catch (error) {
      handleError(set, error, 'Error al actualizar la clasificación.');
      throw error;
    }
  },

  deleteClasificacion: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteClasificacion(id);
      await updateStoreState(set);
      return { success: true, message: 'Clasificación eliminada correctamente' };
    } catch (error) {
      handleError(set, error, 'Error al eliminar la clasificación.');
      throw error;
    }
  },
}));

// Funciones auxiliares
const updateStoreState = async (set) => {
  const [allClasificacionesResponse, parentClasificationsResponse] = await Promise.all([
    getAllClasificaciones(),
    getParentClassifications()
  ]);

  set({
    allClasificaciones: allClasificacionesResponse.data,
    parentClasifications: parentClasificationsResponse.data,
    loading: false
  });
};

const handleError = (set, error, defaultMessage) => {
  console.error("Error en la operación:", error);
  const errorMsg = error.response?.data?.error || defaultMessage;
  set({ loading: false, error: errorMsg });
};

export default useClasificacionStore;
