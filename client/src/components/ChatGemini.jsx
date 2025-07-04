import React, { useState } from "react";
import { sendMessageToGemini } from "../api/gemini.api";

export default function ChatGemini() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: "user", text: input }]);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const reply = await sendMessageToGemini(input);
      setMessages((msgs) => [...msgs, { from: "gemini", text: reply }]);
    } catch {
      setError("Error al comunicarse con Gemini");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", border: "1px solid #ccc", borderRadius: 8, padding: 16 }}>
      <h2>Chat con Gemini</h2>
      <div style={{ height: 250, overflowY: "auto", border: "1px solid #eee", marginBottom: 8, padding: 8, background: "#fafafa" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.from === "user" ? "right" : "left", margin: "8px 0" }}>
            <b>{msg.from === "user" ? "Tú" : "Gemini"}:</b> {msg.text}
          </div>
        ))}
        {loading && <div style={{ color: "#888" }}>Gemini está escribiendo...</div>}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleSend()}
        placeholder="Escribe tu mensaje..."
        style={{ width: "75%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
        disabled={loading}
      />
      <button onClick={handleSend} disabled={loading || !input.trim()} style={{ marginLeft: 8, padding: "8px 16px" }}>
        Enviar
      </button>
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
    </div>
  );
} 