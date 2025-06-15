import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaClipboardList, FaHome, FaCog, FaGraduationCap, FaUserShield, FaFilePdf } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import useClasificacionStore from '../store/clasificacionStore';
import useAuthStore from '../store/authStore';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { encodeId } from '../utils/hashUtils';
import { CLASSIFICATION_IDS } from '../config/classificationIds';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { parentClasifications, fetchParentClasifications } = useClasificacionStore();
  const { permisosUsuario, cargarPermisosUsuario, tienePermiso } = useAuthStore();
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  useEffect(() => {
    fetchParentClasifications();
    // Cargar permisos del usuario al montar el componente
    const rolesUsuario = JSON.parse(localStorage.getItem('userRoles') || '[]');
    console.log('=== DEBUG PERMISOS ===');
    console.log('Roles del usuario:', rolesUsuario);
    console.log('Tipo de rolesUsuario:', typeof rolesUsuario, Array.isArray(rolesUsuario));
    
    // Asegurarnos de que rolesUsuario sea un array de strings
    const rolesUsuarioFormateados = rolesUsuario.map(rol => rol.toString());
    console.log('Roles formateados:', rolesUsuarioFormateados);
    
    cargarPermisosUsuario(rolesUsuarioFormateados).then(permisos => {
      console.log('Permisos cargados (desde promesa):', permisos);
    });
    
    console.log('Permisos cargados (desde estado):', permisosUsuario);
    console.log('IDs de clasificación:', {
      MN_CONFIGURACION: CLASSIFICATION_IDS.MN_CONFIGURACION,
      MN_CURSO: CLASSIFICATION_IDS.MN_CURSO,
      MN_ROLES: CLASSIFICATION_IDS.MN_ROLES
    });
  }, [fetchParentClasifications, cargarPermisosUsuario]);

  const isActive = (id) => {
    const encodedId = encodeId(id);
    return (
      location.pathname === `/dashboard/tipos/${encodedId}` ||
      location.pathname.startsWith(`/dashboard/tipos/${encodedId}/`)
    );
  };

  // Función para obtener el icono dinámicamente
  const getIcon = (iconName) => {
    const Icon = iconos[iconName] || iconos.faFile;
    return <FontAwesomeIcon icon={Icon} className="w-5 h-5" />;
  };

  // Encontrar las clasificaciones específicas para Cursos y Roles
  const cursosClasificacion = parentClasifications.find(c => c.nombre === 'Cursos');
  const rolesClasificacion = parentClasifications.find(c => c.nombre === 'Rol');

  // Verificar permisos para cada sección
  const puedeAccederConfiguracion = tienePermiso(CLASSIFICATION_IDS.MN_CONFIGURACION);
  const puedeAccederCursos = tienePermiso(CLASSIFICATION_IDS.MN_CURSO);
  const puedeAccederRoles = tienePermiso(CLASSIFICATION_IDS.MN_ROLES);

  console.log('=== VERIFICACIÓN DE ACCESO ===');
  console.log('Permisos actuales del usuario:', permisosUsuario);
  console.log('Tipo de permisosUsuario:', typeof permisosUsuario, Array.isArray(permisosUsuario));
  console.log('¿Puede acceder a Configuración?:', puedeAccederConfiguracion);
  console.log('¿Puede acceder a Cursos?:', puedeAccederCursos);
  console.log('¿Puede acceder a Roles?:', puedeAccederRoles);

  return (
    <aside className="w-80 h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex-shrink-0 p-8 shadow-2xl backdrop-blur-sm border-r border-gray-700/30">
      <div className="mb-16">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500 bg-clip-text text-transparent animate-gradient">
          Control del sistema
        </h2>
        <div className="h-1 w-24 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 mt-3 rounded-full"></div>
      </div>

      <nav className="flex flex-col gap-3">
        {puedeAccederConfiguracion && (
          <div className="relative">
            <button
              onClick={() => {
                setIsConfigOpen(!isConfigOpen);
                if (!isConfigOpen) {
                  navigate('/dashboard');
                }
              }}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-300 ${
                location.pathname === '/dashboard'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-white hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-3">
                {getIcon('faCog')}
                <span className="font-medium">Configuración</span>
              </div>
              <FontAwesomeIcon 
                icon={iconos.faChevronDown} 
                className={`w-4 h-4 transition-transform duration-300 ${isConfigOpen ? 'rotate-180' : ''}`}
              />
            </button>

            <div className={`mt-2 bg-gradient-to-br from-gray-900/95 to-gray-800/95 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 backdrop-blur-sm ${
              isConfigOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2">
                <div className="divide-y divide-gray-700/30">
                  {parentClasifications.map((clasificacion) => {
                    const Icon = iconos[clasificacion.nicono] || iconos.faFile;
                    const active = isActive(clasificacion.id_clasificacion);

                    return (
                      <Link
                        key={clasificacion.id_clasificacion}
                        to={`/dashboard/tipos/${encodeId(clasificacion.id_clasificacion)}`}
                        className="block"
                      >
                        <div
                          className={`flex items-center gap-4 px-5 py-4 group/item cursor-pointer transition-all duration-300 hover:translate-x-2 ${
                            active
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                              : 'hover:bg-blue-700/20'
                          }`}
                          title={clasificacion.nombre}
                        >
                          <div
                            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${
                              active
                                ? 'bg-blue-500/30 shadow-lg'
                                : 'bg-blue-500/10 group-hover/item:bg-blue-500/20'
                            }`}
                          >
                            <FontAwesomeIcon
                              icon={Icon}
                              className={`text-lg transition-all duration-300 ${
                                active
                                  ? 'text-white'
                                  : 'text-blue-400 group-hover/item:text-white'
                              }`}
                            />
                          </div>
                          <span
                            className={`font-medium text-lg transition-all duration-300 ${
                              active
                                ? 'text-white'
                                : 'text-gray-300 group-hover/item:text-white'
                            }`}
                          >
                            {clasificacion.nombre}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {puedeAccederCursos && (
          <Link
            to="/dashboard/cursos"
            className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all duration-300 ${
              location.pathname === '/dashboard/cursos'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-gray-300 hover:bg-gray-700/50 hover:text-white hover:shadow-md'
            }`}
          >
            {cursosClasificacion ? (
              <FontAwesomeIcon icon={iconos[cursosClasificacion.nicono] || iconos.faFile} className="w-5 h-5" />
            ) : (
              <FontAwesomeIcon icon={iconos.faFile} className="w-5 h-5" />
            )}
            <span className="font-medium">Cursos</span>
          </Link>
        )}

        {puedeAccederRoles && (
          <Link
            to="/dashboard/roles"
            className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all duration-300 ${
              location.pathname === '/dashboard/roles'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-gray-300 hover:bg-gray-700/50 hover:text-white hover:shadow-md'
            }`}
          >
            {rolesClasificacion ? (
              <FontAwesomeIcon icon={iconos[rolesClasificacion.nicono] || iconos.faFile} className="w-5 h-5" />
            ) : (
              <FontAwesomeIcon icon={iconos.faFile} className="w-5 h-5" />
            )}
            <span className="font-medium">Roles</span>
          </Link>
        )}

        <Link
          to="/dashboard/prueba"
          className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all duration-300 ${
            location.pathname === '/dashboard/prueba'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
              : 'text-gray-300 hover:bg-gray-700/50 hover:text-white hover:shadow-md'
          }`}
        >
          <FontAwesomeIcon icon={iconos.faFilePdf} className="w-5 h-5" />
          <span className="font-medium">Generar PDF</span>
        </Link>
      </nav>
    </aside>
  );
}

// Agregar estilos dinámicamente
const styles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 2px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(99, 102, 241, 0.3);
    border-radius: 2px;
    transition: all 0.3s ease;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(99, 102, 241, 0.5);
  }

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .animate-gradient {
    background-size: 200% 200%;
    animation: gradient 8s ease infinite;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}
