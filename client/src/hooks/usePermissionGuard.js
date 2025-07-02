import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { CLASSIFICATION_IDS } from '../config/classificationIds';

// Mapeo de rutas a permisos específicos
const ROUTE_PERMISSIONS = {
  '/dashboard/cursos': CLASSIFICATION_IDS.MN_CURSO,
  '/dashboard/listcursos': CLASSIFICATION_IDS.MN_LISTCURSOS,
  '/dashboard/roles': CLASSIFICATION_IDS.MN_ROLES,
  '/dashboard/documentos': CLASSIFICATION_IDS.MN_DOCUMENTOS,
  '/dashboard/prueba': CLASSIFICATION_IDS.MN_PDF,
};

// Rutas especiales que permiten acceso a usuarios con roles específicos
const SPECIAL_ROUTE_ACCESS = {
  '/dashboard/listcursos': [CLASSIFICATION_IDS.Estudiante_IUJO, CLASSIFICATION_IDS.Participante_Externo]
};

// Hook personalizado para verificar permisos de rutas
export const usePermissionGuard = (requiredPermission = null) => {
  const { isAuthenticated, tienePermiso, loading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [hasAccess, setHasAccess] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Función para verificar si el usuario tiene alguno de los roles permitidos
  const tieneRolPermitido = () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const rolesUsuario = userData.id_rol || [];
      const rolesPermitidos = SPECIAL_ROUTE_ACCESS[location.pathname] || [];
      
      return rolesPermitidos.some(rolPermitido => rolesUsuario.includes(rolPermitido));
    } catch (error) {
      console.error('Error al verificar roles permitidos:', error);
      return false;
    }
  };

  useEffect(() => {
    const checkAccess = async () => {
      // Si está cargando, esperar
      if (loading) {
        return;
      }

      // Si no está autenticado, redirigir al login
      if (!isAuthenticated) {
        console.log('❌ Usuario no autenticado, redirigiendo al login');
        navigate('/login', { replace: true });
        return;
      }

      // Si se requiere un permiso específico, verificarlo
      if (requiredPermission) {
        if (!tienePermiso(requiredPermission)) {
          console.log(`❌ Acceso denegado: Usuario no tiene permiso ${requiredPermission} para ${location.pathname}`);
          navigate('/dashboard', { replace: true });
          return;
        }
      }

      // Verificar permisos basados en la ruta actual
      const requiredPermissionForRoute = ROUTE_PERMISSIONS[location.pathname];
      
      // Si la ruta tiene acceso especial por roles, verificar primero
      if (SPECIAL_ROUTE_ACCESS[location.pathname]) {
        if (tieneRolPermitido()) {
          console.log(`✅ Acceso permitido por rol especial para ${location.pathname}`);
          setHasAccess(true);
          setIsChecking(false);
          return;
        }
      }
      
      // Si no tiene acceso especial por roles, verificar permisos normales
      if (requiredPermissionForRoute && !tienePermiso(requiredPermissionForRoute)) {
        console.log(`❌ Acceso denegado: Usuario no tiene permiso ${requiredPermissionForRoute} para ${location.pathname}`);
        navigate('/dashboard', { replace: true });
        return;
      }

      // Si llegamos aquí, el usuario tiene acceso
      setHasAccess(true);
      setIsChecking(false);
    };

    checkAccess();
  }, [isAuthenticated, requiredPermission, location.pathname, navigate, tienePermiso, loading]);

  return {
    hasAccess,
    isChecking,
    loading,
    isAuthenticated,
    currentPath: location.pathname,
    requiredPermission: ROUTE_PERMISSIONS[location.pathname] || requiredPermission
  };
};

// Hook para verificar si el usuario puede acceder a una ruta específica
export const useCanAccessRoute = (route) => {
  const { tienePermiso } = useAuthStore();
  const requiredPermission = ROUTE_PERMISSIONS[route];
  
  return {
    canAccess: requiredPermission ? tienePermiso(requiredPermission) : true,
    requiredPermission
  };
};

// Hook para obtener todos los permisos de rutas del usuario
export const useRoutePermissions = () => {
  const { tienePermiso } = useAuthStore();
  
  const routePermissions = Object.entries(ROUTE_PERMISSIONS).reduce((acc, [route, permission]) => {
    acc[route] = {
      canAccess: tienePermiso(permission),
      permission
    };
    return acc;
  }, {});

  return routePermissions;
}; 