import { create } from 'zustand';
import { getGeneros, getRoles, getPreguntas, register, login } from '../api/auth.api';

export const useAuthStore = create((set) => ({
  generos: [],
  roles: [],
  preguntas: [],
  loading: false,
  error: null,
  successMessage: null,
  isAuthenticated: !!localStorage.getItem('token'), // verifica si ya hay token

  // Cargar opciones del formulario
  fetchOpcionesRegistro: async () => {
    try {
      set({ loading: true });
      const [generosResponse, rolesResponse, preguntasResponse] = await Promise.all([
        getGeneros(),
        getRoles(),
        getPreguntas(),
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

  // Registro de usuario
  registerUser: async (userData) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      await register(userData);
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

  // Login
  loginUser: async (userAuth) => {
    set({ loading: true, error: null });
    try {
      const response = await login(userAuth);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      set({
        loading: false,
        successMessage: 'Inicio de sesión exitoso.',
        isAuthenticated: true,
      });
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.error || 'Error desconocido al iniciar sesión.',
        isAuthenticated: false,
      });
    }
  },

  // Logout
  logoutUser: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({
      successMessage: null,
      error: null,
      loading: false,
      isAuthenticated: false,
    });
  },

  // Limpiar mensajes
  clearMessages: () => set({ error: null, successMessage: null }),
}));

export default useAuthStore;
