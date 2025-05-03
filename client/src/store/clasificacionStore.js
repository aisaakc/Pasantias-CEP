import { create } from 'zustand';  
import { getParentClassifications,
   getSubclasificaciones, 
   create as createClasificacionAPI,
   update as updateClasificacionAPI,
    getClasificacionHijos,
     getAllClasificaciones } from '../api/clasificacion.api';

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

  // Crear clasificación
  createClasificacion: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await createClasificacionAPI(data);

      // Opcional: recargar clasificaciones principales
      const updatedList = await getParentClassifications();
      set({
        parentClasifications: updatedList.data,
        loading: false,
      });
    } catch (error) {
      console.error("Error al crear clasificación:", error);
      let errorMsg = 'Error al crear la clasificación.';
      if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      }
      set({ loading: false, error: errorMsg });
    }
  },

  // Actualizar clasificación
  updateClasificacion: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await updateClasificacionAPI(id, data);

      // Actualizar el estado local inmediatamente
      const currentState = get();
      
      // Actualizar en subClasificaciones si existe
      if (currentState.subClasificaciones.length > 0) {
        const updatedSubClasificaciones = currentState.subClasificaciones.map(item =>
          item.id_clasificacion === id ? { ...item, ...response.data.data } : item
        );
        set({ subClasificaciones: updatedSubClasificaciones });
      }

      // Actualizar en allClasificaciones si existe
      if (currentState.allClasificaciones.length > 0) {
        const updatedAllClasificaciones = currentState.allClasificaciones.map(item =>
          item.id_clasificacion === id ? { ...item, ...response.data.data } : item
        );
        set({ allClasificaciones: updatedAllClasificaciones });
      }

      // Actualizar en parentClasifications si existe
      if (currentState.parentClasifications.length > 0) {
        const updatedParentClasifications = currentState.parentClasifications.map(item =>
          item.id_clasificacion === id ? { ...item, ...response.data.data } : item
        );
        set({ parentClasifications: updatedParentClasifications });
      }

      set({ loading: false });
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

  clearError: () => set({ error: null }),
}));

export default useClasificacionStore;
