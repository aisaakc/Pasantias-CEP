// frontend/src/components/Navbar.jsx
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/LOGO1.png'; // 👈 importa el logo
// --- Importar el hook useAuth para acceder al estado de autenticación y info del usuario ---
import { useAuth } from '../context/AuthContext';


const links = [
  { name: 'Home', href: '/' },
  { name: 'Curso', href: '/lista' },
  { name: 'Contacto', href: '/contacto' }
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  // --- Obtener el estado de autenticación (isAuthenticated), la info del usuario (user)
  // y la función de cerrar sesión (logout) del contexto ---
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 shadow-lg fixed w-full z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Logo CEP" className="h-55 w-auto" /> {/* 👈 Logo visible */}
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-12">
            <ul className="flex items-center space-x-12">
              {links.map(link => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white font-medium relative group hover:text-blue-200 transition-all"
                  >
                    {link.name}
                    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-200 transition-all group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* --- Botones/Enlaces Condicionales según Autenticación (Desktop) --- */}
            <div className="flex items-center space-x-5">
              {isAuthenticated ? ( // Si el usuario está autenticado...
                <>
                  {/* Enlace al perfil del usuario */}
                  <Link
                    to="/profile" // Ruta a la página de perfil
                    className="text-white font-medium hover:text-blue-200 transition-all text-sm" // Ajustado el estilo para que parezca un enlace, no un botón si prefieres
                  >
                    {user ? `Hola, ${user.nombre}!` : 'Mi Perfil'} {/* Muestra el nombre o "Mi Perfil" */}
                  </Link>
                  {/* Botón para cerrar sesión */}
                  <button
                    onClick={logout} // Llama a la función logout del contexto
                    className="bg-red-500 text-white px-5 py-2 rounded-full hover:bg-red-600 transition-all text-sm font-semibold"
                  >
                    Cerrar Sesión
                  </button>
                   {/* Opcional: Enlace al Dashboard solo para roles específicos (ej. Admin/SuperAdmin) */}
                   {/* Asegúrate de importar las constantes de roles si usas esta parte */}
                   {/* import { ROL_ADMIN, ROL_SUPERADMIN } from '../config/roles'; */}
                   {/* {user && (user.id_rol === ROL_ADMIN || user.id_rol === ROL_SUPERADMIN) && (
                        <Link to="/dashboard" className="text-white font-medium hover:text-blue-200 transition-all text-sm">Dashboard</Link>
                   )} */}
                </>
              ) : ( // Si NO está autenticado...
                <>
                  {/* Botones Login/Registro */}
                  <Link
                    to="/login"
                    className="bg-white border border-blue-600 text-blue-600 px-5 py-2 rounded-full hover:bg-blue-100 transition-all text-sm font-semibold"
                  >
                    Login
                  </Link>
                  <Link
                    to="/registro"
                    className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-all text-sm font-semibold"
                  >
                    Registro
                  </Link>
                </>
              )}
            </div>
            {/* --- Fin Botones/Enlaces Condicionales (Desktop) --- */}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
            className="md:hidden text-white focus:outline-none"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <ul className="flex flex-col px-6 pt-4 pb-6 space-y-4 bg-white text-gray-700 font-medium shadow-md border-t border-gray-100 rounded-xl">
          {/* Enlaces generales del menú móvil */}
          {links.map(link => (
            <li key={link.name}>
              <Link
                to={link.href}
                className="block hover:text-blue-600 transition py-2"
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </Link>
            </li>
          ))}

             {/* --- Botones/Enlaces Condicionales según Autenticación (Móvil) --- */}
          <li className="pt-4 space-y-2"> {/* Contenedor para los botones/enlaces de auth */}
            {isAuthenticated ? ( // Si el usuario está autenticado...
              <>
                 {/* Enlace al perfil del usuario (móvil) */}
                <Link
                  to="/profile"
                  className="block w-full text-blue-600 hover:underline transition py-2" // Estilo para enlace móvil
                  onClick={() => setMenuOpen(false)}
                >
                  {user ? `Hola, ${user.nombre}!` : 'Mi Perfil'}
                </Link>
                 {/* Botón para cerrar sesión (móvil) */}
                <button
                  onClick={() => { logout(); setMenuOpen(false); }} // Llama a logout y cierra el menú
                  className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition text-sm font-medium"
                >
                  Cerrar Sesión
                </button>
                {/* Opcional: Enlace a Dashboard para roles específicos (móvil) */}
                {/* {user && (user.id_rol === ROL_ADMIN || user.id_rol === ROL_SUPERADMIN) && (
                     <Link to="/dashboard" className="block w-full text-blue-600 hover:underline transition py-2" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                )} */}
              </>
            ) : ( // Si NO está autenticado...
              <>
                 {/* Enlaces/Botones Login/Registro (móvil) */}
                <Link
                  to="/login"
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/registro"
                  className="w-full bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition text-sm font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  Registro
                </Link>
              </>
            )}
             {/* --- Fin Botones/Enlaces Condicionales (Móvil) --- */}
          </li>
        </ul>
      </div>
    </nav>
  );
}