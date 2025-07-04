const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyCHoo9AW5Y_1tFNw8LqL6oMEpJ_-c9FaA4"; 
// AIzaSyDfepsXtC5gp3mxrH3v7M9V3ClkuLAQe1M

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export async function sendMessageToGemini(message) {
  const body = {
    contents: [
      {
        parts: [
          { text: message }
        ]
      }
    ]
  };
  console.log('[GEMINI SERVICE] Body enviado a Gemini:', JSON.stringify(body));
  let response;
  try {
    response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
  } catch (err) {
    console.error('[GEMINI SERVICE] Error de fetch:', err);
    throw err;
  }
  if (!response.ok) {
    const errorText = await response.text();
    console.error('[GEMINI SERVICE] Respuesta no OK:', response.status, errorText);
    throw new Error('Error en la API de Gemini: ' + errorText);
  }
  const data = await response.json();
  console.log('[GEMINI SERVICE] Respuesta completa de Gemini:', JSON.stringify(data));
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sin respuesta';
} 