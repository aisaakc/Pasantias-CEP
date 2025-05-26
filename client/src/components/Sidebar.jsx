import { Link, useLocation } from 'react-router-dom';
import { FaClipboardList, FaHome, FaCog, FaGraduationCap, FaUserShield } from 'react-icons/fa';
import { useEffect } from 'react';
import useClasificacionStore from '../store/clasificacionStore';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { encodeId } from '../utils/hashUtils';

export default function Sidebar() {
  const location = useLocation();
  const { parentClasifications, fetchParentClasifications } = useClasificacionStore();

  useEffect(() => {
    fetchParentClasifications();
  }, [fetchParentClasifications]);

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

  return (
    <aside className="w-80 h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex-shrink-0 p-8 shadow-2xl backdrop-blur-sm">
      <div className="mb-16">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
          Control del sistema
        </h2>
        <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-blue-600 mt-3 rounded-full"></div>
      </div>

      <nav className="flex flex-col gap-2">
        <div className="relative group">
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-all duration-200 ${
              location.pathname.startsWith('/dashboard/tipos')
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {getIcon('faCog')}
            <span className="font-medium">Configuración</span>
          </Link>

          <div className="absolute left-0 right-0 mt-1 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
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
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
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

        <Link
          to="/dashboard/cursos"
          className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-all duration-200 ${
            location.pathname === '/dashboard/cursos'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          {cursosClasificacion ? (
            <FontAwesomeIcon icon={iconos[cursosClasificacion.nicono] || iconos.faFile} className="w-5 h-5" />
          ) : (
            <FontAwesomeIcon icon={iconos.faFile} className="w-5 h-5" />
          )}
          <span className="font-medium">Cursos</span>
        </Link>

        <Link
          to="/dashboard/roles"
          className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-all duration-200 ${
            location.pathname === '/dashboard/roles'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          {rolesClasificacion ? (
            <FontAwesomeIcon icon={iconos[rolesClasificacion.nicono] || iconos.faFile} className="w-5 h-5" />
          ) : (
            <FontAwesomeIcon icon={iconos.faFile} className="w-5 h-5" />
          )}
          <span className="font-medium">Roles</span>
        </Link>
      </nav>
    </aside>
  );
}

// Agregar estilos dinámicamente
const styles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(59, 130, 246, 0.3);
    border-radius: 3px;
    transition: all 0.3s ease;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(59, 130, 246, 0.5);
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}
