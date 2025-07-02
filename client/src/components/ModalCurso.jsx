import React, { useState, useEffect } from 'react';
import { useCursoStore } from '../store/cursoStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark,
        faSave,
        faTimes,
        faBook,
        faHashtag, 
        faClock, 
        faMoneyBill, 
        faCalendarAlt, 
        faAlignLeft, 
        faPalette,
        faUser,
        faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { toast } from 'sonner';
import { Editor, EditorState, RichUtils } from 'draft-js';
import 'draft-js/dist/Draft.css';
import draftToHtml from 'draftjs-to-html';
import { convertToRaw } from 'draft-js';
import { CLASSIFICATION_IDS } from '../config/classificationIds';
import useClasificacionStore from '../store/clasificacionStore';


function ModalFecha({ fecha, curso, onClose=  [], onCursoSaved, feriados }) {
  const { modalidades, cursos, status, fetchOpcionesCurso, createCurso, updateCurso, loading, error, roles_facilitador, fetchFacilitadores, resetState } = useCursoStore();
  const { parentClasifications, fetchParentClasifications } = useClasificacionStore();
  const [cursoSeleccionado, setCursoSeleccionado] = useState('');
  const [modalidadSeleccionada, setModalidadSeleccionada] = useState('');
  const [statusSeleccionado, setStatusSeleccionado] = useState('');
  const [facilitadorSeleccionado, setFacilitadorSeleccionado] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [descripcionHtml, setDescripcionHtml] = useState('');
  const [duracion, setDuracion] = useState('');
  const [codigo, setCodigo] = useState('');
  const [costo, setCosto] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [color, setColor] = useState('#4F46E5');
  const [animationClass, setAnimationClass] = useState('animate-modal-in');
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [holidayWarning, setHolidayWarning] = useState('');
  const [codigoCohorte, setCodigoCohorte] = useState('');
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [showHtmlModal, setShowHtmlModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsDataLoaded(false);
        console.log('Iniciando carga de datos del modal...');
        
        // Resetear el estado para asegurar datos frescos
        resetState();
        
        await Promise.all([
          fetchOpcionesCurso(),
          fetchFacilitadores()
        ]);
        console.log('Datos cargados exitosamente');
        setIsDataLoaded(true);
      } catch (error) {
        console.error('Error al cargar las opciones:', error);
        toast.error('Error al cargar las opciones del curso');
        setIsDataLoaded(true); // Marcar como cargado para evitar loops infinitos
      }
    }; 
    loadData();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [fetchOpcionesCurso, fetchFacilitadores, resetState]);

  // Debug: Monitorear cuando los datos están disponibles
  useEffect(() => {
    if (isDataLoaded) {
      console.log('Estado de datos cargados:', {
        cursos: cursos?.length || 0,
        modalidades: modalidades?.length || 0,
        status: status?.length || 0,
        facilitadores: roles_facilitador?.length || 0
      });
    }
  }, [isDataLoaded, cursos, modalidades, status, roles_facilitador]);

  // Efecto para cargar datos del curso cuando se está editando
  useEffect(() => {
    if (curso && isDataLoaded) {
      setCursoSeleccionado(curso.id_nombre?.toString() || '');
      setModalidadSeleccionada(curso.id_modalidad?.toString() || '');
      setStatusSeleccionado(curso.id_status?.toString() || '');
      setFacilitadorSeleccionado(curso.id_facilitador?.toString() || '');
      setDescripcion(curso.descripcion_corto || '');
      setDescripcionHtml(curso.descripcion_html || '');
      setDuracion(curso.duracion?.toString() || '');
      setCodigo(curso.codigo || '');
      setCosto(curso.costo?.toString() || '');
      setCodigoCohorte(curso.codigo_cohorte || '');
      
      const fechaInicio = curso.fecha_hora_inicio ? new Date(curso.fecha_hora_inicio) : new Date(fecha);
      const fechaFin = curso.fecha_hora_fin ? new Date(curso.fecha_hora_fin) : new Date(fecha);

      // Formatear a YYYY-MM-DDTHH:mm para el input
      const pad = (num) => num.toString().padStart(2, '0');
      const formatForInput = (date) => 
        `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;

      setFechaInicio(formatForInput(fechaInicio));
      setFechaFin(formatForInput(fechaFin));
      
      setColor(curso.color || '#4F46E5');
    } else if (fecha && isDataLoaded) {
      // Asegurarnos de que fecha sea un objeto Date válido
      const fechaObj = new Date(fecha);
      
      if (isNaN(fechaObj.getTime())) {
        console.error('Fecha inválida:', fecha);
        return;
      }
      
      // Extraer los componentes de la fecha
      const year = fechaObj.getFullYear();
      const month = String(fechaObj.getMonth() + 1).padStart(2, '0');
      const day = String(fechaObj.getDate()).padStart(2, '0');
      
      // Crear la fecha formateada con hora 13:00
      const fechaFormateada = `${year}-${month}-${day}T13:00`;
      setFechaInicio(fechaFormateada);
      setFechaFin('');
    }
  }, [curso, fecha, isDataLoaded]);

  // Efecto para llenar automáticamente código y costo cuando se selecciona un curso
  useEffect(() => {
    if (cursoSeleccionado && isDataLoaded && cursos.length > 0) {
      const cursoSeleccionadoData = cursos.find(c => c && c.id && c.id.toString() === cursoSeleccionado);
      
      if (cursoSeleccionadoData && cursoSeleccionadoData.adicional) {
        try {
          // Si adicional es un string, parsearlo como JSON
          const adicional = typeof cursoSeleccionadoData.adicional === 'string' 
            ? JSON.parse(cursoSeleccionadoData.adicional) 
            : cursoSeleccionadoData.adicional;
          
          console.log('Datos adicionales del curso seleccionado:', adicional);
          
          // Llenar el código si existe en el adicional (siempre actualizar)
          if (adicional.id) {
            setCodigo(adicional.id);
            console.log('Código llenado automáticamente:', adicional.id);
          }
          
          // Llenar el costo si existe en el adicional (siempre actualizar)
          if (adicional.costo !== undefined && adicional.costo !== null) {
            setCosto(adicional.costo.toString());
            console.log('Costo llenado automáticamente:', adicional.costo);
          }
        } catch (error) {
          console.error('Error al procesar datos adicionales del curso:', error);
        }
      } else {
        // Si el curso no tiene datos adicionales, limpiar los campos
        console.log('Curso seleccionado no tiene datos adicionales, limpiando campos');
        setCodigo('');
        setCosto('');
      }
    }
  }, [cursoSeleccionado, isDataLoaded, cursos]);

  useEffect(() => {
    if (!fechaInicio || !feriados || feriados.length === 0) {
      setHolidayWarning('');
      return;
    }

    const start = new Date(fechaInicio);
    const end = fechaFin ? new Date(fechaFin) : null;

    // Validar que las fechas sean válidas
    if (isNaN(start.getTime()) || (end && isNaN(end.getTime()))) {
      setHolidayWarning('');
      return;
    }

    // Verificar si la fecha de fin es previa a la fecha de inicio
    if (end && start >= end) {
      setHolidayWarning('⚠️ Error: La fecha y hora de fin debe ser posterior a la fecha y hora de inicio.');
      return;
    }

    // Si no hay fecha de fin, no mostrar alerta de feriados
    if (!end) {
      setHolidayWarning('');
      return;
    }

    const holidaysInRange = [];

    const getDayOnly = (date) => {
      const newDate = new Date(date);
      newDate.setHours(0, 0, 0, 0);
      return newDate;
    };

    const startDate = getDayOnly(start);
    const endDate = getDayOnly(end);

    feriados.forEach(feriado => {
      if (feriado && feriado.descripcion) {
        const fechas = feriado.descripcion.split(',').map(f => f.trim());
        
        fechas.forEach(fechaStr => {
          const parts = fechaStr.split('/');
          if (parts.length < 2) return;

          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1;

          if (parts.length === 3) {
            const year = 2000 + parseInt(parts[2], 10);
            const holidayDate = new Date(year, month, day);
            if (!isNaN(holidayDate.getTime())) {
              const holidayDayOnly = getDayOnly(holidayDate);
              if (holidayDayOnly >= startDate && holidayDayOnly <= endDate) {
                holidaysInRange.push({ name: feriado.nombre, date: holidayDate });
              }
            }
          } else {
            for (let year = startDate.getFullYear(); year <= endDate.getFullYear(); year++) {
              const holidayDate = new Date(year, month, day);
              if (!isNaN(holidayDate.getTime())) {
                const holidayDayOnly = getDayOnly(holidayDate);
                if (holidayDayOnly >= startDate && holidayDayOnly <= endDate) {
                  holidaysInRange.push({ name: feriado.nombre, date: holidayDate });
                }
              }
            }
          }
        });
      }
    });

    const uniqueHolidays = holidaysInRange.reduce((acc, current) => {
      if (!acc.find(item => item.date.getTime() === current.date.getTime())) {
        acc.push(current);
      }
      return acc;
    }, []).sort((a, b) => a.date - b.date);

    if (uniqueHolidays.length > 0) {
      const holidayNames = uniqueHolidays
        .map(h => `${h.name} (${h.date.toLocaleDateString('es-ES', { day: '2-digit', month: 'long' })})`)
        .join(', ');
      setHolidayWarning(`⚠️ Atención: El período seleccionado incluye los siguientes feriados: ${holidayNames}.`);
    } else {
      setHolidayWarning('');
    }
  }, [fechaInicio, fechaFin, feriados]);

  // Cargar clasificaciones principales si no están cargadas
  useEffect(() => {
    if (!parentClasifications || parentClasifications.length === 0) {
      fetchParentClasifications();
    }
  }, [parentClasifications, fetchParentClasifications]);

  // Obtener nombres e iconos dinámicos de las clasificaciones principales
  const getClasificacionInfo = (id, defaultIcon) => {
    const clasif = parentClasifications?.find(c => Number(c.id_clasificacion) === Number(id));
    return {
      nombre: clasif ? clasif.nombre : '',
      icono: clasif && clasif.nicono ? iconos[clasif.nicono] : defaultIcon
    };
  };

  const infoCurso = getClasificacionInfo(CLASSIFICATION_IDS.CURSOS);
  const infoModalidad = getClasificacionInfo(CLASSIFICATION_IDS.MODALIDAD);
  const infoStatus = getClasificacionInfo(CLASSIFICATION_IDS.STATUS);

  const handleClose = () => {
    setDescripcionHtml('');
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
        descripcion_html: descripcionHtml || null,
        codigo: codigo || null,
        color: color,
        duracion: duracionValue,
        codigo_cohorte: codigoCohorte || null
      };

      // Manejar el id_facilitador de manera segura
      if (facilitadorSeleccionado && facilitadorSeleccionado !== '') {
        const facilitadorId = parseInt(facilitadorSeleccionado);
        if (!isNaN(facilitadorId)) {
          cursoData.id_facilitador = facilitadorId;
          console.log('ID de facilitador asignado:', facilitadorId);
        } else {
          console.error('ID de facilitador inválido:', facilitadorSeleccionado);
          cursoData.id_facilitador = null;
        }
      } else {
        cursoData.id_facilitador = null;
      }

      console.log('Datos del curso a enviar:', cursoData);

      let response;
      if (curso) {
        // Si hay un curso seleccionado, actualizar
        cursoData.id_curso = curso.id_curso;
        console.log('Actualizando curso con datos:', cursoData);
        response = await updateCurso(cursoData);
      } else {
        // Si no hay curso seleccionado, crear nuevo
        console.log('Creando nuevo curso con datos:', cursoData);
        response = await createCurso(cursoData);
      }
      
      if (response) {
        // Mostrar mensaje de éxito con Sonner
        toast.success(`Cohorte ${curso ? 'actualizado' : 'registrado'} exitosamente`);
        
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
        className={`relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl transform transition-all duration-300 ${
          animationClass
        } flex flex-col max-h-[90vh]`}
      >
        {/* Header */}
        <div className="relative p-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent flex items-center gap-3">
              {curso ? (
                <>
                  <FontAwesomeIcon 
                    icon={curso.nombre_icono ? iconos[curso.nombre_icono] : faBook} 
                    className="text-blue-600" 
                  />
                  {`Editar Curso: ${curso.nombre_curso}`}
                </>
              ) : (
                'Asignar Cohorte'
              )}
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
          {loading || !isDataLoaded ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">Cargando opciones del curso...</p>
                <p className="text-gray-500 text-sm mt-2">Por favor espere un momento</p>
              </div>
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
                      icon: infoCurso.icono, 
                      label: infoCurso.nombre || 'Curso', 
                      value: cursoSeleccionado,
                      onChange: (e) => setCursoSeleccionado(e.target.value),
                      options: cursos || [],
                      disabled: loading || !isDataLoaded
                    },
                    { 
                      name: 'modalidad', 
                      icon: infoModalidad.icono, 
                      label: infoModalidad.nombre || 'Modalidad', 
                      value: modalidadSeleccionada,
                      onChange: (e) => setModalidadSeleccionada(e.target.value),
                      options: modalidades || [],
                      disabled: loading || !isDataLoaded
                    },
                    { 
                      name: 'status', 
                      icon: infoStatus.icono, 
                      label: infoStatus.nombre || 'Status', 
                      value: statusSeleccionado,
                      onChange: (e) => setStatusSeleccionado(e.target.value),
                      options: status || [],
                      disabled: loading || !isDataLoaded
                    },
                    { 
                      name: 'facilitador', 
                      icon: faUser, 
                      label: 'Facilitador', 
                      value: facilitadorSeleccionado,
                      onChange: (e) => {
                        const selectedValue = e.target.value;
                        console.log('Facilitador seleccionado (valor):', selectedValue);
                        console.log('Facilitador seleccionado (opción):', e.target.options[e.target.selectedIndex].text);
                        setFacilitadorSeleccionado(selectedValue);
                      },
                      options: roles_facilitador.map(f => ({
                        id: f.id_persona,
                        nombre: `${f.nombre} ${f.apellido}`
                      })) || [],
                      disabled: loading || !isDataLoaded
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
                        {!isDataLoaded || loading ? (
                          <option value="" disabled>Cargando opciones...</option>
                        ) : field.options && field.options.length > 0 ? (
                          [<option key={`${field.name}-default`} value="">-- Selecciona {field.label.toLowerCase()} --</option>,
                          ...field.options.map((option, index) => (
                            <option 
                              key={`${field.name}-option-${option.id || option.nombre || index}`} 
                              value={option.id}
                            >
                              {option.nombre}
                            </option>
                          ))]
                        ) : (
                          <option value="" disabled>No hay opciones disponibles</option>
                        )}
                      </select>
                      {(!isDataLoaded || loading) && (
                        <p className="mt-1 text-sm text-gray-500">
                          Cargando opciones...
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Descripción */}
                <div className="transition-all duration-300">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faAlignLeft} className="mr-2 text-blue-500" />
                    Descripción del Curso
                  </label>
                  <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="w-full min-h-[80px] px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white transition-colors
                      focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                      hover:border-blue-300 resize-vertical mb-4"
                    placeholder="Ingrese la descripción corta del curso..."
                  />
                </div>
                <div className="transition-all duration-300">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faAlignLeft} className="mr-2 text-blue-500" />
                    Contenido del Curso
                  </label>
                  <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-4">
                    {/* Barra de herramientas */}
                    <div className="flex gap-2 mb-3">
                      <button
                        type="button"
                        className="p-2 rounded hover:bg-blue-100 text-gray-700"
                        title="Negrita"
                        onClick={() => setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'))}
                      >
                        <b>B</b>
                      </button>
                      <button
                        type="button"
                        className="p-2 rounded hover:bg-blue-100 text-gray-700 italic"
                        title="Cursiva"
                        onClick={() => setEditorState(RichUtils.toggleInlineStyle(editorState, 'ITALIC'))}
                      >
                        I
                      </button>
                      <button
                        type="button"
                        className="p-2 rounded hover:bg-blue-100 text-gray-700 underline"
                        title="Subrayado"
                        onClick={() => setEditorState(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'))}
                      >
                        U
                      </button>
                      <button
                        type="button"
                        className="p-2 rounded hover:bg-blue-100 text-gray-700"
                        title="Lista con viñetas"
                        onClick={() => setEditorState(RichUtils.toggleBlockType(editorState, 'unordered-list-item'))}
                      >
                        • Lista
                      </button>
                      <button
                        type="button"
                        className="p-2 rounded hover:bg-blue-100 text-gray-700"
                        title="Lista numerada"
                        onClick={() => setEditorState(RichUtils.toggleBlockType(editorState, 'ordered-list-item'))}
                      >
                        1. Lista
                      </button>
                      <button
                        type="button"
                        className="p-2 rounded hover:bg-green-100 text-gray-700 ml-auto"
                        title="Ver HTML"
                        onClick={() => setShowHtmlModal(true)}
                      >
                        &lt;/&gt;
                      </button>
                    </div>
                    {/* Área editable */}
                    <div
                      className="min-h-[120px] p-3 rounded-lg border border-gray-200 focus-within:border-blue-400 bg-gray-50 transition"
                      style={{ cursor: "text" }}
                      onClick={() => {
                        document.querySelector('.DraftEditor-root').focus();
                      }}
                    >
                      <Editor
                        editorState={editorState}
                        onChange={setEditorState}
                        placeholder="Escribe el contenido del curso aquí..."
                      />
                    </div>
                  </div>
                  {/* Modal para mostrar el HTML generado */}
                  {showHtmlModal && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full relative">
                        <button
                          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
                          onClick={() => setShowHtmlModal(false)}
                        >
                          ×
                        </button>
                        <h3 className="text-lg font-bold mb-4">HTML generado</h3>
                        <textarea
                          className="w-full h-64 p-2 border border-gray-200 rounded bg-gray-50 font-mono text-xs"
                          readOnly
                          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
                        />
                      </div>
                    </div>
                  )}
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

                    {/* Código de Cohorte */}
                    <div className="transition-all duration-300">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FontAwesomeIcon icon={faHashtag} className="mr-2 text-blue-500" />
                        Código de Cohorte
                      </label>
                      <input
                        type="text"
                        value={codigoCohorte || ''}
                        onChange={(e) => setCodigoCohorte(e.target.value)}
                        className="w-full h-11 px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white transition-colors
                          focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                          hover:border-blue-300"
                        placeholder="Ingrese el código de la cohorte"
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

              {holidayWarning && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg my-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FontAwesomeIcon icon={faTriangleExclamation} className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">{holidayWarning}</p>
                    </div>
                  </div>
                </div>
              )}

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
                        <span>{curso ? 'Actualizar Cohorte' : 'Guardar Cohorte'}</span>
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

        .quill-editor-amplio .ql-container {
          min-height: 220px;
          height: 220px;
          font-size: 1rem;
        }

        /* Jodit Editor Custom Styles */
        .jodit-container {
          border-radius: 0.5rem !important;
          border: 1px solid #e5e7eb !important;
          transition: all 0.3s ease !important;
        }

        .jodit-container:focus-within {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1) !important;
        }

        .jodit-container:hover {
          border-color: #93c5fd !important;
        }

        .jodit-toolbar {
          border-bottom: 1px solid #e5e7eb !important;
          background: #f9fafb !important;
          border-radius: 0.5rem 0.5rem 0 0 !important;
        }

        .jodit-toolbar__box {
          background: transparent !important;
        }

        .jodit-ui-button {
          border-radius: 0.375rem !important;
          transition: all 0.2s ease !important;
        }

        .jodit-ui-button:hover {
          background-color: #e5e7eb !important;
        }

        .jodit-ui-button__icon {
          color: #374151 !important;
        }

        .jodit-workplace {
          border-radius: 0 0 0.5rem 0.5rem !important;
          background: white !important;
        }

        .jodit-status-bar {
          border-top: 1px solid #e5e7eb !important;
          background: #f9fafb !important;
          border-radius: 0 0 0.5rem 0.5rem !important;
          font-size: 0.75rem !important;
          color: #6b7280 !important;
        }

        .jodit-placeholder {
          color: #9ca3af !important;
          font-style: italic !important;
        }

        .jodit-editor__content {
          padding: 1rem !important;
          min-height: 200px !important;
        }

        /* Responsive adjustments for Jodit */
        @media (max-width: 768px) {
          .jodit-toolbar__box {
            flex-wrap: wrap !important;
          }
          
          .jodit-ui-button {
            margin: 2px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default ModalFecha;