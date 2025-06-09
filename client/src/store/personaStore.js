import { create } from 'zustand';

import { 
  getUsuarios,
  getRoles,
  CreateUsers,
  updateUser
} from '../api/persona.api';
import { getSubclassificationsById } from '../api/auth.api';
import { CLASSIFICATION_IDS } from '../config/classificationIds';

const usePersonaStore = create((set, get) => ({
  usuarios: [],
  roles: [],
  preguntas: [],
  generos: [],
  rolesClasificacion: [],
  loading: false,
  error: null,
  dataLoaded: false,

  // Obtener usuarios
  fetchUsuarios: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getUsuarios();
      set({ usuarios: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Obtener roles
  fetchRoles: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getRoles();
      set({ roles: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Crear usuario
  createUser: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await CreateUsers(userData);
      // Actualizar la lista de usuarios después de crear uno nuevo
      const usuariosResponse = await getUsuarios();
      set({ 
        usuarios: usuariosResponse.data.data, 
        loading: false 
      });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || error.message, 
        loading: false 
      });
      throw error;
    }
  },

  // Actualizar usuario
  updateUser: async (id, userData) => {
    set({ loading: true, error: null });
    try {
      const response = await updateUser(id, userData);
      // Actualizar la lista de usuarios después de actualizar uno
      const usuariosResponse = await getUsuarios();
      set({ 
        usuarios: usuariosResponse.data.data, 
        loading: false 
      });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || error.message, 
        loading: false 
      });
      throw error;
    }
  },

  // Obtener todas las subclasificaciones
  fetchSubclasificaciones: async () => {
    // Si los datos ya están cargados, no hacer nada
    if (get().dataLoaded) return;

    set({ loading: true, error: null });
    try {
      const [preguntasResponse, generosResponse, rolesResponse] = await Promise.all([
        getSubclassificationsById(CLASSIFICATION_IDS.PREGUNTAS),
        getSubclassificationsById(CLASSIFICATION_IDS.GENEROS),
        getSubclassificationsById(CLASSIFICATION_IDS.ROLES)
      ]);

      set({
        preguntas: preguntasResponse.data.data,
        generos: generosResponse.data.data,
        rolesClasificacion: rolesResponse.data.data,
        loading: false,
        dataLoaded: true
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || error.message, 
        loading: false 
      });
      throw error;
    }
  },

  // Resetear el estado de carga
  resetDataLoaded: () => {
    set({ dataLoaded: false });
  }
}));

export default usePersonaStore;
