import { sendMessageToGemini } from '../services/geminiService.js';

export async function chatWithGemini(req, res) {
  const { message } = req.body;
  console.log('[GEMINI API] Mensaje recibido:', message);
  if (!message) {
    console.log('[GEMINI API] Error: mensaje vacío');
    return res.status(400).json({ error: 'El mensaje es requerido' });
  }
  try {
    const reply = await sendMessageToGemini(message);
    console.log('[GEMINI API] Respuesta de Gemini:', reply);
    res.json({ reply });
  } catch (error) {
    console.error('[GEMINI API] Error al comunicarse con Gemini:', error);
    res.status(500).json({ error: 'Error al comunicarse con Gemini', detalle: error?.message || error });
  }
} 