import React, { useRef, useState } from 'react'
import { toast } from 'sonner';

const cursos = [
  {
    id: 1,
    nombre: 'React desde Cero',
    descripcion: 'Aprende React y crea aplicaciones web modernas.',
    detalles: 'Curso completo de React, hooks, context, router y mejores prácticas. Incluye proyecto final.',
    imagen: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 2,
    nombre: 'Node.js Profesional',
    descripcion: 'Domina el backend con Node.js y Express.',
    detalles: 'Aprende a crear APIs, manejar bases de datos y autenticar usuarios con Node.js.',
    imagen: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 3,
    nombre: 'Diseño UI/UX',
    descripcion: 'Crea interfaces atractivas y funcionales.',
    detalles: 'Principios de diseño, wireframes, prototipos y herramientas modernas de UI/UX.',
    imagen: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 4,
    nombre: 'Python para Todos',
    descripcion: 'Iníciate en la programación con Python.',
    detalles: 'Sintaxis básica, estructuras de datos, scripts y automatización con Python.',
    imagen: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 5,
    nombre: 'Machine Learning',
    descripcion: 'Descubre el mundo de la inteligencia artificial.',
    detalles: 'Fundamentos de ML, algoritmos, librerías y casos prácticos con Python.',
    imagen: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80',
  },
];

function ModalCursoDetalle({ open, onClose, curso }) {
  if (!open || !curso) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fadeInUp">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <span className="text-2xl">&times;</span>
        </button>
        <img src={curso.imagen} alt={curso.nombre} className="w-full h-48 object-cover rounded-xl mb-6" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{curso.nombre}</h2>
        <p className="text-gray-600 mb-4">{curso.descripcion}</p>
        <p className="text-gray-700 mb-6">{curso.detalles}</p>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg bg-white border border-blue-500 text-blue-600 font-semibold shadow-md hover:bg-blue-50 transition-all duration-300"
          >
            Cerrar
          </button>
          <button
            onClick={() => { toast.success('¡Inscripción exitosa!'); onClose(); }}
            className="flex-1 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold shadow-md hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 animate-pulse hover:animate-none"
          >
            Inscribirse
          </button>
        </div>
      </div>
    </div>
  );
}

function ListCursos() {
  const [modalOpen, setModalOpen] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const carruselRef = useRef(null);

  const scroll = (dir) => {
    const node = carruselRef.current;
    if (!node) return;
    const cardWidth = node.firstChild ? node.firstChild.offsetWidth : 300;
    node.scrollBy({ left: dir * (cardWidth + 24), behavior: 'smooth' });
    // Calcular el nuevo índice activo
    let newIndex = activeIndex + dir;
    if (newIndex < 0) newIndex = 0;
    if (newIndex > cursos.length - 1) newIndex = cursos.length - 1;
    setActiveIndex(newIndex);
  };

  // Actualizar el índice activo al hacer scroll manual
  const handleScroll = () => {
    const node = carruselRef.current;
    if (!node) return;
    const scrollLeft = node.scrollLeft;
    const cardWidth = node.firstChild ? node.firstChild.offsetWidth + 24 : 300;
    const idx = Math.round(scrollLeft / cardWidth);
    setActiveIndex(idx);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-12 text-center animate-fadeInUp">
          Biblioteca de Cursos
        </h1>
        <div className="relative">
          {/* Flechas glass */}
          <button
            onClick={() => scroll(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-blue-50 text-blue-700 shadow-lg border border-gray-200 rounded-full p-3 transition-all duration-300 hidden md:block"
            aria-label="Anterior"
            style={{ left: '-2.5rem' }}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            onClick={() => scroll(1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-blue-50 text-blue-700 shadow-lg border border-gray-200 rounded-full p-3 transition-all duration-300 hidden md:block"
            aria-label="Siguiente"
            style={{ right: '-2.5rem' }}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
          {/* Carrusel */}
          <div
            ref={carruselRef}
            onScroll={handleScroll}
            className="flex gap-8 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 snap-x snap-mandatory"
            style={{ scrollBehavior: 'smooth' }}
          >
            {cursos.map((curso, idx) => (
              <div
                key={curso.id}
                className={`relative min-w-[300px] max-w-xs w-full bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-500 group border border-gray-200 hover:border-blue-400 snap-center
                  ${activeIndex === idx ? 'scale-105 z-10' : 'scale-95 opacity-80'} animate-slideIn`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={curso.imagen}
                    alt={curso.nombre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Etiqueta "Nuevo" más discreta */}
                  <div className="absolute top-2 right-2 bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full shadow font-semibold opacity-90">
                    Nuevo
                  </div>
                </div>
                <div className="p-6 flex flex-col gap-3">
                  <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                    {curso.nombre}
                  </h2>
                  <p className="text-gray-600 text-sm flex-1">
                    {curso.descripcion}
                  </p>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => { setCursoSeleccionado(curso); setModalOpen(true); }}
                      className="flex-1 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-all duration-300 hover:scale-105"
                    >
                      Ver más
                    </button>
                    <button
                      onClick={() => toast.success('¡Inscripción exitosa!')}
                      className="flex-1 py-2 rounded-lg bg-white border border-blue-500 text-blue-600 font-semibold shadow hover:bg-blue-50 hover:scale-105 transition-all duration-300"
                    >
                      Inscribirse
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Dots de posición */}
          <div className="flex justify-center mt-6 gap-2">
            {cursos.map((_, idx) => (
              <span
                key={idx}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${activeIndex === idx ? 'bg-blue-500 scale-125' : 'bg-gray-300'}`}
              ></span>
            ))}
          </div>
        </div>
        <ModalCursoDetalle open={modalOpen} onClose={() => setModalOpen(false)} curso={cursoSeleccionado} />
      </div>
    </div>
  )
}

export default ListCursos