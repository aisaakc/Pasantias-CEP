import { create } from 'zustand';  
import {
    getParentClassifications,
    create as createClasificacionAPI,
    update as updateClasificacionAPI,
    getAllClasificaciones,
    deleteClasificacion,
    getAllSubclasificaciones,
    getAllIcons as getAllIconsAPI
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

  // Nuevo estado global para iconos
  icons: [],
  iconsLoaded: false,
  iconsLoading: false,

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
      
      set({ 
        parentClasifications: response.data,
        loading: false 
      });
    } catch (error) {
      console.error("Error en fetchParentClasifications:", error);
      set({ 
        loading: false, 
        error: 'Error al obtener las clasificaciones principales.' 
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

  // Refrescar subclasificaciones sin cambiar el estado de loading (para evitar parpadeos)
  refreshSubClasificaciones: async (id, id_parent) => {
    try {
      const response = await getAllSubclasificaciones(id, id_parent);
      set(state => ({
        ...state,
        subClasificaciones: response.data,
      }));
      return response;
    } catch (error) {
      console.error("Error en refreshSubClasificaciones:", error);
      // No cambiar el estado de loading ni error para evitar parpadeos
      throw error;
    }
  },

  // Función directa para obtener subclasificaciones (para uso en componentes)
  getSubclasificaciones: async (id, id_parent) => {
    try {
      const response = await getAllSubclasificaciones(id, id_parent);
      return response;
    } catch (error) {
      console.error("Error en getSubclasificaciones:", error);
      throw error;
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
      // Mostrar todas las subclasificaciones del mismo type_id, no solo las del parent_id específico
      if (data.type_id) {
        const subResponse = await getAllSubclasificaciones(data.type_id, null);
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

  // Versión optimizada que no cambia el estado de loading (para evitar parpadeos)
  createSubclasificacionSilent: async (data) => {
    try {
      // Validar datos requeridos
      if (!data.nombre || !data.type_id) {
        throw new Error('El nombre y el tipo son campos requeridos');
      }

      const response = await createClasificacionAPI(data);
      
      // Actualizar las subclasificaciones sin cambiar el estado de loading
      // Mostrar todas las subclasificaciones del mismo type_id, no solo las del parent_id específico
      if (data.type_id) {
        const subResponse = await getAllSubclasificaciones(data.type_id, null);
        set(state => ({
          ...state,
          subClasificaciones: subResponse.data,
        }));
      }
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Error al crear la subclasificación';
      // No cambiar el estado de loading para evitar parpadeos
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
      // Mostrar todas las subclasificaciones del mismo type_id, no solo las del parent_id específico
      if (data.type_id) {
        const subResponse = await getAllSubclasificaciones(data.type_id, null);
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

  // Versión optimizada que no cambia el estado de loading (para evitar parpadeos)
  updateClasificacionSilent: async (id, data) => {
    try {
      // Validar datos requeridos
      if (!data.nombre) {
        throw new Error('El nombre es un campo requerido');
      }

      const response = await updateClasificacionAPI(id, data);
      
      // Actualizar el estado después de la actualización sin cambiar loading
      // Mostrar todas las subclasificaciones del mismo type_id, no solo las del parent_id específico
      if (data.type_id) {
        const subResponse = await getAllSubclasificaciones(data.type_id, null);
        set(state => ({
          ...state,
          subClasificaciones: subResponse.data,
        }));
      } else {
        // Si no es una subclasificación, actualizar las clasificaciones principales
        const parentResponse = await getParentClassifications();
        set(state => ({
          ...state,
          parentClasifications: parentResponse.data,
        }));
      }
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Error al actualizar la clasificación';
      // No cambiar el estado de loading para evitar parpadeos
      throw error;
    }
  },

  deleteClasificacion: async (id, typeId) => {
    set({ loading: true, error: null });
    try {
      await deleteClasificacion(id);
      
      // Si tenemos typeId, actualizar todas las subclasificaciones del mismo type_id
      if (typeId) {
        const subResponse = await getAllSubclasificaciones(typeId, null);
        set(state => ({
          ...state,
          subClasificaciones: subResponse.data,
          loading: false,
          error: null
        }));
      } else {
        // Si no tenemos typeId, actualizar todo el estado
        await updateStoreState(set);
      }
      
      return { success: true, message: 'Clasificación eliminada correctamente' };
    } catch (error) {
      handleError(set, error, 'Error al eliminar la clasificación.');
      throw error;
    }
  },

  // Versión silenciosa que no cambia el estado de loading (para evitar parpadeos)
  deleteClasificacionSilent: async (id, typeId, parentId) => {
    try {
      await deleteClasificacion(id);
      
      // Si tenemos typeId, actualizar todas las subclasificaciones del mismo type_id
      if (typeId) {
        const subResponse = await getAllSubclasificaciones(typeId, null);
        set(state => ({
          ...state,
          subClasificaciones: subResponse.data,
        }));
      } else {
        // Si no tenemos typeId, actualizar todo el estado sin cambiar loading
        const [allClasificacionesResponse, parentClasificationsResponse] = await Promise.all([
          getAllClasificaciones(),
          getParentClassifications()
        ]);
        
        set(state => ({
          ...state,
          allClasificaciones: allClasificacionesResponse.data,
          parentClasifications: parentClasificationsResponse.data,
        }));
      }
      
      return { success: true, message: 'Clasificación eliminada correctamente' };
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Error al eliminar la clasificación';
      // No cambiar el estado de loading para evitar parpadeos
      throw error;
    }
  },

  // Nuevos métodos para iconos
  setIconsLoading: (loading) => set({ iconsLoading: loading }),
  
  // Precargar iconos una sola vez
  preloadIcons: async () => {
    const { iconsLoaded, iconsLoading } = get();
    
    // Si ya están cargados o se están cargando, no hacer nada
    if (iconsLoaded || iconsLoading) {
      return;
    }

    set({ iconsLoading: true });
    
    try {
      const response = await getAllIconsAPI();
      set({ 
        icons: response.data, 
        iconsLoaded: true, 
        iconsLoading: false 
      });
      console.log('Iconos precargados exitosamente:', response.data.length, 'iconos');
    } catch (error) {
      console.error('Error al precargar iconos:', error);
      set({ 
        icons: [], 
        iconsLoaded: false, 
        iconsLoading: false 
      });
    }
  },

  // Obtener iconos (usa caché si está disponible)
  getIcons: () => {
    const { icons, iconsLoaded } = get();
    return iconsLoaded ? icons : [];
  },

  // Verificar si los iconos están cargados
  areIconsLoaded: () => {
    return get().iconsLoaded;
  },

  // Limpiar caché de iconos (útil para logout)
  clearIconsCache: () => {
    set({ 
      icons: [], 
      iconsLoaded: false, 
      iconsLoading: false 
    });
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
