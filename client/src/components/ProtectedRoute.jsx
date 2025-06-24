import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faLock, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { usePermissionGuard } from '../hooks/usePermissionGuard';

// Componente para proteger rutas específicas con permisos
const ProtectedRoute = ({ children, requiredPermission = null }) => {
  const navigate = useNavigate();
  const { hasAccess, isChecking, loading, currentPath, requiredPermission: routePermission } = usePermissionGuard(requiredPermission);

  // Mostrar spinner mientras se verifica
  if (loading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="text-center">
          <FontAwesomeIcon 
            icon={faSpinner} 
            className="text-4xl text-blue-600 animate-spin mb-4" 
          />
          <p className="text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Si no tiene acceso, mostrar pantalla de acceso restringido
  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4 text-center">
          <div className="flex items-center justify-center text-red-500 mb-4">
            <FontAwesomeIcon icon={faLock} className="text-4xl animate-bounce" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Acceso Restringido</h3>
          <p className="text-gray-600 mb-4">
            No tienes permisos para acceder a esta sección. Por favor, contacta al administrador para que te asigne los permisos necesarios.
          </p>
          <div className="text-sm text-gray-500 mb-4">
            <p>Ruta intentada: <code className="bg-gray-100 px-2 py-1 rounded">{currentPath}</code></p>
            <p>Permiso requerido: <code className="bg-gray-100 px-2 py-1 rounded">{routePermission}</code></p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300 flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <span>Volver al Dashboard</span>
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute; 