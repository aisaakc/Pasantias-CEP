// frontend/src/components/Modal.jsx
import React from 'react';
// Puedes importar iconos si el botón de cerrar modal usa uno
// import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  // Si la modal no está abierta, no renderizamos nada
  if (!isOpen) {
    return null;
  }

  // Estructura básica de la modal con overlay y contenido centralizado
  // Usando clases de Tailwind/Preline
  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center p-4" // Overlay oscuro y centrado
      onClick={onClose} // Permite cerrar la modal haciendo clic fuera del contenido
    >
      {/* Contenido de la modal */}
      {/* Añade onClick={(e) => e.stopPropagation()} para evitar que el clic en el contenido cierre la modal */}
      <div
        className="relative p-6 border w-full max-w-md shadow-lg rounded-md bg-white dark:bg-neutral-800 dark:border-neutral-700" // Contenedor de la modal
        onClick={(e) => e.stopPropagation()} // Evitar que el clic dentro cierre
      >
        {/* Encabezado de la modal */}
        <div className="flex justify-between items-center border-b pb-3 mb-3 dark:border-neutral-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
          {/* Botón de cerrar (opcional, puedes usar un icono X) */}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
            aria-label="Cerrar modal"
          >
            {/* Puedes poner aquí el ícono X */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Cuerpo de la modal (donde se renderizará el 'children') */}
        <div className="text-gray-700 dark:text-neutral-300">
          {children} {/* Aquí se inserta el contenido que le pases a la modal */}
        </div>

        {/* Pie de página de la modal (opcional, puedes añadir botones aquí) */}
        {/* <div className="mt-4 pt-3 border-t dark:border-neutral-700 flex justify-end">
          <button onClick={onClose} className="...">Cerrar</button>
        </div> */}

      </div>
    </div>
  );
};

export default Modal;