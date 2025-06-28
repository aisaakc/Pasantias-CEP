import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as iconos from '@fortawesome/free-solid-svg-icons';

export default function DeleteModal({ isOpen, onClose, onConfirm, itemName, itemType = "clasificación", itemIcon }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 transform transition-all animate-scaleIn shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
            <FontAwesomeIcon 
              icon={iconos.faExclamationTriangle} 
              className="text-4xl text-red-500 animate-pulse" 
            />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            Confirmar Eliminación
          </h3>
          <p className="text-gray-600 text-lg mb-2">
            ¿Seguro eliminar: &nbsp; {itemIcon && <FontAwesomeIcon icon={itemIcon} className="text-xl" />}
            &nbsp; "<b>{itemName}</b>"?
          </p>
          <p className="text-red-500 text-sm mt-2">
            Esta acción no se puede deshacer
          </p>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-300 hover:shadow-md flex items-center gap-2"
          >
            <FontAwesomeIcon icon={iconos.faTimes} />
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all duration-300 hover:shadow-md flex items-center gap-2"
          >
            <FontAwesomeIcon icon={iconos.faTrash} />
            Eliminar
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}