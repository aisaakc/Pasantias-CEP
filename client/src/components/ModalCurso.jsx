import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUniversity, 
  faPalette, 
  faClock, 
  faHashtag, 
  faDollarSign, 
  faCircleCheck,
  faUserTie,
  faCalendarAlt,
  faBookOpen,
  faXmark
} from '@fortawesome/free-solid-svg-icons';
import { useCursoStore } from '../store/curso';

function ModalCurso({ isOpen, onClose, selectedEventInfo }) {
  if (!isOpen) return null;

  const { status, fetchOpcionesCurso } = useCursoStore();
  const [selectedColor, setSelectedColor] = useState(selectedEventInfo?.color || '#4F46E5');
  
  useEffect(() => {
    fetchOpcionesCurso();
  }, [fetchOpcionesCurso]);

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
      color: formData.get('color'),
      duracion: formData.get('duracion'),
      codigo: formData.get('codigo'),
      costo: formData.get('costo'),
      status: formData.get('status'),
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
                <FontAwesomeIcon icon={faXmark} className="h-6 w-6" />
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
                    className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-300"
                    placeholder="Ingrese el nombre del curso"
                    defaultValue={selectedEventInfo?.title || ''}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FontAwesomeIcon icon={faBookOpen} className="h-5 w-5 text-gray-400" />
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
                    className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-300 resize-none"
                    placeholder="Describa el contenido del curso"
                    defaultValue={selectedEventInfo?.extendedProps?.descripcion || ''}
                  />
                  <div className="absolute top-3 right-3 pointer-events-none">
                    <FontAwesomeIcon icon={faBookOpen} className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 animate-fadeInUp" style={{ animationDelay: '300ms' }}>
                <div className="relative">
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
              
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="fecha_inicio" className="block text-sm font-medium text-gray-700">
                        Fecha/Hora de Inicio
                      </label>
                      <div className="relative">
                        <input
                          type="datetime-local"
                          id="fecha_inicio"
                          name="fecha_inicio"
                          required
                          className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-300"
                          defaultValue={selectedEventInfo?.start ? formatDateTimeInputValue(selectedEventInfo.start) : ''}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
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
                          className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-300"
                          defaultValue={selectedEventInfo?.end ? formatDateTimeInputValue(selectedEventInfo.end) : ''}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 animate-fadeInUp" style={{ animationDelay: '550ms' }}>
                  <label htmlFor="duracion" className="block text-sm font-medium text-gray-700">
                    Duración (horas)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="duracion"
                      name="duracion"
                      required
                      min="1"
                      className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-300"
                      placeholder="Ej: 40"
                      defaultValue={selectedEventInfo?.extendedProps?.duracion || ''}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FontAwesomeIcon icon={faClock} className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1 animate-fadeInUp" style={{ animationDelay: '600ms' }}>
                  <label htmlFor="codigo" className="block text-sm font-medium text-gray-700">
                    Código del Curso
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="codigo"
                      name="codigo"
                      required
                      className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-300"
                      placeholder="Ej: CUR-001"
                      defaultValue={selectedEventInfo?.extendedProps?.codigo || ''}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FontAwesomeIcon icon={faHashtag} className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 animate-fadeInUp" style={{ animationDelay: '650ms' }}>
                  <label htmlFor="costo" className="block text-sm font-medium text-gray-700">
                    Costo
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="costo"
                      name="costo"
                      required
                      min="0"
                      step="0.01"
                      className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="Ej: 299.99"
                      defaultValue={selectedEventInfo?.extendedProps?.costo || ''}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FontAwesomeIcon icon={faDollarSign} className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1 animate-fadeInUp" style={{ animationDelay: '700ms' }}>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Estado
                  </label>
                  <div className="relative">
                    <select
                      id="status"
                      name="status"
                      required
                      className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-300"
                      defaultValue={selectedEventInfo?.extendedProps?.status || ''}
                    >
                      <option value="">Seleccione un estado</option>
                      {status.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.nombre}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FontAwesomeIcon icon={faCircleCheck} className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1 animate-fadeInUp" style={{ animationDelay: '450ms' }}>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                  Color del Curso
                </label>
                <input
                  type="color"
                  id="color"
                  name="color"
                  defaultValue={selectedEventInfo?.color || '#4F46E5'}
                  className="w-full h-10 rounded-lg cursor-pointer border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

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
                    className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-300"
                    placeholder="Nombre del instructor"
                    defaultValue={selectedEventInfo?.extendedProps?.instructor || ''}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FontAwesomeIcon icon={faUserTie} className="h-5 w-5 text-gray-400" />
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