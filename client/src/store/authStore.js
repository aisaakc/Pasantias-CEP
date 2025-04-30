import { create } from 'zustand';
import { getGeneros, getRoles, getPreguntas , register, login } from '../api/auth.api';  

export const useAuthStore = create((set) => ({
  
  generos: [],
  roles: [],
  preguntas: [],
  loading: false,
  error: null,
  successMessage: null,

  fetchOpcionesRegistro: async () => {
    try {
      set({ loading: true });
      
      const [generosResponse, rolesResponse, preguntasResponse] = await Promise.all([
        getGeneros(),
        getRoles(),
        getPreguntas()
      ]);

      set({
        generos: generosResponse.data,  
        roles: rolesResponse.data,
        preguntas: preguntasResponse.data,
        loading: false,
      });
    } catch (error) {
      console.error('Error al obtener las opciones:', error.message);
      set({ loading: false, error: 'Error al cargar las opciones de registro.' });
    }
  },

  registerUser: async (userData) => {
    set({ loading: true, error: null, successMessage: null });

    try {
      const response = await register(userData);  
      set({
        loading: false,
        successMessage: 'Usuario registrado con éxito.',
      });
    } catch (error) {
      console.error('Error en el registro:', error.message);
      set({
        loading: false,
        error: error.response?.data?.error || 'Error desconocido al registrar el usuario.',
      });
    }
  },

  loginUser: async (userAuth) => {
    set({ loading: true, error: null });

    try {
      const response = await login(userAuth);  // Llama a la API de login
      set({
        loading: false,
        successMessage: 'Inicio de sesión exitoso.',
      });
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.error || 'Error desconocido al iniciar sesión.',
      });
    }
  },


  clearMessages: () => set({ error: null, successMessage: null }),
}));

export default useAuthStore;
