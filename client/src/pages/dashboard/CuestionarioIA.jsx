import React, { useState, useEffect } from "react";
import { sendMessageToGemini } from "../../api/gemini.api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListCheck, faCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { TreeSelect } from 'primereact/treeselect';
import { getJerarquiaDesde } from '../../api/clasificacion.api';
import { getAllCursos } from '../../api/curso.api';
import { CLASSIFICATION_IDS } from '../../config/classificationIds';
import 'primeicons/primeicons.css';

export default function CuestionarioIA() {
  const [contenido, setContenido] = useState("");
  const [cuestionario, setCuestionario] = useState(null);
  const [respuestas, setRespuestas] = useState([]);
  const [evaluado, setEvaluado] = useState(false);
  const [puntuacion, setPuntuacion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [treeSelectNodes, setTreeSelectNodes] = useState([]);
  const [selectedCohorte, setSelectedCohorte] = useState("");
  const [allCursos, setAllCursos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Cargar jerarquía de cohortes y cursos
  useEffect(() => {
    getJerarquiaDesde(CLASSIFICATION_IDS.INSTITUTOS)
      .then(res => {
        setTreeSelectNodes(toTreeSelectFormat(res.data));
      })
      .catch(() => {/* setJerarquiaCursos([]); */});
    getAllCursos()
      .then(res => setAllCursos(res.data?.data || []))
      .catch(() => setAllCursos([]));
  }, []);

  // Función para transformar la jerarquía a formato TreeSelect
  function toTreeSelectFormat(options) {
    return options.map(opt => ({
      key: String(opt.id),
      label: opt.nombre,
      value: opt.id,
      data: opt,
      isLeaf: (opt.nivel === 6 || opt.es_cohorte === true),
      ...(opt.hijos && opt.hijos.length > 0
        ? { children: toTreeSelectFormat(opt.hijos) }
        : {})
    }));
  }

  // Cuando selecciona cohorte, buscar descripcion_html
  useEffect(() => {
    if (!selectedCohorte) return;
    // Buscar el curso/cohorte correspondiente
    const curso = allCursos.find(c => String(c.id_curso) === String(selectedCohorte));
    if (curso && curso.descripcion_html) {
      setContenido(curso.descripcion_html);
    } else {
      setContenido("");
    }
  }, [selectedCohorte, allCursos]);

  // 1. Cargar el tema de PrimeReact como en ModalParticipante.jsx
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/primereact/resources/themes/lara-light-indigo/theme.css';
    link.id = 'primereact-theme';
    document.head.appendChild(link);
    return () => {
      const themeLink = document.getElementById('primereact-theme');
      if (themeLink) document.head.removeChild(themeLink);
    };
  }, []);

  // Función para limpiar HTML y obtener solo texto plano
  function stripHtmlTags(html) {
    if (!html) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  const handleGenerar = async () => {
    setLoading(true);
    setError(null);
    setEvaluado(false);
    setPuntuacion(0);
    setCuestionario(null);
    setRespuestas([]);
    try {
      // Limpiar el contenido de tags HTML antes de enviarlo a Gemini
      const contenidoPlano = stripHtmlTags(contenido);
      const prompt = `A partir del siguiente contenido de un curso, genera un cuestionario de 10 preguntas de opción múltiple. Cada pregunta debe tener 5 opciones (A, B, C, D, E), solo una correcta. Devuélvelo en formato JSON con este esquema: [{"pregunta": "...", "opciones": ["...", "...", "...", "...", "..."], "correcta": 0-4}]. Solo responde el JSON, sin explicaciones.\n\nContenido:\n${contenidoPlano}`;
      const respuesta = await sendMessageToGemini(prompt);
      // LOG: Mostrar la respuesta cruda de Gemini en consola
      console.log('[GEMINI RAW RESPONSE]', respuesta);
      // Intentar parsear el JSON de la respuesta
      const match = respuesta.match(/\[.*\]/s);
      const json = match ? match[0] : respuesta;
      const data = JSON.parse(json);
      setCuestionario(data);
      setRespuestas(Array(data.length).fill(null));
    } catch (e) {
      // LOG: Mostrar el error capturado en consola
      console.error('[GEMINI PARSE ERROR]', e);
      setError("No se pudo generar el cuestionario. Intenta con otro contenido o revisa el formato.\n\nRespuesta de Gemini:\n" + (typeof e === 'object' && e.message ? e.message : '') + (e?.response ? '\n' + JSON.stringify(e.response) : '') + (window?.lastGeminiResponse ? '\n' + window.lastGeminiResponse : ''));
      // Mostrar la respuesta cruda de Gemini si está disponible
      if (typeof window !== 'undefined') {
        window.lastGeminiResponse = e?.response?.data || '';
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSeleccion = (idxPregunta, idxOpcion) => {
    if (evaluado) return;
    const nuevas = [...respuestas];
    nuevas[idxPregunta] = idxOpcion;
    setRespuestas(nuevas);
  };

  const handleEvaluar = () => {
    if (!cuestionario) return;
    let puntos = 0;
    cuestionario.forEach((q, i) => {
      if (respuestas[i] === q.correcta) puntos++;
    });
    setPuntuacion(puntos);
    setEvaluado(true);
    setMostrarModal(true);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-8 py-10">
      <div className="mb-8 animate-fade-in text-left">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
          <FontAwesomeIcon icon={faListCheck} className="mr-3 text-blue-600" />
          Cuestionario <sup className="text-base align-super">(IA)</sup>
        </h1>
        <p className="text-gray-600 text-lg">Genera y responde cuestionarios automáticos basados en el contenido de tus cursos.</p>
      </div>
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="mb-6">
          <label className="block text-lg font-bold text-blue-700 mb-2 flex items-center gap-2">
            <FontAwesomeIcon icon={faListCheck} className="text-blue-600" />
            Selecciona una Cohorte
          </label>
          <div className="card flex justify-content-center p-0">
            <TreeSelect
              variant="filled"
              value={selectedCohorte}
              onChange={e => setSelectedCohorte(e.value)}
              options={treeSelectNodes}
              filter
              className="w-full md:w-80 custom-treeselect"
              placeholder={
                <span>
                  <FontAwesomeIcon icon={faListCheck} className="mr-2 text-blue-500" />
                  Selecciona la cohorte para generar el cuestionario
                </span>
              }
              panelStyle={{
                zIndex: 99999,
                background: 'linear-gradient(135deg, #e0f7fa 0%, #fff 100%)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                borderRadius: '18px',
                padding: '10px',
                animation: 'fadeInDown 0.3s'
              }}
              appendTo={typeof window !== 'undefined' ? document.body : undefined}
              emptyMessage="No hay cohortes disponibles"
            />
          </div>
          <style>{`
            @keyframes fadeInDown {
              from { opacity: 0; transform: translateY(-10px);}
              to { opacity: 1; transform: translateY(0);}
            }
            .custom-treeselect .p-treeselect-panel {
              border-radius: 18px !important;
              background: linear-gradient(135deg, #e0f7fa 0%, #fff 100%) !important;
              box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37) !important;
            }
            .custom-treeselect .p-treenode-content {
              transition: background 0.2s, color 0.2s;
              border-radius: 10px;
              margin: 2px 0;
              padding: 8px 12px;
            }
            .custom-treeselect .p-treenode-content:hover,
            .custom-treeselect .p-treenode-content.p-highlight {
              background: #b3e5fc !important;
              color: #01579b !important;
              font-weight: bold;
            }
            .custom-treeselect .p-treeselect-label {
              font-size: 1.1rem;
              color: #0277bd;
              font-weight: 500;
            }
            .custom-treeselect .pi {
              font-size: 1.3em;
              color: #039be5;
              margin-right: 8px;
            }
          `}</style>
        </div>
        <div
          className="w-full min-h-[120px] mb-3 p-4 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-400 transition disabled:bg-gray-100 prose max-w-none"
          style={{ fontSize: '1.1rem', color: '#333', background: '#f8fafc' }}
          dangerouslySetInnerHTML={{ __html: contenido || '<span class="text-gray-400">No hay contenido para esta cohorte.</span>' }}
        />
        <button
          onClick={handleGenerar}
          disabled={loading || !contenido.trim()}
          className="px-4 py-2 mb-6 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faListCheck} className="text-lg" />
          {loading ? "Generando..." : "Generar cuestionario"}
        </button>
        {error && <div className="text-red-500 mb-3">{error}</div>}
        {cuestionario && (
          <form onSubmit={e => { e.preventDefault(); handleEvaluar(); }}>
            {cuestionario.map((q, i) => (
              <React.Fragment key={i}>
                {i > 0 && <hr className="my-6 border-gray-200" />}
                <div className="mb-5 p-4 border border-gray-100 rounded-lg bg-gray-50 flex items-start gap-6 relative">
                  <div className="flex flex-col items-center min-w-[48px]">
                    <span className="text-5xl font-extrabold text-gray-300 select-none leading-none">{i + 1}</span>
                    {evaluado && (
                      respuestas[i] === q.correcta ? (
                        <FontAwesomeIcon icon={faCheck} className="text-green-500 text-3xl mt-2" />
                      ) : (
                        <FontAwesomeIcon icon={faCircleXmark} className="text-red-300 text-3xl mt-2" />
                      )
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 font-semibold text-lg">{q.pregunta}</div>
                    <div className="flex flex-col gap-1">
                      {q.opciones.map((op, j) => (
                        <label key={j} className={evaluado ? "cursor-not-allowed" : "cursor-pointer"}>
                          <input
                            type="radio"
                            name={`pregunta-${i}`}
                            checked={respuestas[i] === j}
                            onChange={() => handleSeleccion(i, j)}
                            disabled={evaluado}
                            className="mr-2 accent-blue-600"
                          /> {String.fromCharCode(65 + j)}. {op}
                        </label>
                      ))}
                    </div>
                    {evaluado && (
                      <div className={"mt-1 " + (respuestas[i] === q.correcta ? "text-green-600" : "text-red-500") }>
                        {respuestas[i] === q.correcta ? "¡Correcto!" : `Incorrecto. Respuesta correcta: ${String.fromCharCode(65 + q.correcta)}`}
                      </div>
                    )}
                  </div>
                </div>
              </React.Fragment>
            ))}
            {!evaluado && (
              <button type="submit" className="px-4 py-2 mt-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition flex items-center gap-2">
                <FontAwesomeIcon icon={faCheck} className="text-lg" />
                Evaluar
              </button>
            )}
          </form>
        )}
        {evaluado && mostrarModal && (
          <ModalResultado
            puntuacion={puntuacion}
            total={cuestionario.length}
            onClose={() => setMostrarModal(false)}
            onRetry={() => {
              const nuevoCuestionario = cuestionario.map(q => {
                const indices = q.opciones.map((_, idx) => idx);
                for (let i = indices.length - 1; i > 0; i--) {
                  const j = Math.floor(Math.random() * (i + 1));
                  [indices[i], indices[j]] = [indices[j], indices[i]];
                }
                const nuevasOpciones = indices.map(idx => q.opciones[idx]);
                const nuevaCorrecta = indices.indexOf(q.correcta);
                return {
                  ...q,
                  opciones: nuevasOpciones,
                  correcta: nuevaCorrecta
                };
              });
              setCuestionario(nuevoCuestionario);
              setRespuestas(Array(nuevoCuestionario.length).fill(null));
              setEvaluado(false);
              setPuntuacion(0);
              setMostrarModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
}

function ModalResultado({ puntuacion, total, onClose, onRetry }) {
  const [frase, setFrase] = React.useState('');
  const [recomendacion, setRecomendacion] = React.useState('');
  React.useEffect(() => {
    async function fetchFrase() {
      try {
        const prompt = `Eres un coach educativo. El usuario obtuvo ${puntuacion} de ${total} en un cuestionario. Escribe una frase de refuerzo o felicitación breve y positiva (máx 20 palabras). Luego, una recomendación para mejorar en los temas fallados, breve y concreta (máx 40 palabras). Separa ambos mensajes con un salto de línea o 'Recomendación:'.`;
        const respuesta = await sendMessageToGemini(prompt);
        // Separar frase y recomendación si es posible
        const partes = respuesta.split(/Recomendaci[oó]n[:：\n]/i);
        setFrase(partes[0]?.trim() || '¡Buen trabajo!');
        setRecomendacion(partes[1]?.split(' ').slice(0, 40).join(' ') + (partes[1]?.split(' ').length > 40 ? '...' : ''));
      } catch {
        setFrase('¡Buen trabajo!');
        setRecomendacion('Sigue repasando los temas donde tuviste errores.');
      }
    }
    fetchFrase();
  }, [puntuacion, total]);

  // Icono según cantidad de respuestas correctas
  let icono = faCheck;
  let color = 'text-green-500';
  if (puntuacion >= 8) { icono = faCheck; color = 'text-green-500'; }
  else if (puntuacion >= 5) { icono = faCheck; color = 'text-yellow-500'; }
  else { icono = faCircleXmark; color = 'text-red-400'; }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-lg w-full flex flex-col items-center animate-modal-in">
        <FontAwesomeIcon icon={icono} className={`text-7xl mb-4 ${color}`} />
        <div className="text-5xl font-extrabold mb-2 text-gray-800">{puntuacion} / {total}</div>
        <div className="text-lg font-semibold mb-2 text-gray-600">Puntaje obtenido</div>
        <div className="text-xl mb-2 text-justify text-gray-500 w-full" style={{textAlign: 'justify'}}>{frase || '¡Buen trabajo!'}</div>
        <hr className="w-full my-2 border-gray-200" />
        {recomendacion && <div className="text-base text-justify text-gray-400 mb-4 w-full" style={{textAlign: 'justify'}}>{recomendacion}</div>}
        <div className="flex gap-4 mt-2">
          <button onClick={onClose} className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Cerrar</button>
          <button onClick={onRetry} className="px-6 py-2 rounded-lg bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition flex items-center gap-2">
            <FontAwesomeIcon icon={faCircleXmark} className="text-lg" /> Reintentar
          </button>
        </div>
      </div>
      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modal-in { animation: modal-in 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
} 