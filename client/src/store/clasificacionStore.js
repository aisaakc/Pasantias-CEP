import { create } from 'zustand';  
import { getParentClassifications } from '../api/clasificacion.api'; 

export const useClasificacionStore = create((set) => ({
  parentClasifications: [],  
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

  clearError: () => set({ error: null }), 
}));

export default useClasificacionStore;
