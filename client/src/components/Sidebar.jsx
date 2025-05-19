import { Link, useLocation } from 'react-router-dom';
import { FaClipboardList } from 'react-icons/fa';
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
    return location.pathname === `/dashboard/tipos/${encodedId}` || 
           location.pathname.startsWith(`/dashboard/tipos/${encodedId}/`);
  };

  return (
    <aside className="w-72 h-full bg-gradient-to-b from-gray-800 to-gray-900 text-white flex-shrink-0 p-6 shadow-lg">
      <div className="mb-12">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          Control del sistema
        </h2>
        <div className="h-1 w-20 bg-blue-500 mt-2 rounded-full"></div>
      </div>
      
      <nav className="flex flex-col gap-2">
        <div className="relative group">
          <div
            className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-all duration-200 ${
              location.pathname.startsWith("/dashboard/tipos")
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <FaClipboardList className="w-5 h-5" />
            <span className="font-medium">Configuración</span>
          </div>
          
          <div className="absolute left-0 right-0 mt-1 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
              <div className="divide-y divide-gray-700/50">
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
                        className={`flex items-center gap-3 px-4 py-3 group/item cursor-pointer transition-all duration-200 hover:translate-x-1 ${
                          active 
                            ? 'bg-blue-600 text-white' 
                            : 'hover:bg-blue-700/80'
                        }`}
                        title={clasificacion.nombre}
                      >
                        <div className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors duration-200 ${
                          active 
                            ? 'bg-blue-500/30' 
                            : 'bg-blue-500/10 group-hover/item:bg-blue-500/20'
                        }`}>
                          <FontAwesomeIcon 
                            icon={Icon} 
                            className={`transition-colors duration-200 ${
                              active 
                                ? 'text-white' 
                                : 'text-blue-400 group-hover/item:text-white'
                            }`}
                          />
                        </div>
                        <span className={`font-medium transition-colors duration-200 ${
                          active 
                            ? 'text-white' 
                            : 'text-gray-300 group-hover/item:text-white'
                        }`}>
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
      </nav>
    </aside>
  );
}

const styles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(59, 130, 246, 0.5);
    border-radius: 3px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(59, 130, 246, 0.7);
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}
