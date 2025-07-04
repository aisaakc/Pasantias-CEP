const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyDxVCnyvpP3PXIW9xtVWsRpnR--8lvUTtE";
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

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) throw new Error('Error en la API de Gemini');
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sin respuesta';
} 