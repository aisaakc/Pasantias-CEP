import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaClipboardList, FaHome, FaCog, FaGraduationCap, FaUserShield, FaFilePdf, FaFileAlt, FaChartBar, FaUsers } from 'react-icons/fa';
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
  const { 
    tienePermiso, 
    filtrarClasificacionesPorPermiso,
    isSupervisor,
    user
  } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Detectar tamaño de pantalla con breakpoints más específicos
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width < 640) { // sm: < 640px - Móviles pequeños
        setIsCollapsed(true);
        setIsSidebarOpen(false);
      } else if (width < 768) { // md: < 768px - Móviles
        setIsCollapsed(true);
        setIsSidebarOpen(false);
      } else if (width < 1024) { // lg: < 1024px - Tablets
        setIsCollapsed(true);
        setIsSidebarOpen(true);
      } else if (width < 1366) { // xl: < 1366px - Laptops pequeños (incluye 1440x900)
        setIsCollapsed(false);
        setIsSidebarOpen(true);
      } else if (width < 1920) { // 2xl: < 1920px - Monitores medianos
        setIsCollapsed(false);
        setIsSidebarOpen(true);
      } else { // 3xl: >= 1920px - Pantallas grandes
        setIsCollapsed(false);
        setIsSidebarOpen(true);
      }
    };

    handleResize(); // Ejecutar al montar
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchParentClasifications();
  }, [fetchParentClasifications]);

  useEffect(() => {
    if (parentClasifications.length > 0) {
      // Las clasificaciones se filtran automáticamente según los permisos
    }
  }, [parentClasifications]);

  const isActive = (id) => {
    const encodedId = encodeId(id);
    return (
      location.pathname === `/dashboard/tipos/${encodedId}` ||
      location.pathname.startsWith(`/dashboard/tipos/${encodedId}/`)
    );
  };

  const getIcon = (iconName) => {
    const Icon = iconos[iconName] || iconos.faFile;
    return <FontAwesomeIcon icon={Icon} className={`w-4 h-4 sm:w-5 sm:h-5 ${isSupervisor ? 'text-red-800' : ''}`} />;
  };

  const cursosClasificacion = parentClasifications.find(c => c.nombre === 'Cursos');
  const rolesClasificacion = parentClasifications.find(c => c.nombre === 'Roles');
  const documentosClasificacion = parentClasifications.find(c => c.nombre === 'Tipo de Documento');

  const puedeAccederConfiguracion = tienePermiso(CLASSIFICATION_IDS.MN_CONFIGURACION);
  const puedeAccederCursos = tienePermiso(CLASSIFICATION_IDS.MN_CURSO);
  const puedeAccederListaCursos = tienePermiso(CLASSIFICATION_IDS.MN_LISTCURSOS);
  const puedeAccederRoles = tienePermiso(CLASSIFICATION_IDS.MN_ROLES);
  const puedeAccederPDF = tienePermiso(CLASSIFICATION_IDS.MN_PDF);
  const puedeAccederDocumentos = tienePermiso(CLASSIFICATION_IDS.MN_DOCUMENTOS);
  const puedeAccederEstadisticas = tienePermiso(CLASSIFICATION_IDS.MN_ESTADISTICAS);
  const puedeAccederCohorte = tienePermiso(CLASSIFICATION_IDS.MN_COHORTE);

  const esFacilitador = user?.id_rol?.includes(CLASSIFICATION_IDS.ROLES_FACILITADORES);

  const renderSidebarLink = (to, label, icon, canAccess, clasificacion = null, isSupervisor = false) => {
    if (!canAccess) return null;

    const isActive = location.pathname === to;
    const iconToUse = clasificacion ? 
      (iconos[clasificacion.nicono] || icon) : 
      icon;

    return (
      <Link
        to={to}
        onClick={() => {
          if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
          }
        }}
        className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-3 lg:px-3 xl:px-3 2xl:px-4 py-2 sm:py-2 lg:py-3 xl:py-2 2xl:py-3 w-full rounded-lg sm:rounded-xl transition-all duration-300 ${
          isActive
            ? (isSupervisor ? 'bg-gradient-to-r from-red-600 to-red-400 text-red-900 shadow-lg shadow-red-500/20' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20')
            : (isSupervisor ? 'text-red-900 hover:bg-red-200/50 hover:text-red-800 hover:shadow-md' : 'text-gray-300 hover:bg-gray-700/50 hover:text-white hover:shadow-md')
        }`}
        title={isCollapsed ? label : undefined}
      >
        <FontAwesomeIcon icon={iconToUse} className={`w-4 h-4 sm:w-5 sm:h-5 ${isSupervisor ? 'text-red-800' : ''} flex-shrink-0`} />
        {!isCollapsed && (
          <span className={`font-medium text-sm sm:text-sm lg:text-base xl:text-sm 2xl:text-base ${isSupervisor ? 'text-red-900' : 'text-white'} whitespace-nowrap`}>
            {label}
          </span>
        )}
      </Link>
    );
  };

  // Botón de toggle para móviles y tablets
  const MobileToggleButton = () => (
    <button
      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      className="fixed top-2 left-2 sm:top-4 sm:left-4 z-50 xl:hidden bg-blue-600 text-white p-2 sm:p-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
      aria-label="Toggle sidebar"
    >
      <FontAwesomeIcon 
        icon={isSidebarOpen ? iconos.faTimes : iconos.faBars} 
        className="w-4 h-4 sm:w-5 sm:h-5" 
      />
    </button>
  );

  // Overlay para móviles y tablets
  const MobileOverlay = () => (
    isSidebarOpen && window.innerWidth < 1024 && (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 xl:hidden"
        onClick={() => setIsSidebarOpen(false)}
      />
    )
  );

  return (
    <>
      <MobileToggleButton />
      <MobileOverlay />
      
      <aside className={`
        fixed xl:relative z-40
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0'}
        ${isCollapsed ? 'w-16 sm:w-20' : 'w-64 sm:w-72 lg:w-80 xl:w-72 2xl:w-80'}
        ${isSupervisor ? 'bg-gradient-to-br from-red-200 via-red-100 to-red-300 border-4 border-red-500 shadow-2xl animate-pulse' : 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'}
        h-full text-white flex-shrink-0 p-2 sm:p-3 lg:p-4 xl:p-4 2xl:p-6 shadow-2xl backdrop-blur-sm border-r border-gray-700/30
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'xl:px-2' : ''}
      `}>
        {/* Header del sidebar */}
        <div className={`mb-3 sm:mb-4 lg:mb-6 xl:mb-4 2xl:mb-6 ${isCollapsed ? 'text-center' : ''}`}>
          {!isCollapsed ? (
            <>
              <h2 className={`text-lg sm:text-xl lg:text-2xl xl:text-xl 2xl:text-2xl font-bold ${isSupervisor ? 'bg-gradient-to-r from-red-700 via-red-500 to-red-800 bg-clip-text text-transparent' : 'bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500 bg-clip-text text-transparent animate-gradient'}`}>
                Gestión de Cursos (S.G.C.)
              </h2>
              <div className={`${isSupervisor ? 'h-1 w-24 sm:w-32 lg:w-36 xl:w-32 2xl:w-36 bg-gradient-to-r from-red-500 via-red-400 to-red-600' : 'h-1 w-24 sm:w-32 lg:w-36 xl:w-32 2xl:w-36 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600'} mt-2 sm:mt-3 rounded-full mx-auto xl:mx-0`}></div>
              <h3 className={`text-xs sm:text-sm lg:text-sm xl:text-xs 2xl:text-sm font-bold ${isSupervisor ? 'bg-gradient-to-r from-red-700 via-red-500 to-red-800 bg-clip-text text-transparent' : 'bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500 bg-clip-text text-transparent animate-gradient'}`}>
                Coordinación de Extensión Profesional
              </h3>
            </>
          ) : (
            <div className="flex justify-center">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full ${isSupervisor ? 'bg-red-600' : 'bg-blue-600'} flex items-center justify-center`}>
                <FontAwesomeIcon icon={iconos.faGraduationCap} className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Botón de colapsar/expandir (solo desktop) */}
        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(true)}
            className="hidden xl:flex absolute top-2 right-2 lg:top-4 lg:right-4 text-gray-400 hover:text-white transition-colors"
            title="Colapsar sidebar"
          >
            <FontAwesomeIcon icon={iconos.faChevronLeft} className="w-3 h-3 lg:w-4 lg:h-4" />
          </button>
        )}

        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            className="hidden xl:flex absolute top-2 right-2 lg:top-4 lg:right-4 text-gray-400 hover:text-white transition-colors"
            title="Expandir sidebar"
          >
            <FontAwesomeIcon icon={iconos.faChevronRight} className="w-3 h-3 lg:w-4 lg:h-4" />
          </button>
        )}

        {/* Navegación */}
        <nav className="flex flex-col gap-1 sm:gap-2 lg:gap-2 xl:gap-2 2xl:gap-3">
          {puedeAccederCursos && (
            renderSidebarLink('/dashboard/cursos', 'Gestión de Cohortes', iconos.faCalendarDays, puedeAccederCursos, cursosClasificacion, isSupervisor)
          )}

          {puedeAccederListaCursos && (
            renderSidebarLink('/dashboard/listcursos', 'Catálogo de Cursos', iconos.faClipboardList, puedeAccederListaCursos, null, isSupervisor)
          )}

          {puedeAccederDocumentos && (
            renderSidebarLink('/dashboard/documentos', 'Documentos', iconos.faFileAlt, puedeAccederDocumentos, documentosClasificacion, isSupervisor)
          )}

          {puedeAccederRoles && (
            renderSidebarLink('/dashboard/roles', 'Roles', iconos.faFile, puedeAccederRoles, rolesClasificacion, isSupervisor)
          )}

          {puedeAccederPDF && (
            renderSidebarLink('/dashboard/prueba', 'Generar Certificados', iconos.faFilePdf, puedeAccederPDF, null, isSupervisor)
          )}

          {puedeAccederEstadisticas && (
            renderSidebarLink('/dashboard/estadisticas', 'Estadísticas', iconos.faChartBar, true, null, isSupervisor)
          )}

          {puedeAccederCohorte && (
            renderSidebarLink('/dashboard/cohorte', 'Cohortes', iconos.faUsers, true, null, isSupervisor)
          )}

          {esFacilitador && (
            renderSidebarLink('/dashboard/listado', 'Mis Cursos (Facilitador)', iconos.faChalkboardTeacher, true, null, isSupervisor)
          )}

          {renderSidebarLink(
            '/dashboard/chat-ia',
            <>
              Chat <sup>(IA)</sup>
            </>,
            iconos.faRobot,
            true,
            null,
            isSupervisor
          )}

          {renderSidebarLink(
            '/dashboard/cuestionario-ia',
            <>
              Cuestionario <sup>(IA)</sup>
            </>,
            iconos.faListCheck || iconos.faList,
            true,
            null,
            isSupervisor
          )}

          {/* Configuración como enlace directo */}
          {puedeAccederConfiguracion && (
            renderSidebarLink('/dashboard', 'Configuración', iconos.faCog, puedeAccederConfiguracion, null, isSupervisor)
          )}
        </nav>

        {/* Footer responsive - Siempre visible */}
        <div className="mt-auto pt-2 sm:pt-2 lg:pt-3 xl:pt-2 2xl:pt-3 border-t border-gray-700/30">
          {isCollapsed ? (
            // Footer colapsado - Solo icono y versión
            <div className="text-center">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full ${isSupervisor ? 'bg-red-600' : 'bg-blue-600'} flex items-center justify-center mx-auto mb-2`}>
                <FontAwesomeIcon icon={iconos.faGraduationCap} className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div className="text-center text-xs text-gray-400">
                <p className="text-xs font-medium">CEP</p>
                <p className="text-xs">v1.0.0</p>
              </div>
            </div>
          ) : (
            // Footer expandido - Texto completo
            <div className="text-center text-xs text-gray-400">
              <p className="text-xs sm:text-sm xl:text-xs 2xl:text-sm font-medium">CEP - Sistema de Gestión</p>
              <p className="mt-1 text-xs sm:text-sm xl:text-xs 2xl:text-sm">v1.0.0</p>
            </div>
          )}
        </div>
      </aside>
    </>
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

  /* Responsive breakpoints mejorados */
  @media (max-width: 640px) {
    .sidebar-xs {
      width: 4rem;
    }
  }

  @media (max-width: 768px) {
    .sidebar-mobile {
      transform: translateX(-100%);
    }
    .sidebar-mobile.open {
      transform: translateX(0);
    }
  }

  @media (min-width: 1024px) {
    .sidebar-tablet {
      transform: translateX(0);
    }
  }

  @media (min-width: 1280px) {
    .sidebar-desktop {
      transform: translateX(0);
    }
  }

  @media (min-width: 1536px) {
    .sidebar-2xl {
      transform: translateX(0);
    }
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}
