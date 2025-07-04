import React, { useRef, useState, useEffect } from "react";
import { useCursoStore } from '../../store/cursoStore';
import { getDocumentosByIds } from '../../api/documento.api';
import { hashDeterministaPorId } from '../../utils/hashUtils';
import { CLASSIFICATION_IDS } from '../../config/classificationIds';

const IMAGEN_DEFECTO =  'http://localhost:3001/docs/322a386021399414b75613478bbcd9e3.png';
const getExtWithDot = (ext) => {
  if (!ext) return '';
  return ext.startsWith('.') ? ext : '.' + ext;
};

export default function Home() {
  const [cepDescription, setCepDescription] = useState("");
  const { cursos, fetchCursos, loading } = useCursoStore();
  const [documentosMap, setDocumentosMap] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);
  const carruselRef = useRef(null);

  useEffect(() => {
    setCepDescription(
      "La Coordinación de Extensión Profesional (CEP) ofrece una variedad de cursos para el desarrollo de habilidades profesionales."
    );
    fetchCursos();
  }, [fetchCursos]);

  useEffect(() => {
    if (!cursos || cursos.length === 0) return;
    const allDocIds = Array.from(new Set(
      cursos.flatMap(c => {
        if (Array.isArray(c.documentos)) return c.documentos;
        if (typeof c.documentos === 'string' && c.documentos.startsWith('[')) {
          try { return JSON.parse(c.documentos); } catch { return []; }
        }
        return [];
      })
    ));
    if (allDocIds.length === 0) return;
    getDocumentosByIds(allDocIds)
      .then(res => {
        const map = {};
        (res.data?.data || []).forEach(doc => {
          map[doc.id_documento] = doc;
        });
        setDocumentosMap(map);
      })
      .catch(() => setDocumentosMap({}));
  }, [cursos]);

  const scroll = (dir) => {
    const node = carruselRef.current;
    if (!node) return;
    const cardWidth = node.firstChild ? node.firstChild.offsetWidth : 300;
    node.scrollBy({ left: dir * (cardWidth + 24), behavior: 'smooth' });
    let newIndex = activeIndex + dir;
    if (newIndex < 0) newIndex = 0;
    if (newIndex > cursos.length - 1) newIndex = cursos.length - 1;
    setActiveIndex(newIndex);
  };

  const handleScroll = () => {
    const node = carruselRef.current;
    if (!node) return;
    const scrollLeft = node.scrollLeft;
    const cardWidth = node.firstChild ? node.firstChild.offsetWidth + 24 : 300;
    const idx = Math.round(scrollLeft / cardWidth);
    setActiveIndex(idx);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-6">
      {/* Sección de introducción */}
      <section className="max-w-4xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-extrabold text-indigo-700 mb-4">¿Qué es el CEP?</h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          {cepDescription}
        </p>
      </section>

      {/* Carrusel de cursos destacados */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-indigo-700 text-center mb-12">
          Cursos Destacados
        </h2>
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
            {loading ? (
              <div className="text-center w-full py-10 text-gray-500">Cargando cursos...</div>
            ) : cursos.length === 0 ? (
              <div className="text-center w-full py-10 text-gray-500">No hay cursos disponibles.</div>
            ) : (
              cursos.map((curso, idx) => {
                // Asegurar que documentos sea un array
                let documentosIds = [];
                if (Array.isArray(curso.documentos)) {
                  documentosIds = curso.documentos;
                } else if (typeof curso.documentos === 'string' && curso.documentos.startsWith('[')) {
                  try {
                    documentosIds = JSON.parse(curso.documentos);
                  } catch {
                    documentosIds = [];
                  }
                }
                // Buscar documento IM_CARRUSEL
                let imagenUrl = IMAGEN_DEFECTO;
                if (documentosIds.length > 0) {
                  const docCarrusel = documentosIds
                    .map(id => documentosMap[id])
                    .find(doc => doc && String(doc.id_tipo) === String(CLASSIFICATION_IDS.IM_CARRUSEL));
                  if (docCarrusel) {
                    const hash = hashDeterministaPorId(docCarrusel.id_documento);
                    imagenUrl = `http://localhost:3001/docs/${hash}${getExtWithDot(docCarrusel.ext)}`;
                  }
                }
                return (
                  <div
                    key={curso.id_curso || curso.id || idx}
                    className={`relative min-w-[320px] max-w-xs w-full bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-500 group border border-gray-200 hover:border-blue-400 snap-center
                      ${activeIndex === idx ? 'scale-105 z-10' : 'scale-95 opacity-80'} animate-slideIn`}
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={imagenUrl}
                        alt={curso.nombre_curso}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 right-2 bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full shadow font-semibold opacity-90">
                        Nuevo
                      </div>
                    </div>
                    <div className="p-6 flex flex-col gap-3">
                      <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                        {curso.nombre_curso}
                      </h2>
                      <p className="text-gray-700 text-sm mb-2">
                        {curso.descripcion_corto || 'Sin descripción.'}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
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
      </section>
    </div>
  );
}
