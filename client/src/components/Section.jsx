import React from 'react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <div className="flex w-1/2 min-h-screen bg-gradient-to-br from-blue-900 to-blue-600 justify-center items-center p-10">
    <div className="text-white text-center space-y-6 max-w-md">
      <div className="mx-auto text-white w-12 h-12 drop-shadow-md text-4xl">
        🎓
      </div>

      <h1 className="text-4xl font-bold leading-tight drop-shadow-md">
        Coordinación de Extensión Profesional
      </h1>

      <p className="text-lg">
        Fomentamos la formación continua mediante cursos, talleres y diplomados que potencian tu desarrollo profesional.
      </p>

      <div>
        <Link
          to="/"
          className="inline-block bg-white text-blue-600 font-semibold py-2 px-6 rounded-full shadow hover:bg-gray-100 transition-all"
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  </div>
  );
}
