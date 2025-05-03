import React from 'react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <div className="flex w-1/2 min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 justify-center items-center p-10 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
      </div>

      <div className="text-white text-center space-y-8 max-w-md relative z-10 transform hover:scale-[1.02] transition-transform duration-300">
        <div className="mx-auto text-white w-16 h-16 drop-shadow-lg text-5xl animate-float">
          🎓
        </div>

        <h1 className="text-5xl font-bold leading-tight drop-shadow-lg tracking-tight animate-bounce-sway">
          Coordinación de Extensión Profesional
        </h1>

        <p className="text-xl text-blue-100 leading-relaxed">
          Fomentamos la formación continua mediante cursos, talleres y diplomados que potencian tu desarrollo profesional.
        </p>

        <div className="pt-4">
          <Link
            to="/"
            className="inline-block bg-white text-blue-600 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-blue-50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 transform"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

// Add this to your global CSS file
// @keyframes float {
//   0% { transform: translateY(0px); }
//   50% { transform: translateY(-10px); }
//   100% { transform: translateY(0px); }
// }
// .animate-float {
//   animation: float 3s ease-in-out infinite;
// }
// @keyframes bounce-sway {
//   0% { 
//     transform: translate(0, 0) scale(1);
//   }
//   25% { 
//     transform: translate(-8px, -5px) scale(1.05);
//   }
//   50% { 
//     transform: translate(0, 0) scale(1);
//   }
//   75% { 
//     transform: translate(8px, -5px) scale(1.05);
//   }
//   100% { 
//     transform: translate(0, 0) scale(1);
//   }
// }
// .animate-bounce-sway {
//   animation: bounce-sway 3s ease-in-out infinite;
//   display: inline-block;
// }
