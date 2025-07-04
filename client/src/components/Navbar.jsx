import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/LOGO1.png';
import useAuthStore from '../store/authStore';

const links = [
  { name: 'Home', href: '/' },
  { name: 'Curso', href: '/lista' },
  // { name: 'Contacto', href: '/contacto' }
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const isSupervisor = useAuthStore(state => state.isSupervisor);

  return (
    <nav className={`${isSupervisor ? 'bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 border-4 border-yellow-600 shadow-2xl animate-pulse' : 'bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 shadow-lg'} fixed w-full z-50 border-b border-gray-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Logo CEP" className="h-60 w-auto" /> 
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-10">
            <ul className="flex items-center space-x-10">
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
            <div className="flex items-center space-x-3 ml-6">
              <Link
                to="/login"
                className="bg-white border border-blue-600 text-blue-600 px-4 py-1.5 rounded-full hover:bg-blue-100 transition-all text-sm font-semibold"
              >
                Login
              </Link>
              <Link
                to="/registro"
                className="bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 transition-all text-sm font-semibold"
              >
                Registro
              </Link>
            </div>
          </div>

    
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            className="md:hidden text-white focus:outline-none"
          >
            {menuOpen ? 'Cerrar' : 'Menú'} 
          </button>
        </div>
      </div>

      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-6 pt-4 pb-6 bg-white shadow-md border-t border-gray-100 rounded-b-xl">
          <ul className="flex flex-col space-y-4 text-gray-700 font-medium">
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
          </ul>
          <div className="mt-6 flex flex-col space-y-3">
            <Link
              to="/login"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm font-medium text-center"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/registro"
              className="w-full bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition text-sm font-medium text-center"
              onClick={() => setMenuOpen(false)}
            >
              Registro
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
