import { create } from 'zustand';  
import {

    getParentClassifications,
    create as createClasificacionAPI,
    update as updateClasificacionAPI,
    getAllClasificaciones,
    deleteClasificacion,
    getAllSubclasificaciones,


    } from '../api/clasificacion.api';
import { getAllCursosById } from '../api/curso.api';


export const useClasificacionStore = create((set, get) => ({
  // Estado inicial
  parentClasifications: [],    
  subClasificaciones: [],      
  clasificacionHijos: [],      
  allClasificaciones: [],      
  programas: [], // Nuevo estado para los programas

  loading: false,              
  error: null,                 
  currentClasificacion: null,  // Nuevo estado para almacenar la clasificación actual

  // Utilidades
  clearError: () => set({ error: null }),
  getClasificacionById: (id) => {
    const { allClasificaciones } = get();
    return allClasificaciones.find(c => c.id_clasificacion === id) || null;
  },

  // Obtener programas
  fetchProgramas: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getAllCursosById(4);
      if (response.data && response.data.success) {
        set({
          programas: response.data.data || [],
          loading: false,
        });
      } else {
        set({
          programas: [],
          loading: false,
        });
      }
    } catch (error) {
      console.error("Error al obtener programas:", error);
      set({
        loading: false,
        error: 'Error al obtener los programas.',
        programas: []
      });
    }
  },

  // Operaciones de lectura
  fetchParentClasifications: async () => {
   
    set({ loading: true, error: null });
    try {
      
      const response = await getParentClassifications();
 
      
      // Filtrar solo las clasificaciones principales (type_id === null)
      const parentClasifications = response.data.filter(c => c.type_id === null);
     
      
      set({
        parentClasifications: parentClasifications,
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
  fetchSubClasificaciones: async (id, id_parent) => {
    set({ loading: true, error: null });
    
    try {
      const response = await getAllSubclasificaciones(id, id_parent);
      set({
        subClasificaciones: response.data,
        loading: false,
      });
      return response; // Return the response
    } catch (error) {
      console.error("Error en fetchSubClasificaciones:", error);
      set({
        loading: false,
        error: 'Error al obtener las subclasificaciones.',
      });
      throw error; // Re-throw the error
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

  // Obtener todos los íconos
  // fetchIcons: async () => {
  //   set({ loading: true, error: null });
  //   try {
  //     const response = await getAllIcons();
  //     set({
  //       icons: response.data,
  //       loading: false,
  //     });
  //   } catch (error) {
  //     console.error("Error al obtener los íconos:", error);
  //     set({
  //       loading: false,
  //       error: 'Error al obtener los íconos.',
  //       icons: []
  //     });
  //   }
  // },

  // Operaciones de escritura
  createClasificacion: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await createClasificacionAPI(data);
      await updateStoreState(set);
     
      if (data.type_id) {
        const subResponse = await getAllSubclasificaciones(data.type_id);
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
      // Validar datos requeridos
      if (!data.nombre || !data.type_id) {
        throw new Error('El nombre y el tipo son campos requeridos');
      }

      const response = await createClasificacionAPI(data);
      
      // Actualizar las subclasificaciones inmediatamente después de crear una nueva
      if (data.type_id) {
        const subResponse = await getAllSubclasificaciones(data.type_id);
        set(state => ({
          ...state,
          subClasificaciones: subResponse.data,
          loading: false,
          error: null
        }));
      }
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Error al crear la subclasificación';
      set(state => ({
        ...state,
        loading: false,
        error: errorMessage
      }));
      throw error;
    }
  },

  updateClasificacion: async (id, data) => {
    set({ loading: true, error: null });
    try {
      // Validar datos requeridos
      if (!data.nombre) {
        throw new Error('El nombre es un campo requerido');
      }

      const response = await updateClasificacionAPI(id, data);
      
      // Actualizar el estado después de la actualización
      if (data.type_id) {
        const subResponse = await getAllSubclasificaciones(data.type_id, data.parent_id);
        set(state => ({
          ...state,
          subClasificaciones: subResponse.data,
          loading: false,
          error: null
        }));
      } else {
        // Si no es una subclasificación, actualizar las clasificaciones principales
        const parentResponse = await getParentClassifications();
        set(state => ({
          ...state,
          parentClasifications: parentResponse.data,
          loading: false,
          error: null
        }));
      }
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Error al actualizar la clasificación';
      set(state => ({
        ...state,
        loading: false,
        error: errorMessage
      }));
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
