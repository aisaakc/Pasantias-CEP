import React, { useState } from "react";
import { sendMessageToGemini } from "../../api/gemini.api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListCheck } from '@fortawesome/free-solid-svg-icons';

export default function CuestionarioIA() {
  const [contenido, setContenido] = useState("");
  const [cuestionario, setCuestionario] = useState(null);
  const [respuestas, setRespuestas] = useState([]);
  const [evaluado, setEvaluado] = useState(false);
  const [puntuacion, setPuntuacion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerar = async () => {
    setLoading(true);
    setError(null);
    setEvaluado(false);
    setPuntuacion(0);
    setCuestionario(null);
    setRespuestas([]);
    try {
      const prompt = `A partir del siguiente contenido de un curso, genera un cuestionario de 10 preguntas de opción múltiple. Cada pregunta debe tener 5 opciones (A, B, C, D, E), solo una correcta. Devuélvelo en formato JSON con este esquema: [{"pregunta": "...", "opciones": ["...", "...", "...", "...", "..."], "correcta": 0-4}]. Solo responde el JSON, sin explicaciones.\n\nContenido:\n${contenido}`;
      const respuesta = await sendMessageToGemini(prompt);
      // Intentar parsear el JSON de la respuesta
      const match = respuesta.match(/\[.*\]/s);
      const json = match ? match[0] : respuesta;
      const data = JSON.parse(json);
      setCuestionario(data);
      setRespuestas(Array(data.length).fill(null));
    } catch (e) {
      setError("No se pudo generar el cuestionario. Intenta con otro contenido o revisa el formato.");
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
        <textarea
          value={contenido}
          onChange={e => setContenido(e.target.value)}
          placeholder="Pega aquí el contenido del curso (puede ser HTML o texto plano)"
          className="w-full min-h-[120px] mb-3 p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 transition disabled:bg-gray-100"
          disabled={loading}
        />
        <button
          onClick={handleGenerar}
          disabled={loading || !contenido.trim()}
          className="px-4 py-2 mb-6 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? "Generando..." : "Generar cuestionario"}
        </button>
        {error && <div className="text-red-500 mb-3">{error}</div>}
        {cuestionario && (
          <form onSubmit={e => { e.preventDefault(); handleEvaluar(); }}>
            {cuestionario.map((q, i) => (
              <div key={i} className="mb-5 p-4 border border-gray-100 rounded-lg bg-gray-50">
                <div className="mb-1 font-semibold">{i + 1}. {q.pregunta}</div>
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
            ))}
            {!evaluado && (
              <button type="submit" className="px-4 py-2 mt-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition">
                Evaluar
              </button>
            )}
            {evaluado && (
              <div className="font-bold text-lg mt-4">
                Puntuación: {puntuacion} / {cuestionario.length}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
} 