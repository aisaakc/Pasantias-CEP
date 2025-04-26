import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createClasificacionAsync,
  clearCreateClasificacionError,
  fetchParentClassificationsAsync
} from '../features/dashboard/dashboardFilterSlice';

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
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-opacity-40 backdrop-blur-sm overflow-y-auto">
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b border-gray-200 dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Crear Nueva Clasificación
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              aria-label="Cerrar"
            >
              <svg className="w-3 h-3" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="sr-only">Cerrar</span>
            </button>
          </div>

          {/* Body */}
          <div className="p-4 md:p-5 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={3}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Pertenece a (opcional)
                </label>
                <select
                  value={typeId}
                  onChange={(e) => setTypeId(e.target.value)}
                  className="w-full p-2 border rounded-md bg-white focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                >
                  <option value="">-- Principal --</option>
                  {parentClassificationsList.map((item) => (
                    <option key={item.id} value={item.id}>{item.nombre}</option>
                  ))}
                </select>
              </div>

              {createClasificacionError && (
                <div className="text-sm text-red-600 bg-red-100 p-2 rounded dark:bg-red-900 dark:text-red-300">
                  Error: {createClasificacionError}
                </div>
              )}
            </form>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
            <button
              onClick={onClose}
              type="button"
              className="py-2.5 px-5 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              type="submit"
              disabled={isLoadingCreateClasificacion}
              className="py-2.5 px-5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-lg dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50"
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
