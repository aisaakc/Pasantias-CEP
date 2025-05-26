import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const useUserStore = create((set) => ({
  usuarios: [],
  loading: false,
  error: null,

  fetchUsuarios: async () => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/usuarios`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const usuarios = Array.isArray(response.data) ? response.data : [];
      set({ usuarios, loading: false });
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      set({ 
        error: error.response?.data?.error || 'Error al cargar los usuarios',
        loading: false,
        usuarios: []
      });
    }
  },

  deleteUsuario: async (id) => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/usuarios/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      set(state => ({
        usuarios: state.usuarios.filter(user => user.id_persona !== id),
        loading: false
      }));
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      set({ 
        error: error.response?.data?.error || 'Error al eliminar el usuario',
        loading: false 
      });
    }
  }
}));

export default useUserStore; 