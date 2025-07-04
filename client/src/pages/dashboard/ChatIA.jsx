import React from "react";
import ChatGemini from "../../components/ChatGemini";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot } from '@fortawesome/free-solid-svg-icons';

export default function ChatIA() {
  return (
    <div className="max-w-[1400px] mx-auto px-8 py-10">
      <div className="mb-8 animate-fade-in text-left">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
          <FontAwesomeIcon icon={faRobot} className="mr-3 text-blue-600" />
          Chat <sup className="text-base align-super">(IA)</sup>
        </h1>
        <p className="text-gray-600 text-lg">Interactúa con la inteligencia artificial para resolver dudas o generar ideas sobre tus cursos.</p>
      </div>
      <div className="bg-white rounded-xl shadow-md p-8">
        <ChatGemini />
      </div>
    </div>
  );
} 