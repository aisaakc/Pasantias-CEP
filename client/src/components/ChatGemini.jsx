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
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700 flex items-center gap-2">
        <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
        Chat con Gemini
      </h2>
      <div className="h-64 overflow-y-auto border border-gray-100 rounded-lg mb-4 p-3 bg-gray-50 flex flex-col gap-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={
              msg.from === "user"
                ? "flex justify-end"
                : "flex justify-start"
            }
          >
            <div
              className={
                (msg.from === "user"
                  ? "bg-blue-600 text-white rounded-br-2xl rounded-tl-2xl rounded-bl-md"
                  : "bg-gray-200 text-gray-900 rounded-bl-2xl rounded-tr-2xl rounded-br-md") +
                " px-4 py-2 max-w-[80%] shadow"
              }
            >
              <span className="block text-xs font-semibold mb-1">
                {msg.from === "user" ? "Tú" : "Gemini"}
              </span>
              <span className="whitespace-pre-line break-words">{msg.text}</span>
            </div>
          </div>
        ))}
        {loading && <div className="text-gray-500 text-sm">Gemini está escribiendo...</div>}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder="Escribe tu mensaje..."
          className="flex-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 transition disabled:bg-gray-100"
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="px-5 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Enviar
        </button>
      </div>
      {error && <div className="text-red-500 mt-3">{error}</div>}
    </div>
  );
} 