import { create } from 'zustand';

import { 
  getUsuarios,
  getRoles,
  CreateUsers,
  updateUser,
  deleteUser
} from '../api/persona.api';
import { getSubclassificationsById } from '../api/auth.api';
import { CLASSIFICATION_IDS } from '../config/classificationIds';

const usePersonaStore = create((set, get) => ({
  usuarios: [],
  roles: [],
  preguntas: [],
  generos: [],
  rolesClasificacion: [],
  prefijosTelefonicos: [],
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
    console.log('Creando usuario:', userData);
    set({ loading: true, error: null });
    try {
      const response = await CreateUsers(userData);
      console.log('Usuario creado exitosamente:', response.data);
      // Actualizar la lista de usuarios después de crear uno nuevo
      const usuariosResponse = await getUsuarios();
      console.log('Lista de usuarios actualizada después de crear:', usuariosResponse.data.data.length);
      set({ 
        usuarios: usuariosResponse.data.data, 
        loading: false 
      });
      return response.data;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      set({ 
        error: error.response?.data?.message || error.message, 
        loading: false 
      });
      throw error;
    }
  },

  // Actualizar usuario
  updateUserStore: async (id, userData) => {
    console.log('Actualizando usuario:', id, userData);
    set({ loading: true, error: null });
    try {
      const response = await updateUser(id, userData);
      console.log('Usuario actualizado exitosamente:', response.data);
      // Actualizar la lista de usuarios después de actualizar uno
      const usuariosResponse = await getUsuarios();
      console.log('Lista de usuarios actualizada después de editar:', usuariosResponse.data.data.length);
      set({ 
        usuarios: usuariosResponse.data.data, 
        loading: false 
      });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      set({ 
        error: error.response?.data?.message || error.message, 
        loading: false 
      });
      throw error;
    }
  },

  // Eliminar usuario
  deleteUserStore: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await deleteUser(id);
      // Actualizar la lista de usuarios después de eliminar uno
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

    console.log('Ejecutando fetchSubclasificaciones...');
    set({ loading: true, error: null });
    try {
      const [preguntasResponse, generosResponse, rolesResponse, prefijosResponse] = await Promise.all([
        getSubclassificationsById(CLASSIFICATION_IDS.PREGUNTAS),
        getSubclassificationsById(CLASSIFICATION_IDS.GENEROS),
        getSubclassificationsById(CLASSIFICATION_IDS.ROLES),
        getSubclassificationsById(CLASSIFICATION_IDS.PREFIJOS_TLF)
      ]);

      console.log('Prefijos obtenidos:', prefijosResponse.data.data);

      set({
        preguntas: preguntasResponse.data.data,
        generos: generosResponse.data.data,
        rolesClasificacion: rolesResponse.data.data,
        prefijosTelefonicos: prefijosResponse.data.data,
        loading: false,
        dataLoaded: true
      });
    } catch (error) {
      console.error('Error en fetchSubclasificaciones:', error);
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
