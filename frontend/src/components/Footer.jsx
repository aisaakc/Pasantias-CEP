import { Facebook, Instagram, X } from "lucide-react";
import logo from '../assets/logo.png';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 text-white py-10 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col items-center space-y-6">
        
        {/* Logo + Descripción */}
        <div className="flex flex-col items-center">
          <img src={logo} alt="Logo CEP" className="h-12 w-auto" />
          <p className="text-sm mt-2 text-white/80 text-center">
            Coordinación de Extensión Profesional
          </p>
        </div>

        {/* Íconos redes sociales */}
        <div className="flex space-x-6">
          <a href="https://facebook.com/tu_usuario" aria-label="Facebook" className="hover:text-blue-300 transition-colors">
            <Facebook size={24} />
          </a>
          <a href="https://instagram.com/tu_usuario" aria-label="Instagram" className="hover:text-pink-300 transition-colors">
            <Instagram size={24} />
          </a>
          <a href="https://x.com/tu_usuario" aria-label="X" className="hover:text-gray-300 transition-colors">
            <X size={24} />
          </a>
        </div>

        {/* Derechos reservados */}
        <p className="text-xs text-white/70 text-center">
          © {new Date().getFullYear()} CEP. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
