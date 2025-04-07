import React from 'react';
import { GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <div className="flex w-1/2 bg-gradient-to-br from-blue-900 to-blue-600 justify-center items-center p-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-white text-center space-y-6 max-w-md"
      >
        <GraduationCap className="mx-auto text-white w-12 h-12 drop-shadow-md" />

        <h1 className="text-4xl font-bold leading-tight drop-shadow-md">
          Coordinación de Extensión Profesional
        </h1>

        <p className="text-lg">
          Fomentamos la formación continua mediante cursos, talleres y diplomados que potencian tu desarrollo profesional.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Link
            to="/"
            className="inline-block bg-white text-blue-600 font-semibold py-2 px-6 rounded-full shadow hover:bg-gray-100 transition-all"
          >
            Volver al Inicio
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
