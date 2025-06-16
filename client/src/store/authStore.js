import { create } from 'zustand';
import { CLASSIFICATION_IDS } from '../config/classificationIds';

import {
   register, 
   login,
   getSubclassificationsById
   } from '../api/auth.api';


export const useAuthStore = create((set, get) => ({ 
  generos: [],
  roles: [],
  preguntas: [],
  loading: false,
  error: null,
  successMessage: null,
  isAuthenticated: !!localStorage.getItem('token'), 
  permisosUsuario: [], // Array de IDs de objetos permitidos

  // Cargar opciones del formulario
  fetchOpcionesRegistro: async () => {
    try {
      set({ loading: true });
     
      const [preguntasResponse, generosResponse, rolesResponse] = await Promise.all([
        getSubclassificationsById(CLASSIFICATION_IDS.PREGUNTAS),
        getSubclassificationsById(CLASSIFICATION_IDS.GENEROS),
        getSubclassificationsById(CLASSIFICATION_IDS.ROLES)
      ]);



      set({
        preguntas: preguntasResponse.data.data,
        generos: generosResponse.data.data,
        roles: rolesResponse.data.data,
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
      
      // Guardar los roles del usuario en localStorage
      const rolesUsuario = response.data.user.id_rol.id_rol;
      console.log('Roles del usuario al iniciar sesión:', rolesUsuario);
      localStorage.setItem('userRoles', JSON.stringify(rolesUsuario));
      
      set({
        loading: false,
        successMessage: `¡Bienvenido ${response.data.user.nombre} ${response.data.user.apellido}!`,
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

  // Cargar permisos del usuario
  cargarPermisosUsuario: async (rolesUsuario) => {
    try {
      set({ loading: true });
      
      console.log('=== CARGANDO PERMISOS ===');
      console.log('Roles del usuario recibidos:', rolesUsuario);
      
      // Obtener todos los roles
      const rolesResponse = await getSubclassificationsById(CLASSIFICATION_IDS.ROLES);
      const todosLosRoles = rolesResponse.data.data;
      console.log('Todos los roles disponibles:', todosLosRoles);

      // Filtrar solo los roles que tiene el usuario
      const rolesDelUsuario = todosLosRoles.filter(rol => 
        rolesUsuario.includes(rol.id.toString())
      );
      console.log('Roles del usuario filtrados:', rolesDelUsuario);

      // Extraer todos los objetos permitidos de los roles del usuario
      const objetosPermitidos = rolesDelUsuario.reduce((acc, rol) => {
        console.log('Procesando rol:', rol.nombre);
        console.log('Adicional del rol:', rol.adicional);
        if (rol.adicional && rol.adicional.id_objeto) {
          console.log('Objetos permitidos en este rol:', rol.adicional.id_objeto);
          // Convertir todos los IDs a números para mantener consistencia
          const objetosNumericos = rol.adicional.id_objeto.map(id => Number(id));
          return [...acc, ...objetosNumericos];
        }
        return acc;
      }, []);

      // Eliminar duplicados
      const objetosUnicos = [...new Set(objetosPermitidos)];
      console.log('Objetos permitidos finales (sin duplicados):', objetosUnicos);

      set({ 
        permisosUsuario: objetosUnicos,
        loading: false 
      });

      return objetosUnicos;
    } catch (error) {
      console.error('Error al cargar permisos:', error);
      set({ 
        loading: false, 
        error: 'Error al cargar los permisos del usuario.' 
      });
      return [];
    }
  },

  // Verificar si el usuario tiene acceso a un objeto específico
  tienePermiso: (idObjeto) => {
    const { permisosUsuario } = get();
    console.log('=== VERIFICANDO PERMISO ===');
    console.log('ID del objeto a verificar:', idObjeto);
    console.log('Permisos actuales del usuario:', permisosUsuario);
    // Asegurar que el ID del objeto sea un número
    const idObjetoNumerico = Number(idObjeto);
    console.log('¿Tiene permiso?:', permisosUsuario.includes(idObjetoNumerico));
    return permisosUsuario.includes(idObjetoNumerico);
  },

  // Verificar si el usuario tiene acceso a varios objetos
  tienePermisos: (idsObjetos) => {
    const { permisosUsuario } = get();
    return idsObjetos.every(id => permisosUsuario.includes(id));
  },

  // Verificar si se debe mostrar una clasificación basada en los permisos
  debeMostrarClasificacion: (clasificacion) => {
    const { tienePermiso } = get();
    
    // Mapeo de IDs de clasificación a sus permisos correspondientes
    const permisosPorClasificacion = {
      [CLASSIFICATION_IDS.GENEROS]: CLASSIFICATION_IDS.CF_GENEROS,
      [CLASSIFICATION_IDS.ESTADOS]: CLASSIFICATION_IDS.CF_ESTADOS,
      [CLASSIFICATION_IDS.MUNICIPIOS]: CLASSIFICATION_IDS.CF_MUNICIPIOS,
      [CLASSIFICATION_IDS.PARROQUIAS]: CLASSIFICATION_IDS.CF_PARROQUIAS,
      [CLASSIFICATION_IDS.ICONOS]: CLASSIFICATION_IDS.CF_ICONOS,
      [CLASSIFICATION_IDS.OBJETOS]: CLASSIFICATION_IDS.CF_OBJETOS,
      [CLASSIFICATION_IDS.PREGUNTAS]: CLASSIFICATION_IDS.CF_PREGUNTA,
      [CLASSIFICATION_IDS.ROLES]: CLASSIFICATION_IDS.CF_ROL
    };

    // Si la clasificación tiene un permiso asociado y el usuario lo tiene, no mostrarla
    const permisoAsociado = permisosPorClasificacion[clasificacion.id_clasificacion];
    if (permisoAsociado && tienePermiso(permisoAsociado)) {
      return false;
    }

    // Por defecto, mostrar la clasificación si no tiene type_id
    return clasificacion.type_id === null;
  },

  // Filtrar clasificaciones basadas en los permisos del usuario
  filtrarClasificacionesPorPermiso: (clasificaciones) => {
    return clasificaciones.filter(clasificacion => get().debeMostrarClasificacion(clasificacion));
  }
}));

export default useAuthStore;
