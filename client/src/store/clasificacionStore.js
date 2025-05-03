import { create } from 'zustand';  
import { getParentClassifications,
   getSubclasificaciones, 
   create as createClasificacionAPI,
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

  clearError: () => set({ error: null }),
}));

export default useClasificacionStore;
