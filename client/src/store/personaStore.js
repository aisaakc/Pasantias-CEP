import { create } from 'zustand';

import { 
  getUsuarios,
  getRoles
} from '../api/persona.api';

const usePersonaStore = create((set) => ({
  usuarios: [],
  roles: [],
  loading: false,
  error: null,

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
  }
}));

export default usePersonaStore;
