import { create } from 'zustand';  
import { getParentClassifications,
   getSubclasificaciones, 
   create as createClasificacionAPI,
   update as updateClasificacionAPI,
    getClasificacionHijos,
    getAllClasificaciones,
    deleteClasificacion
    } from '../api/clasificacion.api';

export const useClasificacionStore = create((set, get) => ({
  parentClasifications: [],  
  subClasificaciones: [],     
  clasificacionHijos: [],    
  allClasificaciones: [],    

  loading: false,            
  error: null,               

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

  // Actualizar clasificación
  updateClasificacion: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await updateClasificacionAPI(id, data);

      // Actualizar todos los estados necesarios
      const [allClasificacionesResponse, parentClasificationsResponse] = await Promise.all([
        getAllClasificaciones(),
        getParentClassifications()
      ]);

      set({
        allClasificaciones: allClasificacionesResponse.data,
        parentClasifications: parentClasificationsResponse.data,
        loading: false
      });

      return response.data;

    } catch (error) {
      console.error("Error al actualizar clasificación:", error);
      let errorMsg = 'Error al actualizar la clasificación.';
      if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      }
      set({ loading: false, error: errorMsg });
      throw error;
    }
  },

  // Crear clasificación
  createClasificacion: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await createClasificacionAPI(data);

      // Actualizar todos los estados necesarios
      const [allClasificacionesResponse, parentClasificationsResponse] = await Promise.all([
        getAllClasificaciones(),
        getParentClassifications()
      ]);

      set({
        allClasificaciones: allClasificacionesResponse.data,
        parentClasifications: parentClasificationsResponse.data,
        loading: false
      });

      return response.data;
    } catch (error) {
      console.error("Error al crear clasificación:", error);
      let errorMsg = 'Error al crear la clasificación.';
      if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      }
      set({ loading: false, error: errorMsg });
      throw error;
    }
  },

  // Crear subclasificación
  createSubclasificacion: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await createClasificacionAPI(data);

      // Actualizar la lista de subclasificaciones
      const currentState = get();
      set({
        subClasificaciones: [...currentState.subClasificaciones, response.data],
        loading: false
      });

      return response.data;
    } catch (error) {
      console.error("Error al crear subclasificación:", error);
      let errorMsg = 'Error al crear la subclasificación.';
      if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      }
      set({ loading: false, error: errorMsg });
      throw error;
    }
  },

  clearError: () => set({ error: null }),

  // Eliminar clasificación
  deleteClasificacion: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteClasificacion(id);

      // Actualizar todos los estados necesarios
      const [allClasificacionesResponse, parentClasificationsResponse] = await Promise.all([
        getAllClasificaciones(),
        getParentClassifications()
      ]);

      set({
        allClasificaciones: allClasificacionesResponse.data,
        parentClasifications: parentClasificationsResponse.data,
        loading: false
      });

      return { success: true, message: 'Clasificación eliminada correctamente' };

    } catch (error) {
      console.error("Error al eliminar clasificacion en el store:", error);
      let errorMsg = 'Error al eliminar la clasificación.';
      if (error.response?.data?.error){
        errorMsg = error.response.data.error;
      }
      set({ loading: false, error: errorMsg });
      throw error;
    }
  },
}));

export default useClasificacionStore;
