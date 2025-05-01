import { create } from 'zustand';  // Cambia a esta forma de importar
import { getParentClassifications } from '../api/clasificacion.api'; // Asegúrate de importar la API

// Creamos el store de Zustand
export const useClasificacionStore = create((set) => ({
  parentClasifications: [],  // Para almacenar las clasificaciones principales
  loading: false,            // Para controlar el estado de carga
  error: null,               // Para manejar errores
  fetchParentClasifications: async () => {
    set({ loading: true, error: null }); // Iniciar carga

    try {
      const response = await getParentClassifications();
      set({
        parentClasifications: response.data, // Guardamos las clasificaciones en el estado
        loading: false, // Fin de carga
      });
    } catch (error) {
      console.error("Error en fetchParentClasifications:", error);
      set({
        loading: false,
        error: 'Error al obtener las clasificaciones principales.', // Guardamos el mensaje de error
      });
    }
  },

  clearError: () => set({ error: null }), // Función para limpiar el error
}));

export default useClasificacionStore;
