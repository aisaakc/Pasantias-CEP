import React, { useRef, useState, useEffect } from 'react'
import { useCursoStore } from '../../store/cursoStore';
import ModalParticipante from '../../components/ModalParticipante';
import { getDocumentosByIds } from '../../api/documento.api';
import { hashDeterministaPorId } from '../../utils/hashUtils';
import { CLASSIFICATION_IDS } from '../../config/classificationIds';
import { EditorContenidoCurso } from '../../components/ModalCurso';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';

// const IMAGEN_DEFECTO = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80';
const IMAGEN_DEFECTO =  'http://localhost:3001/docs/322a386021399414b75613478bbcd9e3.png';

const getExtWithDot = (ext) => {
  if (!ext) return '';
  return ext.startsWith('.') ? ext : '.' + ext;
};

function ModalCursoDetalle({ open, onClose, curso, documentosMap }) {
  if (!open || !curso) return null;
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
  let imagenUrl = IMAGEN_DEFECTO;
  if (documentosIds.length > 0 && documentosMap) {
    const docCarrusel = documentosIds
      .map(id => documentosMap[id])
      .find(doc => doc && String(doc.id_tipo) === String(CLASSIFICATION_IDS.IM_CARRUSEL));
    if (docCarrusel) {
      const hash = hashDeterministaPorId(docCarrusel.id_documento);
      imagenUrl = `http://localhost:3001/docs/${hash}${getExtWithDot(docCarrusel.ext)}`;
    }
  }
  let editorStateReadOnly = EditorState.createEmpty();
  if (curso.descripcion_html) {
    const blocksFromHTML = convertFromHTML(curso.descripcion_html);
    const contentState = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    editorStateReadOnly = EditorState.createWithContent(contentState);
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border-2 border-blue-200 shadow-xl w-full max-w-5xl md:max-w-4xl sm:max-w-lg p-0 relative animate-fadeInUp mx-2 max-h-[90vh] flex flex-col rounded-3xl focus-within:ring-2 focus-within:ring-blue-100">
        <div className="sticky top-0 z-10 bg-white/95 rounded-t-3xl p-6 flex items-center justify-between border-b border-blue-100 shadow-sm">
          <h2 className="text-2xl font-bold text-blue-600 mb-0 tracking-tight">{curso.nombre_curso}</h2>
          <button
            onClick={onClose}
            className="text-blue-300 hover:text-blue-500 p-2 rounded-full hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors text-2xl shadow"
            aria-label="Cerrar"
          >
            &times;
          </button>
        </div>
        <div className="overflow-y-auto px-8 pb-6 pt-2" style={{ maxHeight: 'calc(90vh - 120px)' }}>
          <img src={imagenUrl} alt={curso.nombre_curso} className="w-full h-40 sm:h-28 object-cover rounded-2xl mb-8 shadow border border-blue-100" />
          <EditorContenidoCurso editorState={editorStateReadOnly} readOnly={true} />
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-8 shadow-sm">
            <h3 className="font-bold text-blue-600 mb-2 text-base">FORMA DE PAGO:</h3>
            <ul className="text-gray-700 text-base list-disc pl-5 space-y-1">
              <li>Transferencia Bancaria (tasa de cambio oficial de Banco Central de Venezuela):</li>
              <li><b>Banco Mercantil</b></li>
              <li>Cuenta Corriente Nro. 0105-0083-44-1083100815</li>
              <li>Titular: IUJO, A.C</li>
              <li>Rif: J-30576524-3</li>
              <li>Efectivo en Divisas y punto de ventas (en la caja principal de la sede)</li>
            </ul>
          </div>
        </div>
        <div className="sticky bottom-0 z-10 bg-white/95 rounded-b-3xl p-6 flex gap-4 flex-col sm:flex-row border-t border-blue-100 shadow-sm">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-lg bg-white border border-blue-300 text-blue-600 font-semibold shadow-md hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 text-base focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            Cerrar
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
  const [modalParticipanteOpen, setModalParticipanteOpen] = useState(false);
  const carruselRef = useRef(null);
  const [documentosMap, setDocumentosMap] = useState({});

  const { cursos, fetchCursos, loading } = useCursoStore();

  useEffect(() => {
    fetchCursos();
  }, [fetchCursos]);

  // Obtener documentos de todos los cursos
  useEffect(() => {
    if (!cursos || cursos.length === 0) return;
    // Extraer todos los IDs de documentos únicos
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
        // LOG: Verifica los documentos que llegan
        console.log('[DEBUG] Documentos recibidos del backend:', res.data?.data);
        // Crear un mapa id_documento -> documento
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
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-12 text-center animate-fadeInUp">
          Biblioteca de Cursos
        </h1>
        <button
          className="block mx-auto mt-6 mb-8 bg-white border border-blue-400 text-blue-600 font-semibold py-3 px-8 rounded-full shadow-md transition-all duration-300 flex items-center gap-3 text-lg hover:bg-blue-50 hover:border-blue-500 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
          onClick={() => setModalParticipanteOpen(true)}
        >
          <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z' /><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' /></svg>
          Participa en un curso
        </button>
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
                    console.log(`[CARD-IMG] Curso: ${curso.nombre_curso} | Documento ID: ${docCarrusel.id_documento} | Link: ${imagenUrl}`);
                  }
                }
                return (
                  <div
                    key={curso.id_curso || curso.id || idx}
                    className={`relative min-w-[300px] max-w-xs w-full bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-500 group border border-gray-200 hover:border-blue-400 snap-center
                      ${activeIndex === idx ? 'scale-105 z-10' : 'scale-95 opacity-80'} animate-slideIn`}
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="relative h-52 overflow-hidden">
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
                     
                      <p className="text-gray-700 text-sm">
                        <b>Horario:</b> {curso.fecha_hora_inicio ? `${new Date(curso.fecha_hora_inicio).toLocaleDateString()} ` : ''}
                        {curso.fecha_hora_inicio ? new Date(curso.fecha_hora_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'No definido'}
                        - {curso.fecha_hora_fin ? new Date(curso.fecha_hora_fin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'No definido'}
                      </p>
                      <p className="text-gray-700 text-sm">
                        <b>Modalidad:</b> {curso.modalidad || 'No definida'}
                      </p>
                      <p className="text-gray-700 text-sm">
                        <b>Facilitador:</b> {curso.nombre_completo_facilitador || 'No definido'}
                      </p>
                      <p className="text-gray-700 text-sm mb-2">
                        <b>Costo:</b> {curso.costo !== undefined && curso.costo !== null ? `${curso.costo} $` : 'No definido'}
                      </p>
                      <div className="flex gap-3 mt-2">
                        <button
                          onClick={() => { setCursoSeleccionado(curso); setModalOpen(true); }}
                          className="flex-1 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-all duration-300 hover:scale-105"
                        >
                          Ver más
                        </button>
                      </div>
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
        <ModalCursoDetalle open={modalOpen} onClose={() => setModalOpen(false)} curso={cursoSeleccionado} documentosMap={documentosMap} />
        {modalParticipanteOpen && (
          <ModalParticipante onClose={() => setModalParticipanteOpen(false)} />
        )}
      </div>
    </div>
  )
}

export default ListCursos