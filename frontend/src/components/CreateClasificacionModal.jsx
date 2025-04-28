import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createClasificacionAsync,
  clearCreateClasificacionError,
  fetchParentClassificationsAsync
} from '../features/dashboard/dashboardFilterSlice';

import '../css/modal.css'
function CreateClasificacionModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const modalRef = useRef(null);

  const [nombre, setNombre] = React.useState('');
  const [descripcion, setDescripcion] = React.useState('');
  const [typeId, setTypeId] = React.useState('');

  const {
    isLoadingCreateClasificacion,
    createClasificacionError,
    parentClassificationsList
  } = useSelector((state) => state.dashboardFilter);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre) return alert('El nombre es obligatorio.');
  
    const nuevaClasificacion = {
      nombre,
      descripcion,
      type_id: typeId === '' ? null : parseInt(typeId, 10)
    };
  
    const result = await dispatch(createClasificacionAsync(nuevaClasificacion));
    if (createClasificacionAsync.fulfilled.match(result)) {
      dispatch(fetchParentClassificationsAsync());
      onClose();
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center  bg-opacity-73 backdrop-blur-sm overflow-y-auto transition-opacity duration-500 ease-out">
  <div className="relative p-4 w-full max-w-xl  animate-modalFadeIn">
    <div className="relative bg-gradient-to-t from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 transform scale-105 opacity-0 animate-fadeIn">

      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-t-2xl text-white">
        <h3 className="text-2xl font-semibold">Crear Nueva Clasificación</h3>
        <button
          onClick={onClose}
          className="text-white bg-transparent hover:bg-gray-600 hover:text-white rounded-full p-2"
          aria-label="Cerrar"
        >
          <svg className="w-4 h-4" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="sr-only">Cerrar</span>
        </button>
      </div>

      {/* Body */}
      <div className="p-8 space-y-6 bg-gray-800 text-white rounded-b-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Nombre */}
          <div>
            <label className="block text-lg font-medium mb-2">Nombre <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full p-4 text-lg border-b-2 border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white focus:outline-none transition duration-300 ease-in-out"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-lg font-medium mb-2">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={4}
              className="w-full p-4 text-lg border-b-2 border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white focus:outline-none transition duration-300 ease-in-out"
            />
          </div>

          {/* Selección de Clasificación */}
          <div>
            <label className="block text-lg font-medium mb-2">Pertenece a (opcional)</label>
            <select
              value={typeId}
              onChange={(e) => setTypeId(e.target.value)}
              className="w-full p-4 text-lg border-b-2 border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white focus:outline-none transition duration-300 ease-in-out"
            >
              <option value="">-- Principal --</option>
              {parentClassificationsList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Error Message */}
          {createClasificacionError && (
            <div className="text-sm text-red-600 bg-red-100 p-3 rounded dark:bg-red-900 dark:text-red-300 shadow-md">
              Error: {createClasificacionError}
            </div>
          )}

        </form>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-6 bg-gray-900 rounded-b-2xl">
        <button
          onClick={onClose}
          type="button"
          className="py-3 px-6 text-lg font-semibold text-gray-100 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 hover:text-blue-600 focus:ring-2 focus:ring-blue-300 transition-all duration-300 ease-in-out"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          type="submit"
          disabled={isLoadingCreateClasificacion}
          className="py-3 px-6 text-lg font-semibold text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:ring-blue-500 rounded-lg transition-all duration-300 ease-in-out disabled:opacity-50"
        >
          {isLoadingCreateClasificacion ? 'Creando...' : 'Crear'}
        </button>
      </div>
    </div>
  </div>
</div>

  

  );
}

export default CreateClasificacionModal;
