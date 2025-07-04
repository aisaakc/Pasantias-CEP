import React, { useState } from "react";
import { sendMessageToGemini } from "../../api/gemini.api";

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
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 24 }}>
      <h1>Cuestionario (IA)</h1>
      <textarea
        value={contenido}
        onChange={e => setContenido(e.target.value)}
        placeholder="Pega aquí el contenido del curso (puede ser HTML o texto plano)"
        style={{ width: "100%", minHeight: 120, marginBottom: 12, padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
        disabled={loading}
      />
      <button onClick={handleGenerar} disabled={loading || !contenido.trim()} style={{ padding: "8px 16px", marginBottom: 24 }}>
        {loading ? "Generando..." : "Generar cuestionario"}
      </button>
      {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
      {cuestionario && (
        <form onSubmit={e => { e.preventDefault(); handleEvaluar(); }}>
          {cuestionario.map((q, i) => (
            <div key={i} style={{ marginBottom: 18, padding: 12, border: "1px solid #eee", borderRadius: 6 }}>
              <div style={{ marginBottom: 6 }}><b>{i + 1}. {q.pregunta}</b></div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {q.opciones.map((op, j) => (
                  <label key={j} style={{ cursor: evaluado ? "not-allowed" : "pointer" }}>
                    <input
                      type="radio"
                      name={`pregunta-${i}`}
                      checked={respuestas[i] === j}
                      onChange={() => handleSeleccion(i, j)}
                      disabled={evaluado}
                    /> {String.fromCharCode(65 + j)}. {op}
                  </label>
                ))}
              </div>
              {evaluado && (
                <div style={{ marginTop: 6, color: respuestas[i] === q.correcta ? "green" : "red" }}>
                  {respuestas[i] === q.correcta ? "¡Correcto!" : `Incorrecto. Respuesta correcta: ${String.fromCharCode(65 + q.correcta)}`}
                </div>
              )}
            </div>
          ))}
          {!evaluado && (
            <button type="submit" style={{ padding: "8px 16px", marginTop: 12 }}>Evaluar</button>
          )}
          {evaluado && (
            <div style={{ fontWeight: "bold", fontSize: 18, marginTop: 16 }}>
              Puntuación: {puntuacion} / {cuestionario.length}
            </div>
          )}
        </form>
      )}
    </div>
  );
} 