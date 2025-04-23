import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const cursosDestacados = [
  {
    id: 1,
    title: "Curso de Desarrollo Web",
    description: "Aprende a crear sitios web con HTML, CSS y JavaScript.",
    image: "https://via.placeholder.com/300",
  },
  {
    id: 2,
    title: "Curso de React",
    description: "Aprende a crear aplicaciones dinámicas con React.",
    image: "https://via.placeholder.com/300",
  },
  {
    id: 3,
    title: "Curso de Python",
    description: "Inicia tu camino en la programación con Python.",
    image: "https://via.placeholder.com/300",
  },
];

export default function Home() {
  const [cepDescription, setCepDescription] = useState("");
  const [cursos, setCursos] = useState(cursosDestacados);

  useEffect(() => {
    setCepDescription(
      "La Coordinación de Extensión Profesional (CEP) ofrece una variedad de cursos para el desarrollo de habilidades profesionales."
    );
  }, []);

  return (
    <div className="min-h-screen pt-20 py-16 px-6 ">
      
      <motion.section
        className="text-center max-w-3xl mx-auto mb-16"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-4xl font-bold text-indigo-700 mb-4">¿Qué es el CEP?</h2>
        <p className="text-lg text-gray-700 leading-relaxed">{cepDescription}</p>
      </motion.section>

      {/* Cursos Destacados */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-indigo-700 text-center mb-10">Cursos Destacados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {cursos.map((curso, index) => (
            <motion.div
              key={curso.id}
              className="bg-white rounded-2xl overflow-hidden border border-transparent shadow-md"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.2,
                duration: 0.6,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{
                scale: 1.05,
                y: -10,
                boxShadow: "0 12px 25px rgba(99,102,241,0.3)",
              }}
              whileTap={{ scale: 0.97 }}
            >
              <img
                src={curso.image}
                alt={curso.title}
                className="w-full h-52 object-cover"
              />
              <div className="p-5">
                <h3 className="text-xl font-semibold text-indigo-700 mb-2 hover:text-indigo-900 transition-colors">
                  {curso.title}
                </h3>
                <p className="text-gray-600">{curso.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
