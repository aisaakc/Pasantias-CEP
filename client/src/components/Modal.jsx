import React, { useEffect, useState } from 'react';

const Modal = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      // Cuando se cierra la modal, damos tiempo a la animación
      setTimeout(() => setIsVisible(false), 500); 
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center items-center bg-opacity-60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
    >
      <div
        className={`relative m-4 p-8 w-2/5 min-w-[40%] max-w-[40%] rounded-lg bg-white shadow-lg transform transition-all duration-500 ease-out ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}`}
      >
        <div className="flex items-center pb-4 text-xl font-medium text-slate-800">
          Agregar Nueva Clasificación
        </div>

        <div className="relative border-t border-slate-200 py-4 leading-normal text-slate-600 font-light">
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            placeholder="Nombre de la clasificación"
            className="mt-2 p-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <label className="block mt-4 text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            placeholder="Descripción de la clasificación"
            className="mt-2 p-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div className="flex justify-end pt-4 space-x-4">
          <button
            onClick={onClose}
            className="py-2 px-4 border border-transparent text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            Cancelar
          </button>
          <button
            className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
