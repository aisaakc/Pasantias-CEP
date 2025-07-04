export async function sendMessageToGemini(message) {
  const response = await fetch("/api/gemini/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });
  if (!response.ok) throw new Error("Error al comunicarse con el backend");
  const data = await response.json();
  return data.reply || "Sin respuesta";
} 