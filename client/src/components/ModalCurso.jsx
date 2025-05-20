import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUniversity } from '@fortawesome/free-solid-svg-icons';

function ModalCurso({ isOpen, onClose, selectedEventInfo }) {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const cursoData = {
      nombre: formData.get('nombre'),
      descripcion: formData.get('descripcion'),
      fecha_inicio: formData.get('fecha_inicio'),
      fecha_fin: formData.get('fecha_fin'),
      instructor: formData.get('instructor'),
      idCurso: selectedEventInfo?.idCurso,
    };
    console.log('Datos del curso:', cursoData);
    onClose();
  };

  const formatDateTimeInputValue = (dateTimeString) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div
          className="fixed inset-0 bg-gradient-to-br from-gray-900/90 to-black/90 transition-all duration-300 ease-in-out backdrop-blur-md animate-fadeIn"
          onClick={onClose}
        />

        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all duration-300 ease-in-out sm:my-8 sm:w-full sm:max-w-lg animate-slideIn">
          <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 px-8 py-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 animate-fadeIn">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                {selectedEventInfo?.title ? (
                  <>
                    <FontAwesomeIcon icon={selectedEventInfo.icon} className="mr-2" />
                    {selectedEventInfo.title}
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faUniversity} className="mr-2" />
                    Agregar Curso
                  </>
                )}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" id="curso-form">
              <div className="space-y-1 animate-fadeInUp" style={{ animationDelay: '100ms' }}>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                  Nombre del Curso
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-300"
                    placeholder="Ingrese el nombre del curso"
                    defaultValue={selectedEventInfo?.title || ''}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-1 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
                  Descripción
                </label>
                <div className="relative">
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    rows="3"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-300 resize-none"
                    placeholder="Describa el contenido del curso"
                    defaultValue={selectedEventInfo?.extendedProps?.descripcion || ''}
                  />
                </div>
              </div>

              <div className="space-y-1 animate-fadeInUp" style={{ animationDelay: '300ms' }}>
                <label htmlFor="fecha_inicio" className="block text-sm font-medium text-gray-700">
                  Fecha/Hora de Inicio
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    id="fecha_inicio"
                    name="fecha_inicio"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-300"
                    defaultValue={selectedEventInfo?.start ? formatDateTimeInputValue(selectedEventInfo.start) : ''}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-1 animate-fadeInUp" style={{ animationDelay: '400ms' }}>
                <label htmlFor="fecha_fin" className="block text-sm font-medium text-gray-700">
                  Fecha/Hora de Finalización
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    id="fecha_fin"
                    name="fecha_fin"
                    required
                    min={selectedEventInfo?.start ? formatDateTimeInputValue(selectedEventInfo.start) : ''}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-300"
                    defaultValue={selectedEventInfo?.end ? formatDateTimeInputValue(selectedEventInfo.end) : ''}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                  Color
                </label>
                <input type="color" name="color" id="color" />
              </div>

              {/* Eliminamos el campo de Horario independiente */}

              <div className="space-y-1 animate-fadeInUp" style={{ animationDelay: '500ms' }}>
                <label htmlFor="instructor" className="block text-sm font-medium text-gray-700">
                  Instructor
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="instructor"
                    name="instructor"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-300"
                    placeholder="Nombre del instructor"
                    defaultValue={selectedEventInfo?.extendedProps?.instructor || ''}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-white px-8 py-5 border-t border-gray-200 animate-fadeInUp" style={{ animationDelay: '600ms' }}>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="curso-form"
                className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm"
              >
                {selectedEventInfo?.title ? 'Guardar Cambios' : 'Agregar Curso'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalCurso;