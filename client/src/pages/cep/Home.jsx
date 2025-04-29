import React, { useState, useEffect } from "react";

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
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-6">
      {/* Sección de introducción */}
      <section className="max-w-4xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-extrabold text-indigo-700 mb-4">¿Qué es el CEP?</h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          {cepDescription}
        </p>
      </section>

      {/* Cursos Destacados */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-indigo-700 text-center mb-12">
          Cursos Destacados
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {cursos.map((curso) => (
            <div
              key={curso.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-lg transition-all hover:scale-[1.03] hover:shadow-xl hover:-translate-y-1"
            >
              <img
                src={curso.image}
                alt={curso.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-indigo-700 mb-2 hover:text-indigo-900 transition-colors">
                  {curso.title}
                </h3>
                <p className="text-gray-600 text-sm">{curso.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
