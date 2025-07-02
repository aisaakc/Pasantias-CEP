import { create } from 'zustand';
import { CLASSIFICATION_IDS } from '../config/classificationIds';

import {
   register, 
   login,
   getSubclassificationsById
   } from '../api/auth.api';
import { getRoles } from '../api/persona.api';
import useClasificacionStore from './clasificacionStore';

export const useAuthStore = create((set, get) => ({ 
  generos: [],
  roles: [],
  preguntas: [],
  prefijosTelefonicos: [],
  loading: false,
  error: null,
  successMessage: null,
  isAuthenticated: !!localStorage.getItem('token'), 
  permisosUsuario: [], 
  clasificacionesUsuario: [], 
  isSupervisor: !!localStorage.getItem('isSupervisor'),
  rolesDisponibles: [],

  // Cargar opciones del formulario
  fetchOpcionesRegistro: async () => {
    try {
      set({ loading: true });
     
      const [preguntasResponse, generosResponse, rolesResponse, prefijosResponse] = await Promise.all([
        getSubclassificationsById(CLASSIFICATION_IDS.PREGUNTAS),
        getSubclassificationsById(CLASSIFICATION_IDS.GENEROS),
        getSubclassificationsById(CLASSIFICATION_IDS.ROLES),
        getSubclassificationsById(CLASSIFICATION_IDS.PREFIJOS_TLF)
      ]);

      set({
        preguntas: preguntasResponse.data.data,
        generos: generosResponse.data.data,
        roles: rolesResponse.data.data,
        prefijosTelefonicos: prefijosResponse.data.data,
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
      // Guardar el flag de supervisor
      if (response.data.user.isSupervisor) {
        localStorage.setItem('isSupervisor', 'true');
      } else {
        localStorage.removeItem('isSupervisor');
      }
      // Guardar los roles del usuario en localStorage
      const rolesUsuario = response.data.user.id_rol;
      localStorage.setItem('userRoles', JSON.stringify(rolesUsuario));
      
      // Cargar automáticamente los permisos del usuario después del login
      const rolesUsuarioFormateados = rolesUsuario.map(rol => rol.toString());
      await get().cargarPermisosUsuario(rolesUsuarioFormateados);
      
      // Precargar iconos para optimizar el rendimiento
      const clasificacionStore = useClasificacionStore.getState();
      await clasificacionStore.preloadIcons();
      
      set({
        loading: false,
        successMessage: `¡Bienvenido ${response.data.user.nombre} ${response.data.user.apellido}!`,
        isAuthenticated: true,
        isSupervisor: !!response.data.user.isSupervisor,
      });
      
      // Retornar la respuesta para que el componente pueda acceder a los datos del usuario
      return response;
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.error || 'Error desconocido al iniciar sesión.',
        isAuthenticated: false,
        isSupervisor: false,
      });
      throw error; // Re-lanzar el error para que el componente pueda manejarlo
    }
  },

  // Logout
  logoutUser: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isSupervisor');
    
    // Limpiar caché de iconos al cerrar sesión
    const clasificacionStore = useClasificacionStore.getState();
    clasificacionStore.clearIconsCache();
    
    set({
      successMessage: null,
      error: null,
      loading: false,
      isAuthenticated: false,
      isSupervisor: false,
    });
  },

  // Limpiar mensajes
  clearMessages: () => set({ error: null, successMessage: null }),

  // Inicializar permisos si el usuario ya está autenticado
  inicializarPermisos: async () => {
    const { isAuthenticated } = get();
    if (isAuthenticated) {
      
      const rolesUsuario = JSON.parse(localStorage.getItem('userRoles') || '[]');
      
      if (rolesUsuario && rolesUsuario.length > 0) {
        const rolesUsuarioFormateados = rolesUsuario.map(rol => rol.toString());
        const permisos = await get().cargarPermisosUsuario(rolesUsuarioFormateados);

        return permisos;
      } else {
        console.log('No se encontraron roles del usuario en localStorage');
        return { objetos: [], clasificaciones: [] };
      }
    } else {
      console.log('Usuario no autenticado, no se inicializan permisos');
      return { objetos: [], clasificaciones: [] };
    }
  },

  // Cargar permisos del usuario
  cargarPermisosUsuario: async (rolesUsuario) => {
    try {
      set({ loading: true });
      
      // Obtener todos los roles
      const rolesResponse = await getSubclassificationsById(CLASSIFICATION_IDS.ROLES);
      const todosLosRoles = rolesResponse.data.data;

      // Filtrar solo los roles que tiene el usuario
      const rolesDelUsuario = todosLosRoles.filter(rol => 
        rolesUsuario.includes(rol.id.toString())
      );
 
      // Extraer todos los objetos permitidos de los roles del usuario
      const objetosPermitidos = rolesDelUsuario.reduce((acc, rol) => {
       
        if (rol.adicional && rol.adicional.id_objeto) {
          
          const objetosNumericos = rol.adicional.id_objeto.map(id => Number(id));
          return [...acc, ...objetosNumericos];
        }
        return acc;
      }, []);

      // Extraer todas las clasificaciones permitidas de los roles del usuario
      const clasificacionesPermitidas = rolesDelUsuario.reduce((acc, rol) => {
      
        if (rol.adicional && rol.adicional.id_clasificacion) {
    
          const clasificacionesNumericas = rol.adicional.id_clasificacion.map(id => Number(id));
          
          return [...acc, ...clasificacionesNumericas];
        }
  
        return acc;
      }, []);

      // Eliminar duplicados
      const objetosUnicos = [...new Set(objetosPermitidos)];
      const clasificacionesUnicas = [...new Set(clasificacionesPermitidas)];
       
      set({ 
        permisosUsuario: objetosUnicos,
        clasificacionesUsuario: clasificacionesUnicas,
        loading: false 
      });

      return { objetos: objetosUnicos, clasificaciones: clasificacionesUnicas };
    } catch (error) {
      console.error('Error al cargar permisos:', error);
      set({ 
        loading: false, 
        error: 'Error al cargar los permisos del usuario.' 
      });
      return { objetos: [], clasificaciones: [] };
    }
  },

  // Verificar si el usuario tiene acceso a un objeto específico
  tienePermiso: (idObjeto) => {
    const { permisosUsuario, isAuthenticated } = get();
    
    // Si el usuario no está autenticado, no tiene permisos
    if (!isAuthenticated) {
      console.log('Usuario no autenticado, sin permisos');
      return false;
    }
    
    // Si no hay permisos cargados, no tiene permisos
    if (!permisosUsuario || !Array.isArray(permisosUsuario) || permisosUsuario.length === 0) {
      console.log('No hay permisos cargados o permisos inválidos');
      return false;
    }
    
    // Validar que el idObjeto sea válido
    if (idObjeto === null || idObjeto === undefined) {
    
      return false;
    }
    
    // Asegurar que el ID del objeto sea un número
    const idObjetoNumerico = Number(idObjeto);
    
    // Verificar que la conversión fue exitosa
    if (isNaN(idObjetoNumerico)) {
    
      return false;
    }
    
    return permisosUsuario.includes(idObjetoNumerico);
  },

  // Verificar si el usuario tiene acceso a varios objetos
  tienePermisos: (idsObjetos) => {
    const { permisosUsuario, isAuthenticated } = get();
    
    // Si el usuario no está autenticado, no tiene permisos
    if (!isAuthenticated) {
      console.log('Usuario no autenticado, sin permisos múltiples');
      return false;
    }
    
    // Si no hay permisos cargados, no tiene permisos
    if (!permisosUsuario || !Array.isArray(permisosUsuario) || permisosUsuario.length === 0) {
      
      return false;
    }
    
    // Validar que idsObjetos sea un array válido
    if (!Array.isArray(idsObjetos) || idsObjetos.length === 0) {
  
      return false;
    }
    
    // Verificar que todos los IDs sean válidos y convertirlos a números
    const idsNumericos = idsObjetos.map(id => {
      const idNumerico = Number(id);
      if (isNaN(idNumerico)) {
        console.log('ID de objeto no es un número válido:', id);
        return null;
      }
      return idNumerico;
    });
    
    // Si algún ID no es válido, retornar false
    if (idsNumericos.includes(null)) {
      console.log('Algunos IDs de objetos no son válidos');
      return false;
    }
        
    const tieneTodosLosPermisos = idsNumericos.every(id => permisosUsuario.includes(id));

    
    return tieneTodosLosPermisos;
  },

  // Filtrar clasificaciones basadas en los permisos del usuario
  filtrarClasificacionesPorPermiso: (clasificaciones) => {
    const { tienePermisoClasificacion } = get();
        
    const clasificacionesFiltradas = clasificaciones.filter(clasificacion => {
     
      
      // Verificar si el usuario tiene permiso para esta clasificación específica
      const tienePermisoDirecto = tienePermisoClasificacion(clasificacion.id_clasificacion);
      
      if (tienePermisoDirecto) {
        // console.log(`✅ Usuario tiene permiso directo para clasificación: ${clasificacion.nombre}`);
        return true;
      } else {
        console.log(`❌ Usuario NO tiene permiso directo para clasificación: ${clasificacion.nombre}`);
        return false;
      }
    });
    
    // console.log('Clasificaciones filtradas finales:', clasificacionesFiltradas.map(c => c.nombre));
    return clasificacionesFiltradas;
  },

  // Verificar si el usuario tiene acceso a una clasificación específica
  tienePermisoClasificacion: (idClasificacion) => {
    const { clasificacionesUsuario, isAuthenticated } = get();
    
    // Si el usuario no está autenticado, no tiene permisos
    if (!isAuthenticated) {
      console.log('Usuario no autenticado, sin permisos de clasificación');
      return false;
    }
    
    // Si no hay clasificaciones cargadas, no tiene permisos
    if (!clasificacionesUsuario || !Array.isArray(clasificacionesUsuario) || clasificacionesUsuario.length === 0) {
      console.log('No hay clasificaciones cargadas o clasificaciones inválidas');
      return false;
    }
    
    // Validar que el idClasificacion sea válido
    if (idClasificacion === null || idClasificacion === undefined) {
      console.log('ID de clasificación inválido:', idClasificacion);
      return false;
    }
    
    // Asegurar que el ID de la clasificación sea un número
    const idClasificacionNumerico = Number(idClasificacion);
    
    // Verificar que la conversión fue exitosa
    if (isNaN(idClasificacionNumerico)) {
      console.log('ID de clasificación no es un número válido:', idClasificacion);
      return false;
    }
    
    return clasificacionesUsuario.includes(idClasificacionNumerico);
  },

  // Obtener información detallada sobre los permisos del usuario
  obtenerInfoPermisos: () => {
    const { permisosUsuario, clasificacionesUsuario, isAuthenticated, loading } = get();
    
    return {
      isAuthenticated,
      loading,
      totalPermisos: permisosUsuario ? permisosUsuario.length : 0,
      totalClasificaciones: clasificacionesUsuario ? clasificacionesUsuario.length : 0,
      permisos: permisosUsuario || [],
      clasificaciones: clasificacionesUsuario || [],
      tienePermisos: permisosUsuario && permisosUsuario.length > 0,
      tieneClasificaciones: clasificacionesUsuario && clasificacionesUsuario.length > 0,
      estado: isAuthenticated ? 'autenticado' : 'no_autenticado'
    };
  },

  // Verificar si el usuario tiene al menos uno de los permisos especificados
  tieneAlgunPermiso: (idsObjetos) => {
    const { permisosUsuario, isAuthenticated } = get();
    
    // Si el usuario no está autenticado, no tiene permisos
    if (!isAuthenticated) {
      console.log('Usuario no autenticado, sin permisos');
      return false;
    }
    
    // Si no hay permisos cargados, no tiene permisos
    if (!permisosUsuario || !Array.isArray(permisosUsuario) || permisosUsuario.length === 0) {
      console.log('No hay permisos cargados');
      return false;
    }
    
    // Validar que idsObjetos sea un array válido
    if (!Array.isArray(idsObjetos) || idsObjetos.length === 0) {
      console.log('Array de IDs de objetos inválido:', idsObjetos);
      return false;
    }
    
    // Verificar que todos los IDs sean válidos y convertirlos a números
    const idsNumericos = idsObjetos.map(id => {
      const idNumerico = Number(id);
      if (isNaN(idNumerico)) {
        console.log('ID de objeto no es un número válido:', id);
        return null;
      }
      return idNumerico;
    });
    
    // Si algún ID no es válido, retornar false
    if (idsNumericos.includes(null)) {
      console.log('Algunos IDs de objetos no son válidos');
      return false;
    }
    
    const tieneAlgunPermiso = idsNumericos.some(id => permisosUsuario.includes(id));
    console.log('¿Tiene algún permiso?:', tieneAlgunPermiso);
    
    return tieneAlgunPermiso;
  },

  fetchRolesDisponibles: async () => {
    try {
      const response = await getRoles();
      const rolesArray = Array.isArray(response.data)
        ? response.data
        : response.data.data || response.data.roles || [];
      set({ rolesDisponibles: rolesArray });
    } catch (error) {
      console.error('Error al obtener roles:', error);
      set({ rolesDisponibles: [] });
    }
  },
}));

export default useAuthStore;
