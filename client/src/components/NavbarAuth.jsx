import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { toast } from 'sonner'; // ✅ Importa toast desde sonner

export default function NavbarAuth() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { logoutUser } = useAuthStore();

  const handleLogout = () => {
    logoutUser();
    toast.success('¡Sesión cerrada correctamente!'); // ✅ Mensaje de éxito con Sonner
    navigate('/login');
  };

  const goToProfile = () => {
    navigate('/perfil');
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
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 rounded-lg hover:bg-gray-100 font-medium"
        >
          Mi Perfil ⏷
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
            <button
              onClick={goToProfile}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Ver perfil
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
