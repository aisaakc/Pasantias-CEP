import { create } from 'zustand';  
import { getParentClassifications, getSubclasificaciones } from '../api/clasificacion.api'; 

export const useClasificacionStore = create((set) => ({
  parentClasifications: [],  
  subClasificaciones: [],     // NUEVO: subclasificaciones
  loading: false,            
  error: null,               

  // Clasificaciones principales
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

  // NUEVO: obtener subclasificaciones por ID
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

  clearError: () => set({ error: null }), 
}));

export default useClasificacionStore;
