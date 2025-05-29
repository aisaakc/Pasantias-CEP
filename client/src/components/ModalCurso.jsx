import React, { useState, useEffect } from 'react';
import { useCursoStore } from '../store/cursoStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark,
        faSave,
        faTimes,
        faBook,
        faChalkboardTeacher, 
        faCheckCircle, 
        faHashtag, 
        faClock, 
        faMoneyBill, 
        faCalendarAlt, 
        faAlignLeft, 
        faPalette } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'sonner';

function ModalFecha({ fecha, curso, onClose=  [], onCursoSaved }) {
  const { modalidades, cursos, status, fetchOpcionesCurso, createCurso, updateCurso, loading, error } = useCursoStore();
  const [cursoSeleccionado, setCursoSeleccionado] = useState('');
  const [modalidadSeleccionada, setModalidadSeleccionada] = useState('');
  const [statusSeleccionado, setStatusSeleccionado] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [duracion, setDuracion] = useState('');
  const [codigo, setCodigo] = useState('');
  const [costo, setCosto] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [color, setColor] = useState('#4F46E5');
  const [shouldRender, setShouldRender] = useState(true);
  const [animationClass, setAnimationClass] = useState('animate-modal-in');
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await fetchOpcionesCurso();
    }; 
    loadData();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [fetchOpcionesCurso]);

  // Efecto para cargar datos del curso cuando se está editando
  useEffect(() => {
    if (curso) {
      setCursoSeleccionado(curso.id_nombre?.toString() || '');
      setModalidadSeleccionada(curso.id_modalidad?.toString() || '');
      setStatusSeleccionado(curso.id_status?.toString() || '');
      setDescripcion(curso.descripcion_corto || '');
      setDuracion(curso.duracion?.toString() || '');
      setCodigo(curso.codigo || '');
      setCosto(curso.costo?.toString() || '');
      
      // Formatear la fecha y hora para el input datetime-local
      if (curso.fecha_hora_inicio) {
        const fechaHoraInicio = new Date(curso.fecha_hora_inicio);
        setFechaInicio(fechaHoraInicio.toISOString().slice(0, 16));
      }
      
      if (curso.fecha_hora_fin) {
        const fechaHoraFin = new Date(curso.fecha_hora_fin);
        setFechaFin(fechaHoraFin.toISOString().slice(0, 16));
      }
      
      setColor(curso.color || '#4F46E5');
    } else if (fecha) {
      // Si es una nueva fecha, establecer la hora por defecto a las 9:00
      const fechaHoraInicio = new Date(fecha);
      fechaHoraInicio.setHours(9, 0, 0);
      setFechaInicio(fechaHoraInicio.toISOString().slice(0, 16));
      setFechaFin('');
    }
  }, [curso, fecha]);

  const handleClose = () => {
    setAnimationClass('animate-modal-out');
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 transform transition-all animate-scaleIn shadow-2xl">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <FontAwesomeIcon icon={faTimes} className="text-2xl text-red-500" />
            </div>
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all duration-300 hover:shadow-md"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      // Validaciones básicas
      if (!cursoSeleccionado || !modalidadSeleccionada || !statusSeleccionado) {
        setSubmitError('Por favor complete todos los campos requeridos (curso, modalidad y estado)');
        setIsSubmitting(false);
        return;
      }

      if (!fechaInicio) {
        setSubmitError('La fecha de inicio es requerida');
        setIsSubmitting(false);
        return;
      }

      // Validar que los valores sean números válidos
      const cursoId = parseInt(cursoSeleccionado);
      const modalidadId = parseInt(modalidadSeleccionada);
      const statusId = parseInt(statusSeleccionado);

      if (isNaN(cursoId) || isNaN(modalidadId) || isNaN(statusId)) {
        setSubmitError('Los IDs seleccionados no son válidos');
        setIsSubmitting(false);
        return;
      }

      // Validar duración si se proporciona
      let duracionValue = null;
      if (duracion) {
        duracionValue = parseInt(duracion);
        if (isNaN(duracionValue) || duracionValue < 0) {
          setSubmitError('La duración debe ser un número positivo');
          setIsSubmitting(false);
          return;
        }
      }

      // Validar costo si se proporciona
      let costoValue = null;
      if (costo) {
        costoValue = parseFloat(costo);
        if (isNaN(costoValue) || costoValue < 0) {
          setSubmitError('El costo debe ser un número positivo');
          setIsSubmitting(false);
          return;
        }
      }

      // Validar fechas si se proporciona fecha fin
      if (fechaFin) {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        if (inicio >= fin) {
          setSubmitError('La fecha de inicio debe ser anterior a la fecha de fin');
          setIsSubmitting(false);
          return;
        }
      }

      // Preparar datos del curso
      const cursoData = {
        id_nombre: cursoId,
        id_modalidad: modalidadId,
        id_status: statusId,
        fecha_hora_inicio: fechaInicio,
        fecha_hora_fin: fechaFin || null,
        costo: costoValue,
        descripcion_corto: descripcion || null,
        codigo: codigo || null,
        color: color,
        duracion: duracionValue
      };

      let response;
      if (curso) {
        // Si hay un curso seleccionado, actualizar
        cursoData.id_curso = curso.id_curso;
        response = await updateCurso(cursoData);
      } else {
        // Si no hay curso seleccionado, crear nuevo
        response = await createCurso(cursoData);
      }
      
      if (response) {
        // Mostrar mensaje de éxito con Sonner
        toast.success(`Curso ${curso ? 'actualizado' : 'registrado'} exitosamente`);
        
        // Notificar al componente padre que se guardó un curso
        if (typeof onCursoSaved === 'function') {
          onCursoSaved();
        }
        
        // Cerrar el modal
        handleClose();
      }
    } catch (error) {
      console.error('Error al procesar el curso:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          `Error al ${curso ? 'actualizar' : 'crear'} el curso. Por favor intente nuevamente.`;
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300" 
        onClick={handleClose}
      />
      
      <div 
        className={`relative w-full max-w-xl bg-white rounded-2xl shadow-2xl transform transition-all duration-300 ${
          animationClass
        } flex flex-col max-h-[90vh]`}
      >
        {/* Header */}
        <div className="relative p-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {curso ? `Editar Curso: ${curso.nombre_curso}` : 'Asignar Curso'}
            </h2>
            <button 
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full transform hover:rotate-90 duration-300"
            >
              <FontAwesomeIcon icon={faXmark} className="text-xl" />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Cargando opciones...</span>
            </div>
          ) : (
            <>
              {/* Sección de información básica */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Información Básica</h3>
                
                {/* Selects principales */}
                <div className="grid grid-cols-1 gap-6">
                  {[
                    { 
                      name: 'curso', 
                      icon: faBook, 
                      label: 'Curso', 
                      value: cursoSeleccionado,
                      onChange: (e) => setCursoSeleccionado(e.target.value),
                      options: cursos || [],
                      disabled: loading || !cursos?.length
                    },
                    { 
                      name: 'modalidad', 
                      icon: faChalkboardTeacher, 
                      label: 'Modalidad', 
                      value: modalidadSeleccionada,
                      onChange: (e) => setModalidadSeleccionada(e.target.value),
                      options: modalidades || [],
                      disabled: loading || !modalidades?.length
                    },
                    { 
                      name: 'status', 
                      icon: faCheckCircle, 
                      label: 'Estado', 
                      value: statusSeleccionado,
                      onChange: (e) => setStatusSeleccionado(e.target.value),
                      options: status || [],
                      disabled: loading || !status?.length
                    }
                  ].map((field, index) => (
                    <div 
                      key={`select-field-${field.name}`}
                      className="transition-all duration-300"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FontAwesomeIcon icon={field.icon} className="mr-2 text-blue-500" />
                        {field.label}
                      </label>
                      <select
                        id={`${field.name}-select`}
                        value={field.value}
                        onChange={field.onChange}
                        disabled={field.disabled}
                        className="w-full h-11 px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white transition-colors
                          focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                          hover:border-blue-300 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-500
                          appearance-none bg-no-repeat bg-right pr-10"
                        style={{
                          backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                          backgroundSize: "1.5em 1.5em"
                        }}
                      >
                        <option key={`${field.name}-default`} value="">-- Selecciona {field.label.toLowerCase()} --</option>
                        {field.options.map(option => (
                          <option 
                            key={`${field.name}-option-${option.id}`} 
                            value={option.id}
                          >
                            {option.nombre}
                          </option>
                        ))}
                      </select>
                      {field.disabled && field.options.length === 0 && (
                        <p className="mt-1 text-sm text-gray-500">
                          No hay {field.label.toLowerCase()}s disponibles
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Descripción */}
                <div className="transition-all duration-300">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faAlignLeft} className="mr-2 text-blue-500" />
                    Descripción
                  </label>
                  <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="w-full min-h-[120px] px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white transition-colors
                      focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                      hover:border-blue-300 resize-vertical"
                    placeholder="Ingrese la descripción detallada del curso..."
                  />
                </div>
              </div>

              {/* Sección de detalles */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Detalles del Curso</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Código y Duración */}
                  <div className="space-y-6">
                    <div className="transition-all duration-300">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FontAwesomeIcon icon={faHashtag} className="mr-2 text-blue-500" />
                        Código
                      </label>
                      <input
                        type="text"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                        className="w-full h-11 px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white transition-colors
                          focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                          hover:border-blue-300"
                        placeholder="Ingrese el código del curso"
                      />
                    </div>

                    <div className="transition-all duration-300">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FontAwesomeIcon icon={faClock} className="mr-2 text-blue-500" />
                        Duración (horas)
                      </label>
                      <input
                        type="number"
                        value={duracion}
                        onChange={(e) => setDuracion(e.target.value)}
                        min="0"
                        className="w-full h-11 px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white transition-colors
                          focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                          hover:border-blue-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="Ej: 40"
                      />
                    </div>
                  </div>

                  {/* Costo y Color */}
                  <div className="space-y-6">
                    <div className="transition-all duration-300">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FontAwesomeIcon icon={faMoneyBill} className="mr-2 text-blue-500" />
                        Costo
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={costo}
                          onChange={(e) => setCosto(e.target.value)}
                          min="0"
                          step="0.01"
                          className="w-full h-11 px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white transition-colors
                            focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                            hover:border-blue-300 pr-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="0.00"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      </div>
                    </div>

                    <div className="transition-all duration-300">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FontAwesomeIcon icon={faPalette} className="mr-2 text-blue-500" />
                        Color del Curso
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          className="w-12 h-12 p-1 rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300 transition-colors
                            [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded-lg
                            [&::-moz-color-swatch]:border-0 [&::-moz-color-swatch]:rounded-lg"
                        />
                        <input
                          type="text"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          className="flex-1 h-11 px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white transition-colors
                            focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                            hover:border-blue-300"
                          placeholder="#4F46E5"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección de fechas */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Período del Curso</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="transition-all duration-300">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-blue-500" />
                      Fecha y Hora de Inicio
                    </label>
                    <input
                      type="datetime-local"
                      value={fechaInicio}
                      onChange={(e) => setFechaInicio(e.target.value)}
                      className="w-full h-11 px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white transition-colors
                        focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                        hover:border-blue-300"
                    />
                  </div>

                  <div className="transition-all duration-300">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-blue-500" />
                      Fecha y Hora de Fin
                    </label>
                    <input
                      type="datetime-local"
                      value={fechaFin}
                      onChange={(e) => setFechaFin(e.target.value)}
                      className="w-full h-11 px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white transition-colors
                        focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                        hover:border-blue-300"
                    />
                  </div>
                </div>
              </div>

              {submitError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{submitError}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="border-t border-gray-100 p-6 bg-gray-50 rounded-b-2xl flex-shrink-0 mt-6">
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-lg text-gray-700 hover:text-gray-900 bg-white border border-gray-200 
                      hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow disabled:opacity-50 
                      disabled:cursor-not-allowed"
                  >
                    <FontAwesomeIcon icon={faTimes} className="mr-2" />
                    <span>Cancelar</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-2.5 rounded-lg text-white bg-gradient-to-r from-blue-600 to-cyan-600 
                      hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-sm hover:shadow-lg 
                      disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        <span>Guardando...</span>
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faSave} className="mr-2" />
                        <span>{curso ? 'Actualizar Curso' : 'Guardar Curso'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </form>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes modalOut {
          from { opacity: 1; transform: scale(1) translateY(0); }
          to { opacity: 0; transform: scale(0.95) translateY(10px); }
        }

        .animate-modal-in { animation: modalIn 0.3s ease-out; }
        .animate-modal-out { animation: modalOut 0.3s ease-out; }
      `}</style>
    </div>
  );
}

export default ModalFecha;
