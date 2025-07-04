import { sendMessageToGemini } from '../services/geminiService.js';

export async function chatWithGemini(req, res) {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'El mensaje es requerido' });
  }
  try {
    const reply = await sendMessageToGemini(message);
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ error: 'Error al comunicarse con Gemini' });
  }
} 