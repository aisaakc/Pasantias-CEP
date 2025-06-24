import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { toast } from 'sonner'; // ✅ Importa toast desde sonner
import useClasificacionStore from '../store/clasificacionStore';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function NavbarAuth() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { logoutUser } = useAuthStore();
  const { allClasificaciones, fetchAllClasificaciones,  } = useClasificacionStore();
  const { rolesDisponibles, fetchRolesDisponibles } = useAuthStore();

  // Obtener usuario actual de localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  // Usar rolesInfo directamente del usuario
  const rolesInfo = Array.isArray(user?.rolesInfo) ? user.rolesInfo : [];

  // Cargar roles/clasificaciones si no están cargadas
  useEffect(() => {
    if (!allClasificaciones || allClasificaciones.length === 0) {
      fetchAllClasificaciones();
    }
  }, [allClasificaciones, fetchAllClasificaciones]);

  // Obtener la lista de roles con sus iconos desde el store global
  useEffect(() => {
    if (!rolesDisponibles || rolesDisponibles.length === 0) {
      fetchRolesDisponibles();
    }
  }, [rolesDisponibles, fetchRolesDisponibles]);

  // Función para obtener el nombre del icono según el id del rol
  const obtenerNombreIcono = (idRol) => {
    const rol = rolesDisponibles.find(r => r.id === idRol);
    return rol?.nombre_icono || 'faUser';
  };

  // Renderizar los roles (uno o varios)
  const renderRoles = () => {
    if (!rolesInfo || rolesInfo.length === 0) return null;
    return (
      <div className="flex items-center gap-2 mr-4">
        {rolesInfo.map((rol, idx) => (
          <span
            key={rol.id}
            className="flex items-center gap-2 text-sm text-blue-700 bg-blue-100 border border-blue-300 rounded-full px-3 py-1 shadow-sm"
            style={{ minWidth: 0 }}
          >
            <FontAwesomeIcon icon={iconos[obtenerNombreIcono(rol.id)] || iconos.faUser} className="text-blue-600 text-lg" />
            <span className="font-medium truncate max-w-[100px]">{rol.nombre}</span>
            {idx < rolesInfo.length - 1 && <span className="text-blue-300">|</span>}
          </span>
        ))}
      </div>
    );
  };

  const handleLogout = () => {
    logoutUser();
    toast.success('¡Sesión cerrada correctamente!'); // ✅ Mensaje de éxito con Sonner
    // Limpiar el historial del navegador y redirigir a login
    window.history.pushState(null, '', '/login');
    navigate('/login', { replace: true });
  };

  const goToProfile = () => {
    navigate('/dashboard/perfil');
    setIsOpen(false);
  };

  // Cierra el menú si haces clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 w-full bg-white text-gray-800 flex items-center justify-end px-6 shadow-md">
      <div className="relative flex items-center w-full justify-end" ref={menuRef}>
        {/* Mostrar roles a la izquierda del botón de perfil */}
        {renderRoles()}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 transition-all duration-200 font-medium"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            {/* Mostrar nombre del usuario */}
            {user && (
              <span className="font-semibold text-gray-800">
                {user.nombre} {user.apellido}
              </span>
            )}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 mt-3 min-w-[180px] bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden transition-all duration-200">
              <div className="py-2">
                <button
                  onClick={goToProfile}
                  className="flex items-center gap-2 w-full px-5 py-3 hover:bg-blue-50 transition-colors duration-200 text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                  <span>Ver perfil</span>
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-5 py-3 text-red-600 hover:bg-red-100 transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm7 8a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L12 14.586V11z" clipRule="evenodd" />
                  </svg>
                  <span>Cerrar sesión</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
