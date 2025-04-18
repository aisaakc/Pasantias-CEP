import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/LOGO1.png'; // 👈 importa el logo

const links = [
  { name: 'Home', href: '/' },
  { name: 'Curso', href: '/lista' },
  { name: 'Contacto', href: '/contacto' }
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

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

            {/* Botones Login/Registro */}
            <div className="flex items-center space-x-5">
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
            </div>
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
          <li className="pt-4 space-y-2">
            <Link
              to="/login"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm font-medium"
            >
              Login
            </Link>
            <Link
              to="/registro"
              className="w-full bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition text-sm font-medium"
            >
              Registro
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
