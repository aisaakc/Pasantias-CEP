import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const links = [
  { name: 'Home', href: '/' },
  { name: 'Curso', href: '/curso' },
  { name: 'Contacto', href: '/contacto' }
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm fixed w-full z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="text-2xl font-bold text-blue-600 tracking-tight">
            CEP
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-10">
            <ul className="flex items-center space-x-10">
              {links.map(link => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-700 font-medium relative group"
                  >
                    {link.name}
                    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Botones Login/Registro */}
            <div className="flex items-center space-x-3">
              <button className="bg-white border border-blue-600 text-blue-600 px-4 py-1.5 rounded-md hover:bg-blue-50 transition text-sm font-medium">
                Login
              </button>
              <button className="bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 transition text-sm font-medium">
                Registro
              </button>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
            className="md:hidden text-gray-700 focus:outline-none"
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
        <ul className="flex flex-col px-6 pt-4 pb-6 space-y-3 bg-white text-gray-700 font-medium shadow-md border-t border-gray-100">
          {links.map(link => (
            <li key={link.name}>
              <a
                href={link.href}
                className="block hover:text-blue-600 transition"
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </a>
            </li>
          ))}
          <li className="pt-4">
            <button className="w-full bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition text-sm font-medium mb-2">
              Login
            </button>
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm font-medium">
              Registro
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
