import React from 'react';
import { useRoutePermissions, useCanAccessRoute } from '../../hooks/usePermissionGuard';
import { CLASSIFICATION_IDS } from '../../config/classificationIds';
import useAuthStore from '../../store/authStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

export default function PermissionTest() {
  const { permisosUsuario, clasificacionesUsuario, obtenerInfoPermisos } = useAuthStore();
  const routePermissions = useRoutePermissions();
  const { canAccess: canAccessCursos } = useCanAccessRoute('/dashboard/cursos');
  const { canAccess: canAccessRoles } = useCanAccessRoute('/dashboard/roles');
  const { canAccess: canAccessDocumentos } = useCanAccessRoute('/dashboard/documentos');
  const { canAccess: canAccessListCursos } = useCanAccessRoute('/dashboard/listcursos');
  const { canAccess: canAccessPDF } = useCanAccessRoute('/dashboard/prueba');

  const infoPermisos = obtenerInfoPermisos();

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Prueba de Permisos</h1>

        {/* Información general */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Información General</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Estado:</strong> {infoPermisos.estado}</p>
              <p><strong>Total Permisos:</strong> {infoPermisos.totalPermisos}</p>
              <p><strong>Total Clasificaciones:</strong> {infoPermisos.totalClasificaciones}</p>
            </div>
            <div>
              <p><strong>Tiene Permisos:</strong> {infoPermisos.tienePermisos ? 'Sí' : 'No'}</p>
              <p><strong>Tiene Clasificaciones:</strong> {infoPermisos.tieneClasificaciones ? 'Sí' : 'No'}</p>
            </div>
          </div>
        </div>

        {/* Permisos de rutas */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Permisos de Rutas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg border-2 ${canAccessCursos ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Cursos</h3>
                <FontAwesomeIcon 
                  icon={canAccessCursos ? faCheckCircle : faTimesCircle} 
                  className={canAccessCursos ? 'text-green-600' : 'text-red-600'} 
                />
              </div>
              <p className="text-sm text-gray-600">Ruta: /dashboard/cursos</p>
              <p className="text-sm text-gray-600">Permiso: {CLASSIFICATION_IDS.MN_CURSO}</p>
            </div>

            <div className={`p-4 rounded-lg border-2 ${canAccessRoles ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Roles</h3>
                <FontAwesomeIcon 
                  icon={canAccessRoles ? faCheckCircle : faTimesCircle} 
                  className={canAccessRoles ? 'text-green-600' : 'text-red-600'} 
                />
              </div>
              <p className="text-sm text-gray-600">Ruta: /dashboard/roles</p>
              <p className="text-sm text-gray-600">Permiso: {CLASSIFICATION_IDS.MN_ROLES}</p>
            </div>

            <div className={`p-4 rounded-lg border-2 ${canAccessDocumentos ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Documentos</h3>
                <FontAwesomeIcon 
                  icon={canAccessDocumentos ? faCheckCircle : faTimesCircle} 
                  className={canAccessDocumentos ? 'text-green-600' : 'text-red-600'} 
                />
              </div>
              <p className="text-sm text-gray-600">Ruta: /dashboard/documentos</p>
              <p className="text-sm text-gray-600">Permiso: {CLASSIFICATION_IDS.MN_DOCUMENTOS}</p>
            </div>

            <div className={`p-4 rounded-lg border-2 ${canAccessListCursos ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Lista de Cursos</h3>
                <FontAwesomeIcon 
                  icon={canAccessListCursos ? faCheckCircle : faTimesCircle} 
                  className={canAccessListCursos ? 'text-green-600' : 'text-red-600'} 
                />
              </div>
              <p className="text-sm text-gray-600">Ruta: /dashboard/listcursos</p>
              <p className="text-sm text-gray-600">Permiso: {CLASSIFICATION_IDS.MN_LISTCURSOS}</p>
            </div>

            <div className={`p-4 rounded-lg border-2 ${canAccessPDF ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Generar PDF</h3>
                <FontAwesomeIcon 
                  icon={canAccessPDF ? faCheckCircle : faTimesCircle} 
                  className={canAccessPDF ? 'text-green-600' : 'text-red-600'} 
                />
              </div>
              <p className="text-sm text-gray-600">Ruta: /dashboard/prueba</p>
              <p className="text-sm text-gray-600">Permiso: {CLASSIFICATION_IDS.MN_PDF}</p>
            </div>
          </div>
        </div>

        {/* Lista de permisos del usuario */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Permisos del Usuario</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Permisos de Objetos:</h3>
              <div className="bg-gray-50 p-3 rounded-lg max-h-40 overflow-y-auto">
                {permisosUsuario.length > 0 ? (
                  <ul className="space-y-1">
                    {permisosUsuario.map((permiso, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        • {permiso}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">No hay permisos de objetos</p>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Clasificaciones Permitidas:</h3>
              <div className="bg-gray-50 p-3 rounded-lg max-h-40 overflow-y-auto">
                {clasificacionesUsuario.length > 0 ? (
                  <ul className="space-y-1">
                    {clasificacionesUsuario.map((clasificacion, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        • {clasificacion}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">No hay clasificaciones permitidas</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Instrucciones de prueba */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
          <div className="flex items-start">
            <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500 mt-1 mr-3" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Instrucciones de Prueba</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Intenta acceder directamente a las URLs que no tienes permisos (ej: /dashboard/cursos)</li>
                <li>• Verifica que te redirija al dashboard con un mensaje de acceso restringido</li>
                <li>• Confirma que las opciones del sidebar solo muestren las rutas permitidas</li>
                <li>• Prueba crear un rol sin ciertos permisos y verifica que el usuario no pueda acceder</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}